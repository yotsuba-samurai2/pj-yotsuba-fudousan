import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HOME_ENTRIES, HOME_LINE_TOPICS, getHomeLineTopic, homeLineHref } from "@/lib/home-conversion";
import { HomeTopicPanels } from "@/components/shared/HomeTopicPanels";
import { addLocalePrefix } from "@/lib/locale";
import { languages } from "@/config/languages";
import { HOME_TOPIC_COPY } from "@/lib/home-topic-copy";

describe("local consultation home", () => {
  it.each(languages)("exposes honest human service routes and proposed messages for $code", ({code}) => {
    const c = HOME_ENTRIES[code];
    expect(c.h1.startsWith("四葉不動産｜")).toBe(true);
    expect(c.meta.startsWith("四葉不動産｜")).toBe(true);
    expect(c.h1).not.toMatch(/必ず|限定物件多数|独占|最多|入学保証/);
    const html = renderToStaticMarkup(<HomeTopicPanels locale={code} />);
    for (const path of ["/gakku", "/gakku/sales", "/souzoku", "/toushi", "/global"])
      expect(html).toContain(`href="${addLocalePrefix(path,code)}"`);
    for (const t of HOME_LINE_TOPICS) {
      expect(homeLineHref(t,code)).toBe(addLocalePrefix("/line",code)+"?topic="+t);
      expect(c.lines[t].length).toBeGreaterThan(18);
    }
    expect(html).not.toMatch(/bunkyo\/chukai-033|0\.33/);
    expect(html).toContain('id="home-business"');
    expect(html).toContain('id="home-inheritance"');
    expect(html).toContain(`href="${addLocalePrefix("/column/shuro-ikou-shien-bukken-youto-chiiki-youken",code)}"`);
    expect(html).toContain('href="/column/souzoku-jikka-uru-nokosu"');
    expect(html).toContain(`href="${addLocalePrefix("/legal",code)}"`);
    expect(html).toContain(`https://luck428.com${addLocalePrefix("/legal",code)}`);
    expect((html.match(/NSK_CertifiedRecordView/g) ?? []).length).toBe(1);
    expect(html).toContain("https://www.jfc.go.jp/n/finance/search/01_sinkikaigyou_m.html");
    expect(html).toContain("https://kyoujinnka.smrj.go.jp/");
    expect(html).toContain("<details");
    const translatedJapaneseLabel = { en: "Article in Japanese", "zh-tw": "日文文章", zh: "日文文章" };
    if (code !== "ja") expect(html).toContain(translatedJapaneseLabel[code]);
  });
  it.each(languages)("attributes both qualifications to the representative, preserving separate contracts in $code", ({code}) => {
    const qualifications = {
      ja: "代表の浦松丈二は行政書士、社会保険労務士です。",
      en: "Our representative, Joji Uramatsu, is an administrative scrivener and a certified labor and social security attorney.",
      "zh-tw": "代表浦松丈二是行政書士，也是社會保險勞務士。",
      zh: "代表浦松丈二是行政书士，也是社会保险劳务士。",
    };
    const separate = {
      ja: "行政書士業務は不動産仲介とは別契約です。",
      en: "Administrative scrivener services are contracted separately from property brokerage.",
      "zh-tw": "行政書士業務與不動產仲介分別簽約。",
      zh: "行政书士业务与房地产中介分别签约。",
    };
    const html = renderToStaticMarkup(<HomeTopicPanels locale={code} />);
    const inheritance = html.split('id="home-inheritance"')[1].split("</article>")[0];
    expect(HOME_TOPIC_COPY[code].legalBody.startsWith(qualifications[code])).toBe(true);
    expect(inheritance).toContain(qualifications[code]);
    expect(inheritance).toContain("四葉行政書士事務所");
    expect(inheritance).toContain(separate[code]);
    expect(html).toContain(HOME_TOPIC_COPY[code].separation);
  });
  it("only accepts closed topic choices, never a URL or free text", () => {
    for (const good of HOME_LINE_TOPICS) expect(getHomeLineTopic(good)).toBe(good);
    for (const input of [null, "", "family\n", ["family"], "https://example.org", "unknown", "family&phone=abc"])
      expect(getHomeLineTopic(input)).toBeNull();
  });
  it("retains the Japanese group site name and distinguishes unpublished-on-this-site from exclusive inventory", () => {
    expect(HOME_ENTRIES.ja.meta.endsWith("｜四葉グループ")).toBe(true);
    expect(HOME_ENTRIES.ja.lead).toContain("募集状況を確認");
    expect(HOME_ENTRIES.ja.lead).not.toMatch(/常時|独占|多数|未公開\d/);
  });
});
