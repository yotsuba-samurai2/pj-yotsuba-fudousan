import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeEditorialHero } from "@/components/shared/HomeEditorialHero";
import { HomeSchoolFinder } from "@/components/gakku/HomeSchoolFinder";
import { HomeTopicPanels } from "@/components/shared/HomeTopicPanels";
import { HomeOffMarketNote } from "@/components/shared/HomeOffMarketNote";
import { languages } from "@/config/languages";
import { homeLineHref } from "@/lib/home-conversion";

vi.mock("@/lib/gtag", () => ({ gaEvent: vi.fn() }));
import { gaEvent } from "@/lib/gtag";

describe("editorial home hero", () => {
  it.each(languages)("SSR is navigable, honest and does not send LINE messages in $code", ({code}) => {
    vi.mocked(gaEvent).mockClear();
    const hero = renderToStaticMarkup(<HomeEditorialHero locale={code} heroAlt="文京区・播磨坂の桜並木" />);
    const html = renderToStaticMarkup(<><HomeEditorialHero locale={code} heroAlt="文京区・播磨坂の桜並木" /><div id="home-school"><HomeSchoolFinder locale={code} /></div><HomeTopicPanels locale={code} /></>);
    expect((hero.match(/<h1[ >]/g) ?? [])).toHaveLength(1);
    expect(hero).toContain("四葉不動産｜");
    expect(hero).toContain(`href="${homeLineHref("family", code)}"`);
    expect(gaEvent).not.toHaveBeenCalled();
    expect(hero).not.toMatch(/href="(?:https?:\/\/(?:line\.me|liff\.line\.me)|line:)|<form|<iframe|<script|http-equiv="refresh"/i);
    const ids = [...html.matchAll(/\sid="([^"']+)"/g)].map(m => m[1]);
    for (const target of ["home-school", "home-business", "home-inheritance"]) {
      expect(hero).toContain(`href="#${target}"`);
      expect(ids.filter(id => id === target)).toHaveLength(1);
    }
    expect(hero).toContain('alt="文京区・播磨坂の桜並木"');
    expect(hero).toContain('fetchPriority="high"');
    expect(hero).toContain(renderToStaticMarkup(<HomeOffMarketNote locale={code} />));
    const visible = html.replace(/<[^>]*>/g, "");
    expect(visible).not.toMatch(/0[.．]33|多数|多數|大量|numerous|exclusive inventory|many off-market|公開前の確認事項|审批|審批/i);
    expect(html).not.toContain("chukai-033");
  });
  it("the actual parent owns the school target and mounts both native components", () => {
    const source = readFileSync("src/app/[locale]/(realestate)/HomePageContent.tsx", "utf8");
    expect(source).toContain("<HomeEditorialHero");
    expect(source).toContain('id="home-school"');
    expect(source).toContain("<HomeSchoolFinder");
    expect(source).toContain("<HomeTopicPanels");
  });
});
