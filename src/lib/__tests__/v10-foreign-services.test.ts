import { LABOR_SETUP_COPY } from "@/lib/labor/setup-copy";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { it, expect, vi, afterEach } from "vitest";
import type { LangCode } from "@/config/languages";
import type { CrossLink } from "@/lib/cross-links";
import { LABOR_SERVICE_COPY } from "@/lib/labor/service-copy";
import { LABOR_PLAN_COPY } from "@/lib/labor/plan-copy";
import { LEGAL_TOP_V10_COPY } from "@/lib/legal/top-copy";
const state=vi.hoisted(()=>({locale:"ja" as LangCode}));
vi.mock("@/lib/getRequestLocale",()=>({getRequestLocale:async()=>state.locale}));
vi.mock("@/components/shared/Breadcrumb",()=>({Breadcrumb:()=>null}));
vi.mock("@/components/shared/CtaBand",()=>({CtaBand:()=>null}));
vi.mock("@/components/shared/CrossLinkBanner",()=>({CrossLinkBanner:({link}:{link:CrossLink})=>createElement("aside",{},link.targets.map(t=>createElement("a",{key:t.href,href:(state.locale==="ja"?"":`/${state.locale}`)+t.href},t.anchor)))}));
afterEach(()=>vi.unstubAllEnvs());
const encode=(s:string)=>renderToStaticMarkup(createElement("span",null,s)).replace(/^<span>|<\/span>$/g,"");
for(const locale of ["ja","en","zh-tw","zh"] as const){
 it(`aligns foreign-employer labor page with the plan and responsibilities (${locale})`,async()=>{
  state.locale=locale;vi.stubEnv("NEXT_PUBLIC_SR_LAUNCHED","true");vi.resetModules();
  const mod=await import("@/app/[locale]/(labor)/labor/services/gaikokujin-koyo/page");
  const {LaborServicePage}=await import("@/components/shared/LaborServicePage");
  const e=await mod.default();const html=renderToStaticMarkup(await LaborServicePage(e.props));
  for(const text of [LABOR_SERVICE_COPY[locale].foreignTitle,LABOR_SERVICE_COPY[locale].chineseTitle,LABOR_SERVICE_COPY[locale].chineseBody,LABOR_PLAN_COPY[locale].responsibility,LABOR_SERVICE_COPY[locale].recruitmentBoundary])expect(html).toContain(encode(text));
  for(const item of [...LABOR_SETUP_COPY[locale].standardItems, ...LABOR_SETUP_COPY[locale].migrationItems])expect(html).toContain(encode(item));
  expect(html).toContain("33,000");expect(html).toContain("88,000");
  expect(html.match(/<h1\b/g)).toHaveLength(1);
  const prefix=locale==="ja"?"":`/${locale}`;
  expect(html).toContain(`href="${prefix}/legal/services/visa"`);
  expect(html).toContain(`href="${prefix}/labor/ryokin"`);
  expect((await mod.generateMetadata()).alternates?.canonical).toBe(`https://luck428.com${prefix}/labor/services/gaikokujin-koyo`);
 });
 for(const launched of [false,true])it(`separates visa applications and labor services (${locale}, launched=${launched})`,async()=>{
  state.locale=locale;vi.stubEnv("NEXT_PUBLIC_SR_LAUNCHED",String(launched));vi.resetModules();
  const mod=await import("@/app/[locale]/(legal)/legal/services/visa/page");
  const {LegalServicePage}=await import("@/components/shared/LegalServicePage");
  const e=await mod.default();const html=renderToStaticMarkup(await LegalServicePage(e.props));const c=LEGAL_TOP_V10_COPY[locale];
  expect(html).toContain(encode(c.consistency));expect(html).toContain(encode(c.chinese));
  expect(html).toContain(encode(launched?c.labor:c.unavailable));
  expect(html.match(/<h1\b/g)).toHaveLength(1);
  const prefix=locale==="ja"?"":`/${locale}`;
  if(launched){expect(html).toContain(`href="${prefix}/labor"`);expect(html).toContain(encode(c.dual));}
  else {expect(html).not.toMatch(/href="(?:\/en|\/zh-tw|\/zh)?\/labor(?:\/|")/);expect(html).not.toContain(encode(c.dual));}
  expect((await mod.generateMetadata()).alternates?.canonical).toBe(`https://luck428.com${prefix}/legal/services/visa`);
 });
}

for (const launched of [false, true]) {
  it(`keeps the existing Japanese employer guide consistent with V10 (launched=${launched})`, async () => {
    state.locale = "ja";
    vi.stubEnv("NEXT_PUBLIC_SR_LAUNCHED", String(launched));
    vi.resetModules();
    const mod = await import("@/app/[locale]/(legal)/legal/services/gaikokujin-shain/page");
    const { LegalServicePage } = await import("@/components/shared/LegalServicePage");
    const element = await mod.default();
    const html = renderToStaticMarkup(await LegalServicePage(element.props));
    const copy = LEGAL_TOP_V10_COPY.ja;
    expect(html).toContain(encode(copy.chinese));
    expect(html).toContain(encode(copy.consistency));
    expect(html).not.toContain("外部の翻訳会社を挟まず");
    if (launched) expect(html).toContain(encode(copy.dual));
    else expect(html).not.toMatch(/href="\/labor(?:\/|")/);
    expect((await mod.generateMetadata()).alternates?.canonical).toBe("https://luck428.com/legal/services/gaikokujin-shain");
  });
}
