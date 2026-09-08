/** Run against a disposable localhost production server with test authentication.
 * COLUMN_TEST_ORIGIN=http://127.0.0.1:54291 COLUMN_TEST_TOKEN=... node scripts/verify-column-mutations.mjs
 * Never use a production DB behind this server. Creates test columns via the real mutation APIs.
 * Optional COLUMN_TEST_FAILURE_FILE is consumed by a test-only cache-handler fault injector.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const origin = process.env.COLUMN_TEST_ORIGIN;
if (!origin || !['localhost', '127.0.0.1'].includes(new URL(origin).hostname)) throw new Error('Disposable localhost server required');
const token = process.env.COLUMN_TEST_TOKEN;
if (!token) throw new Error('COLUMN_TEST_TOKEN required');
const run = `cache-test-${Date.now()}`;
const locales = ['ja', 'en', 'zh-tw', 'zh'];
const results = [];
const path = (business, slug, locale = 'ja') => `${locale === 'ja' ? '' : `/${locale}`}${business === 'realestate' ? '' : `/${business}`}/column/${slug}`;
async function api(method, endpoint, body, expected = 200) {
  const response = await fetch(`${origin}/api/admin/columns${endpoint}`, {
    method, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    ...(body && { body: JSON.stringify(body) }),
  });
  const text = await response.text();
  assert.equal(response.status, expected, `${method} ${endpoint}: ${text}`);
  return JSON.parse(text);
}
async function check(url, expected) {
  const response = await fetch(origin + url, { redirect: 'manual' });
  const text = await response.text();
  assert.equal(response.status, expected, `${url}: expected ${expected}, got ${response.status}`);
  results.push({ path: url, status: response.status, cache: response.headers.get('x-nextjs-cache') });
  return text;
}
async function checkLocales(business, slug, allowed) {
  for (const locale of locales) {
    const html = await check(path(business, slug, locale), allowed.includes(locale) ? 200 : 404);
    if (allowed.includes(locale)) {
      const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1]);
      for (const targetLocale of locales) {
        assert.equal(links.includes(path(business, slug, targetLocale)), allowed.includes(targetLocale),
          `Language switch must reflect current publication: ${business}/${slug}/${targetLocale}`);
      }
    }
  }
}
// Optional build-time SSG fixture: also test existing prerendered HTML, not only on-demand ISR.
if (process.env.COLUMN_TEST_STATIC_SLUG) {
  const slug = process.env.COLUMN_TEST_STATIC_SLUG;
  const { columns } = await api('GET', '?business=labor');
  const existing = columns.find(column => column.slug === slug);
  assert.ok(existing, 'Build-time fixture must exist');
  await checkLocales('labor', slug, ['ja']);
  await api('PATCH', `/${existing.id}`, { locales: ['ja', 'en'] });
  await checkLocales('labor', slug, ['ja', 'en']);
  await api('PATCH', `/${existing.id}`, { status: 'deleted' });
  await checkLocales('labor', slug, []);
  await api('PATCH', `/${existing.id}`, { status: 'published', locales: ['ja'] });
}
for (const business of ['labor', 'legal', 'realestate']) {
  const slug = `${run}-${business}`;
  const data = { business, slug, title: 'Local cache verification', date: '2026-09-09', category: 'Test', excerpt: 'Test', content: 'Local cache verification.', status: 'published', locales: ['ja'] };
  // Cache the negative result before POST, then require the very first HTTP GET to see the creation.
  await checkLocales(business, slug, []);
  const { id } = await api('POST', '', data, 201);
  await checkLocales(business, slug, ['ja']);
  // Warm a positive cache entry; no sleeps/retry polling hides stale results.
  await check(path(business, slug), 200);
  await api('PATCH', `/${id}`, { locales: ['ja', 'en'] });
  await checkLocales(business, slug, ['ja', 'en']);
  await api('PATCH', `/${id}`, { locales: ['ja'] });
  await checkLocales(business, slug, ['ja']);
  await api('PATCH', `/${id}`, { status: 'deleted' });
  await checkLocales(business, slug, []);
  await api('PATCH', `/${id}`, { status: 'published' });
  await check(path(business, slug), 200);
  await api('PATCH', `/${id}`, { status: 'draft' });
  await checkLocales(business, slug, []);
  await api('PATCH', `/${id}`, { status: 'published', locales: [] });
  await checkLocales(business, slug, locales);
  // Empty locales compatibility through upsert, then unpublished through upsert.
  await api('POST', '?upsert=1', { ...data, locales: [], status: 'draft' });
  await checkLocales(business, slug, []);
  await api('POST', '?upsert=1', { ...data, locales: [] });
  await checkLocales(business, slug, locales);
  const newSlug = `${slug}-renamed`;
  await checkLocales(business, newSlug, []);
  await api('PATCH', `/${id}`, { slug: newSlug });
  await checkLocales(business, slug, []);
  await checkLocales(business, newSlug, locales);
  let currentBusiness = business;
  if (business === 'labor') {
    await checkLocales('legal', newSlug, []);
    await api('PATCH', `/${id}`, { business: 'legal' });
    await checkLocales('labor', newSlug, []);
    await checkLocales('legal', newSlug, locales);
    currentBusiness = 'legal';
  }
  await api('DELETE', `/${id}`);
  await checkLocales(currentBusiness, newSlug, []);
  // upsert creation also clears an already cached 404.
  const created = await api('POST', '?upsert=1', { ...data, slug: newSlug, locales: [] });
  await checkLocales(business, newSlug, locales);
  await api('DELETE', `/${created.id}`);
}
if (process.env.COLUMN_TEST_PAGINATION === '1') {
  const ids = [];
  const url = '/en/labor/column/page/2';
  await check(url, 404); // The disposable fixture starts with no English articles.
  for (let i = 0; i < 21; i++) {
    const { id } = await api('POST', '', {business:'labor',slug:`${run}-page-${i}`,title:`Pagination ${i}`,date:'2026-09-09',category:'Test',excerpt:'Test',content:'Test',status:'published',locales:['en']}, 201);
    ids.push(id);
  }
  await check(url, 200);
  await check(url, 200);
  await api('PATCH', `/${ids[20]}`, {status:'deleted'});
  await check(url, 404);
  for (const id of ids) await api('DELETE', `/${id}`);
}
if (process.env.COLUMN_TEST_FAILURE_FILE) {
  const failureFile = process.env.COLUMN_TEST_FAILURE_FILE;
  const data = {business:'labor',slug:`${run}-failure`,title:'Cache failure',date:'2026-09-09',category:'Test',excerpt:'Test',content:'Test',status:'published',locales:[]};
  const { id } = await api('POST','',data,201);
  await check(path('labor',data.slug),200);
  await fs.writeFile(failureFile, 'fail');
  try {
    await api('PATCH',`/${id}`,{status:'draft'},500);
    // DB mutation has completed; the API must still report cache failure.
    const saved = await api('GET',`/${id}`);
    assert.equal(saved.column.status,'draft');
    results.push({failure:'asynchronous cache storage rejection',status:500,dbStatus:saved.column.status});
  } finally { await fs.unlink(failureFile); }
  await api('PATCH',`/${id}`,{status:'draft'});
  await check(path('labor',data.slug),404);
  await api('DELETE',`/${id}`);
}
console.log(JSON.stringify({ok:true,checks:results.length,results},null,2));
