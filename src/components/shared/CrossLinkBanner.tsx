// CrossLinkBanner — 事業間クロスリンクのバナー（導入文＋相手先事業"色"カード＋独立受任注記）
// 相手先事業の色は現ページの --color-primary ではなく、相手事業のブランド色 var(--brand-<business>) を使う
// ＝「別の事務所へ移動する」ことが視覚的に分かる（ページ割v2 §3-2・業法分離の明示）。
// バナーはHTMLテキストのカード（アンカーテキストがクローラ・LLMに読める）。
// 使い方（各ページ・server component）：
//   const links = getCrossLinks("/legal/services/visa", SR_LAUNCHED);
//   {links.map((c) => <CrossLinkBanner key={c.id} link={c} />)}
// 2026-07-11 ロケール保持（診断_ロケール保持リンク_v1 §B-4）：
//   ⚠️ client化厳禁＝cross-links.ts（INDEPENDENT_NOTE_TRIPLE・anchorにSR事務所名）がクライアントJSへ
//   同梱される回帰（法27条ソース漏れ経路）。server維持のままasync化し、t.href のみ addLocalePrefix
//   （ここで1回だけ付与＝二重適用禁止・データ側は接頭辞なしを保つ）。
//   lead/note/anchor文言はja固定のまま（多言語化は開業時に別判断＝診断§E-6）。
// 2026-07-12：lead・注記・アンカー・aria を4ロケール化（server component のまま＝client化厳禁は不変）。
// ja は既存文字列そのまま＝表示回帰ゼロ。en/zh の文面は**石井弁護士レビュー済み**（2026-07-12・修正なしで承認）。
import Link from "next/link";
import {
  INDEPENDENT_NOTES,
  INDEPENDENT_NOTES_TRIPLE,
  involvesLabor,
  type CrossLink,
} from "@/lib/cross-links";
import { brandVar, brandTintVar } from "@/lib/tenant-theme";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import type { LangCode } from "@/config/languages";

type Props = {
  link: CrossLink;
  /** 導入文（分担説明のトーン・宣伝コピーにしない。ページ側で文脈に合わせて上書き可） */
  lead?: string;
};

/** 導入文とaria-labelの4ロケール（jaは既存文字列＝回帰なし） */
const BANNER_COPY: Record<LangCode, { lead: string; aria: string }> = {
  ja: {
    lead: "あわせて、四葉グループの関連サービスもご覧いただけます。",
    aria: "関連サービス",
  },
  en: {
    lead: "You may also find these related services within the Yotsuba Group helpful.",
    aria: "Related services",
  },
  "zh-tw": {
    lead: "您也可以一併參考四葉グループ的相關服務。",
    aria: "相關服務",
  },
  zh: {
    lead: "您也可以一并参考四葉グループ的相关服务。",
    aria: "相关服务",
  },
};

export async function CrossLinkBanner({ link, lead }: Props) {
  const locale = await getRequestLocale();
  const c = BANNER_COPY[locale] ?? BANNER_COPY.ja;
  // 注記は「別事業体・独立受任・紹介料の授受なし」（非弁・業際配慮）＝言語を問わず必ず表示する
  const notes = involvesLabor(link) ? INDEPENDENT_NOTES_TRIPLE : INDEPENDENT_NOTES;
  const note = notes[locale] ?? notes.ja;
  return (
    <aside aria-label={c.aria} className="mx-auto my-6 max-w-3xl px-4">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <p className="text-sm text-text-muted">{lead ?? c.lead}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {link.targets.map((t) => (
            <Link
              key={t.href}
              href={addLocalePrefix(t.href, locale)}
              className="block rounded-xl border-l-4 bg-surface p-3 transition-shadow hover:shadow-sm"
              style={{ borderLeftColor: brandVar(t.business), background: brandTintVar(t.business) }}
            >
              <span className="text-sm font-medium text-ink underline decoration-transparent underline-offset-2">
                {t.anchorI18n?.[locale] ?? t.anchor}
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-xs text-text-muted">{note}</p>
      </div>
    </aside>
  );
}
