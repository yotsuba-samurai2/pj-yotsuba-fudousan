/**
 * Preflight only. Compares candidate manuscripts with the generated editorial
 * records and the translations present in repository-backed link targets.
 * No network, DB, external model, review ledger or publishing operation.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const spec = {
  labor: ["seed-labor-columns", "labor-columns-seed"],
  legal: ["seed-souzoku-legal-columns", "souzoku-legal-columns-seed"],
  realestate: ["seed-realestate-columns-daily", "realestate-columns-daily-seed"],
};
const langs = ["ja", "en", "zh-tw", "zh"];
const text = (file) => readFileSync(file, "utf8");
const key = (a) => a.business + ":" + a.slug;
const hash = (a) => createHash("sha256").update(JSON.stringify(a)).digest("hex");
const git = (args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 128 * 1024 * 1024 });
const plain = (s) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").trim();

export function generatedArray(src) {
  const match = src.match(/export const \w+[^=]*= (\[[\s\S]*\]);\s*$/);
  return match ? JSON.parse(match[1]) : null;
}

/** Bound the Japanese display metadata to the specific numbered spec; do not execute a generator. */
export function registryRecords(source) {
  const records=new Map();
  for (const m of source.matchAll(/file:\s*"([^"]+\.md)"\s*,\s*slug:\s*"([^"]+)"/g)) {
    const end=source.indexOf("\n  },", m.index);
    if (end<0) continue;
    const spec=source.slice(m.index,end);
    const literal=(field)=> {
      const found=spec.match(new RegExp("^\\s*"+field+":\\s*(\"(?:\\\\.|[^\"\\\\])*\")\\s*,","m"));
      if (!found) return undefined;
      try{return JSON.parse(found[1]);}catch{return undefined;}
    };
    records.set(m[2], {file:m[1],title:literal("title"),excerpt:literal("excerpt"),signature:hash(spec)});
  }
  return records;
}
export const supplementalSeedFile = (name) => /-seed(?:-p\d+[a-z]?)?\.ts$/.test(name);

export function splitSource(raw, locale) {
  const normalized = raw.replace(/\r\n/g, "\n");
  if (locale === "ja") return { body: normalized.trim(), metadata: {} };
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(normalized);
  if (!m) throw new Error("translated frontmatter is missing");
  const metadata = {};
  for (const line of m[1].split("\n")) {
    const pair = line.match(/^([a-zA-Z-]+):\s*(.*)$/);
    if (pair) metadata[pair[1]] = pair[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return { body: m[2].trim(), metadata };
}

export function displayedFaq(body) {
  const blocks = body.split(/^## [^\n]*\n/gm).filter((b) => /^\*\*Q\.\s*/m.test(b));
  if (blocks.length !== 1) throw new Error("expected one FAQ section, saw " + blocks.length);
  const block = blocks[0], qs = [...block.matchAll(/^\*\*Q\.\s*([^\n]+?)\*\*\s*\n\s*A\.\s*/gm)];
  return qs.map((q, i) => ({ question: plain(q[1]), answer: plain(block.slice(q.index + q[0].length, qs[i + 1]?.index ?? block.length)) }));
}

export function internalLink(href, locale) {
  if (href.startsWith("#")) return null;
  const url = new URL(href, "https://luck428.com/");
  if (url.hostname !== "luck428.com" && url.hostname !== "www.luck428.com") return null;
  const m = url.pathname.match(/^\/(en|zh-tw|zh)(?=\/|$)/);
  const actualLocale = m?.[1] ?? "ja";
  return { actualLocale, matches: actualLocale === locale, base: (m ? url.pathname.slice(m[0].length) : url.pathname).replace(/\/$/, "") || "/", relative: href.startsWith("/") && !href.startsWith("//") };
}

function columnRoute(target) {
  const m = /^\/(?:(legal|labor)\/)?column\/([^/]+)$/.exec(target);
  return m ? (m[1] ?? "realestate") + ":" + m[2] : undefined;
}

/** Read only literal route/locale declarations; do not infer translations for unknown dynamic pages. */
export function fixedLocalePolicy(source) {
  const policy = new Map();
  const clean = source.replace(/^\s*\/\/.*$/gm,"").replace(/\/\*[\s\S]*?\*\//g,"");
  for (const group of clean.matchAll(/const STATIC_(REALESTATE|LEGAL|LABOR)\s*:[^=]*=\s*\[([\s\S]*?)^\];/gm)) {
    for (const obj of group[2].matchAll(/\{([^{}]*)\}/g)) {
      const src = obj[1], literal = /(?:^|,)\s*path:\s*"([^"]*)"\s*(?=,|$)/.exec(src);
      if (!literal) continue;
      let route = literal[1] || "/";
      if (group[1] === "LEGAL" && route !== "/legal" && !route.startsWith("/legal/")) route = "/legal" + (route === "/" ? "" : route);
      if (group[1] === "LABOR" && route !== "/labor" && !route.startsWith("/labor/")) route = "/labor" + (route === "/" ? "" : route);
      const match = /(?:^|,)\s*locales:\s*\[((?:\s*"(?:ja|en|zh-tw|zh)"\s*,?)+)\]\s*(?=,|$)/.exec(src);
      const values = match ? [...match[1].matchAll(/"(ja|en|zh-tw|zh)"/g)].map(m => m[1]) : null;
      if (values?.length) policy.set(route,values);
      else if (!policy.has(route)) policy.set(route, /(?:^|,)\s*locales:|\.\.\./.test(src) ? null : langs);
    }
  }
  return policy;
}

export function compareProjection(file, locale, rendered, known, staticPolicy = new Map()) {
  const errors = [], warnings = [];
  if (!rendered) return { errors: ["generated translation absent"], warnings, links: [] };
  const { body, metadata } = splitSource(file, locale);
  if (rendered.content !== body) errors.push("source body differs from generated article");
  if (locale !== "ja") for (const field of ["title", "excerpt"]) {
    if (!metadata[field] || metadata[field] !== rendered[field]) errors.push("translation " + field + " differs from generated value");
  }
  const faq = displayedFaq(body);
  if (faq.length !== 4 || faq.some((q) => !q.question || !q.answer)) errors.push("source must contain four non-empty FAQ pairs");
  if (JSON.stringify(faq) !== JSON.stringify(rendered.faq)) errors.push("FAQ shown in body differs from generated structured FAQ");
  const links = new Set();
  for (const m of body.matchAll(/(?<!!)\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const info = internalLink(m[1], locale);
    if (!info) continue;
    if (!info.matches) errors.push("wrong locale: " + m[1]);
    if (!info.relative) warnings.push("prefer a relative URL: " + m[1]);
    links.add(info.base);
    const target = columnRoute(info.base);
    if (!target) {
      const available = staticPolicy.get(info.base);
      if (available && !available.includes(locale)) errors.push("fixed target does not publish " + locale + ": " + info.base);
      else if (!available) warnings.push("static locale policy not established: " + info.base);
      continue;
    }
    const targetRecords = known.get(target);
    if (!targetRecords) warnings.push("no repository seed for " + target + "; database-only target not verified");
    else if (locale !== "ja" && !targetRecords.some((r) =>
      (!r.locales?.length || r.locales.includes(locale)) && !!r.translations?.[locale]?.content?.trim()
    )) errors.push("known target has no enabled " + locale + " article: " + target);
  }
  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)], links: [...links].sort() };
}

// This function never edits approval data or loads an external review.
export function inspectProjectionSet(mode, arg) {
  const files = new Map(), specs = new Map(), daily = new Map(), known = new Map(), candidates = new Set(), warnings = [];
  const staticPolicy = fixedLocalePolicy(text("src/app/sitemap.ts"));
  let base;
  if (mode === "--base") {
    if (!/^[\w./-]+$/.test(arg) || arg.startsWith("-")) throw new Error("invalid base reference");
    base = git(["rev-parse", "--verify", arg + "^{commit}"]).trim();
    if (!/^[0-9a-f]{40,64}$/.test(base)) throw new Error("base commit not resolved");
  }
  for (const [business, [generator, seed]] of Object.entries(spec)) {
    const seedFile = "src/lib/data/" + seed + ".ts";
    const current = generatedArray(text(seedFile));
    if (!current) throw new Error("unreadable generated seed: " + seedFile);
    const generatorFile = "scripts/" + generator + ".ts";
    const registry = registryRecords(text(generatorFile));
    const oldRegistry = base ? registryRecords(git(["show",base+":"+generatorFile])) : new Map();
    const old = base ? generatedArray(git(["show", base + ":" + seedFile])) : [];
    if (!old) throw new Error("unreadable baseline seed: " + seedFile);
    const oldByKey = new Map(old.map((a) => [key(a), hash(a)]));
    for (const a of current) {
      const k = key(a);
      if (daily.has(k)) throw new Error("duplicate key: " + k);
      daily.set(k, a);
      if (registry.has(a.slug)) {
        const rec=registry.get(a.slug); specs.set(k,rec);
        files.set(k, langs.map((l) => "scripts/" + business + "-columns/" + (l === "ja" ? "" : l + "/") + rec.file));
        if (base && oldRegistry.get(a.slug)?.signature !== rec.signature) candidates.add(k);
      }
      if (base && oldByKey.get(k) !== hash(a)) candidates.add(k);
    }
  }
  for (const name of readdirSync("src/lib/data").filter(supplementalSeedFile)) {
    let records;
    try { records = generatedArray(text("src/lib/data/" + name)); } catch { continue; }
    if (!records) continue; // legacy non-JSON TS module; never assume its route is dead
    for (const r of records) {
      if (!r?.business || !r?.slug) continue;
      const k = key(r); if (!known.has(k)) known.set(k, []); known.get(k).push(r);
    }
  }
  if (mode === "--keys") {
    // Only article keys enter from the frozen review artifact. Never accept input paths.
    for (const key of arg) candidates.add(key);
  } else if (mode === "--manifest") {
    for (const r of JSON.parse(text(arg))) candidates.add(r.key);
  } else {
    const scopedPaths=["scripts/labor-columns","scripts/legal-columns","scripts/realestate-columns"];
    const change = new Set([...git(["diff","--name-only",base,"--",...scopedPaths]).split("\n"), ...git(["ls-files","--others","--exclude-standard","--",...scopedPaths]).split("\n")].filter(Boolean));
    for (const [k, names] of files) for (const f of names) if (change.has(f)) { candidates.add(k); change.delete(f); }
    for (const f of change) if (/^scripts\/(?:labor|legal|realestate)-columns\/(?:en\/|zh\/|zh-tw\/)?\d+[^/]*\.md$/.test(f)) {
      const stem = path.basename(f).replace(/^\d+-/,"").replace(/\.md$/,"");
      const business = f.split("/")[1].replace(/-columns$/,"");
      if (!existsSync(f)) { warnings.push("removed manuscript outside current seed registry: " + f); continue; }
      // A brand new daily draft absent from its generator must not silently pass.
      if (!known.has(business + ":" + stem)) candidates.add(business + ":" + stem);
      else warnings.push("existing supplemental-series manuscript outside daily registry: " + f);
    }
  }
  const failures = [], errorsByKey = new Map();
  let processed = 0;
  for (const k of [...candidates].sort()) {
    const art = daily.get(k), names = files.get(k), scoped = [], articleErrors = [];
    errorsByKey.set(k, articleErrors);
    const fail = (s) => { articleErrors.push(s); failures.push(k + ": " + s); };
    if (!art || !names || names.length !== 4) { fail("generated record or four source paths missing"); continue; }
    const meta=specs.get(k);
    for (const field of ["title","excerpt"]) {
      if (meta?.[field] === undefined) warnings.push(k+": Japanese registry literal not statically known for "+field);
      else if (meta[field] !== art[field]) fail("Japanese registry "+field+" differs from generated value");
    }
    for (const [i,l] of langs.entries()) {
      try {
        if (!existsSync(names[i])) throw new Error("source file missing: " + names[i]);
        const out = compareProjection(text(names[i]),l,i?art.translations?.[l]:art,known,staticPolicy);
        for (const e of out.errors) fail(l + ": " + e);
        for (const w of out.warnings) warnings.push(k + "/" + l + ": " + w);
        scoped.push(out.links);
        processed++;
      } catch(e) { fail(l + ": " + e.message); }
    }
    if (scoped.length===4) for (let i=1;i<4;i++) {
      if (JSON.stringify(scoped[i]) !== JSON.stringify(scoped[0])) warnings.push(k+"/"+langs[i]+": normalized internal targets differ from Japanese; check intent rather than silently assuming a broken link");
    }
  }
  return { failures, errorsByKey, warnings: [...new Set(warnings)], processed, count: candidates.size };
}

/** A projection check may remove an independently approved key, but never creates an approval. */
export function constrainProjection(result, keys, audit) {
  const held = new Map(result.held.map((r) => [r.key, [...r.reasons]])), blocked = new Set();
  for (const k of new Set(keys)) {
    const reasons = audit?.errorsByKey?.get(k);
    if (Array.isArray(reasons) && !reasons.length) continue;
    blocked.add(k);
    const notes = reasons?.length ? reasons.slice(0, 8) : ["検査結果を取得できません"];
    held.set(k, [...new Set([...(held.get(k) ?? []), ...notes.map((v) => "原稿・翻訳投影検査: " + v)])]);
  }
  return { reviews: result.reviews.filter((r) => !blocked.has(r.key)), held: [...held].map(([key, reasons]) => ({key, reasons})) };
}

function main(args) {
  if (args.length !== 2 || !["--base","--manifest"].includes(args[0])) throw new Error("Usage: node scripts/check-column-projection.mjs --base <commit> | --manifest <file>");
  const {failures, warnings, processed, count} = inspectProjectionSet(args[0], args[1]);
  for (const w of warnings) console.warn("WARN",w);
  for (const e of failures) console.error("HOLD",e);
  console.log("Column preflight:", count, "candidate(s),",processed,"locale projection(s),",failures.length,"error(s),",new Set(warnings).size,"warning(s). No editorial approval or publication.");
  if (failures.length) process.exitCode = 1;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) main(process.argv.slice(2));
