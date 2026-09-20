import type { LangCode } from "@/config/languages";
import type { PublicProperty } from "@/lib/property-shared";

/**
 * 物件 → 既存の解説ページの対応表（レビュー対象の正本はこの1ファイル）。
 * - 条件は物件の確定属性（category / dealType）だけで判定する。用途の可否を推測しない。
 * - リンク先は実在し、locales に挙げたロケールで公開されているページに限る
 *   （property-related-links.test.ts が page.tsx の実在を検査する）。
 * - 対象外にしたもの：/inshokuten・/minpaku（ja単独公開、かつ「この物件で営業できる」と
 *   読める導線になるため。店舗可否は貸主判断＝確定データで条件を表現できない）。
 */
export type RelatedLinkRule = {
  id: string;
  path: string;
  locales: readonly LangCode[];
  priority: number;
  when: (p: Pick<PublicProperty, "category" | "dealType">) => boolean;
  label: Record<LangCode, string>;
};

const ALL: readonly LangCode[] = ["ja", "en", "zh-tw", "zh"];

export const PROPERTY_RELATED_LINKS: readonly RelatedLinkRule[] = [
  {
    id: "group-home", path: "/group-home", locales: ALL, priority: 10, when: (p) => p.category === "gh",
    label: { ja: "グループホーム開設と物件確保の流れ", en: "Opening a group home: securing a property and the designation process", "zh-tw": "開設團體家屋：確保物件與指定申請的流程", zh: "开设团体之家：确保物件与指定申请的流程" },
  },
  {
    id: "souzoku", path: "/souzoku", locales: ALL, priority: 10, when: (p) => p.category === "souzoku",
    label: { ja: "不動産を相続したときの管理・活用・売却", en: "Managing, utilizing, or selling inherited property", "zh-tw": "繼承不動產後的管理・活用・出售", zh: "继承不动产后的管理・活用・出售" },
  },
  {
    id: "toushi", path: "/toushi", locales: ALL, priority: 10, when: (p) => p.category === "toushi",
    label: { ja: "投資用不動産のご相談", en: "Consultation on investment property", "zh-tw": "投資用不動產諮詢", zh: "投资用不动产咨询" },
  },
  {
    id: "services", path: "/services", locales: ALL, priority: 50, when: () => true,
    label: { ja: "不動産取引のご案内", en: "Our real estate services", "zh-tw": "不動產交易服務說明", zh: "不动产交易服务说明" },
  },
  {
    id: "global-chinese", path: "/global/chinese", locales: ALL, priority: 60, when: () => true,
    label: { ja: "中国語でのご相談（繁体字・簡体字）", en: "Consultation in Chinese (Traditional / Simplified)", "zh-tw": "以中文諮詢（繁體・簡體）", zh: "用中文咨询（繁体・简体）" },
  },
];

const MAX_LINKS = 4;

export function relatedLinksFor(
  p: Pick<PublicProperty, "category" | "dealType">,
  locale: LangCode,
): Array<{ id: string; path: string; label: string }> {
  return PROPERTY_RELATED_LINKS.filter((r) => r.locales.includes(locale) && r.when(p))
    .slice()
    .sort((a, b) => a.priority - b.priority)
    .slice(0, MAX_LINKS)
    .map((r) => ({ id: r.id, path: r.path, label: r.label[locale] }));
}
