"use client";
// LineBridgePanel — /line（LINE中継ページ）の操作部（2026-09-01 新設）。
//
// 設計制約（指示書・省略不可）：
//   - 友だち追加は必ず素の <a href>。next/link・onClick+router.push・window.open は使用禁止。
//     target="_blank" も付けない（WebViewで無効化されるため。同一タブ遷移でOSのアプリ起動に委ねる）。
//   - JSによる自動リダイレクト・UA判定はしない（全操作がユーザーのタップ起点）。
//   - クリップボードは navigator.clipboard を試し、不可の環境では textarea+execCommand で
//     フォールバック（WebViewはclipboard APIを許可しないことがある）。
//
// 文言はすべて page.tsx（server）から受け取る＝社労士名等のテナント文言をクライアントJSに載せない。
// GA4：cta_line_click(location=line_bridge)＝実際のLINE起動タップ。各CTAの cta_line_click
// （cta_band等）は「/lineへの入口タップ」になるため、location でファネルの段が区別できる。
import { useState } from "react";
import Link from "next/link";
import { gaEvent } from "@/lib/gtag";
import { TelLink } from "@/components/shared/TelLink";

type Labels = {
  addBtn: string;
  urlHeading: string;
  copyBtn: string;
  copiedBtn: string;
  copyNote: string;
  qrHeading: string;
  qrAlt: string;
  qrNote: string;
  fallbackHeading: string;
  fallbackText: string;
  telLabel: string;
  contactLabel: string;
  trust: string;
};

type Props = {
  lineUrl: string;
  telHref: string;
  telDisplay: string;
  /** ロケール接頭辞付与済みのhrefを受け取る（ここでは変換しない） */
  contactHref: string;
  labels: Labels;
};

export function LineBridgePanel({ lineUrl, telHref, telDisplay, contactHref, labels: l }: Props) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(lineUrl);
      ok = true;
    } catch {
      // クリップボードAPI不可（WebView等）のフォールバック
      try {
        const ta = document.createElement("textarea");
        ta.value = lineUrl;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (!ok) return;
    setCopied(true);
    gaEvent("line_url_copy", { location: "line_bridge" });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mt-8 space-y-6">
      {/* ① 友だち追加ボタン＝素の<a>・同一タブ（target禁止）。onClickは計測のみ＝遷移を妨げない */}
      <a
        href={lineUrl}
        onClick={() => gaEvent("cta_line_click", { location: "line_bridge" })}
        className="inline-flex min-h-[52px] w-full max-w-sm items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-focus"
      >
        {l.addBtn}
      </a>
      <p className="text-xs text-text-muted">{l.trust}</p>

      {/* ② 友だち追加URLとコピーボタン（個人アカウント＝@IDが無いためURLコピー方式。浦松確定 2026-09-01） */}
      <div className="rounded-2xl border border-border bg-white/80 p-4 text-left">
        <h2 className="text-sm font-semibold text-ink">{l.urlHeading}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <code className="min-w-0 flex-1 break-all rounded-lg bg-primary-tint px-3 py-2 text-xs text-text">
            {lineUrl}
          </code>
          <button
            type="button"
            onClick={copyUrl}
            className="inline-flex min-h-[36px] flex-shrink-0 items-center rounded-lg border border-primary px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-focus"
          >
            {copied ? l.copiedBtn : l.copyBtn}
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-text-muted">{l.copyNote}</p>
      </div>

      {/* ③ QRコード（/public の静的画像。中身は line.me/ti/p/EF5782JXqJ＝生成後にデコード検証済み） */}
      <div className="rounded-2xl border border-border bg-white/80 p-4">
        <h2 className="text-sm font-semibold text-ink">{l.qrHeading}</h2>
        <img
          src="/line-qr.png"
          alt={l.qrAlt}
          width={200}
          height={200}
          className="mx-auto mt-3 h-[200px] w-[200px] rounded-lg border border-border"
        />
        <p className="mt-2 text-xs text-text-muted">{l.qrNote}</p>
      </div>

      {/* ④ 開き直し案内＋代替導線（電話・お問い合わせフォーム） */}
      <div className="rounded-2xl bg-primary-tint px-5 py-6">
        <h2 className="text-sm font-semibold text-ink">{l.fallbackHeading}</h2>
        <p className="mt-2 text-xs leading-relaxed text-text-muted">{l.fallbackText}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <TelLink
            phone={telHref.replace(/^tel:/, "")}
            location="line_bridge"
            className="inline-flex min-h-[44px] items-center rounded-lg border border-border bg-white px-5 py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
          >
            {l.telLabel} {telDisplay}
          </TelLink>
          <Link
            href={contactHref}
            onClick={() => gaEvent("cta_contact_click", { location: "line_bridge" })}
            className="inline-flex min-h-[44px] items-center rounded-lg border border-border bg-white px-5 py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
          >
            {l.contactLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
