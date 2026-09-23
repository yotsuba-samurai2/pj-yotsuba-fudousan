/**
 * GA4 計測の自動化トラフィック除外（2026-09-18）。
 *
 * 背景：GA4 の過去28日（08/21〜09/17）で Singapore が 958 ユーザー（全体の34%）を占め、
 * エンゲージメント率 3.74%・平均エンゲージメント時間 0秒・ユーザーあたりエンゲージメント
 * セッション 0.04 と、人の閲覧ではありえない値だった（日本は 59.71%・1分36秒）。
 * Brazil 124（新規1）・Pakistan 35（新規0）・Bangladesh 30（新規0）・Vietnam 28（新規0）も同型。
 * JavaScript を実行するクローラー（データセンター経由）が gtag だけ発火させて去っている。
 * GA4 側の除外設定は内部IP・デベロッパートラフィックのみで国では切れないため、発生源で止める。
 *
 * 方針：
 * - navigator.webdriver === true（Puppeteer / Playwright / Selenium の既定）なら計測しない
 * - UA に既知のクローラー・ヘッドレス・HTTPクライアント名が含まれるなら計測しない
 * - 汎用語「bot」は使わない（実在のスマホブランド CUBOT 等を巻き込むため）。名指しの一覧で判定する
 * - すり抜け（ステルス型）はあり得る。目的は「0秒で去る大半」を消すことで、完全遮断ではない
 *
 * この正規表現は GoogleAnalytics.tsx のインラインスクリプトに `source` として埋め込まれる
 * （ブラウザ側で import できないため）。判定の正本はここ1か所。
 */
export const AUTOMATION_UA_PATTERN = new RegExp(
  [
    // 検索エンジン・AI クローラー
    "googlebot",
    "bingbot",
    "yandex",
    "baiduspider",
    "duckduckbot",
    "slurp",
    "bytespider",
    "petalbot",
    "gptbot",
    "oai-searchbot",
    "chatgpt-user",
    "claudebot",
    "anthropic-ai",
    "perplexitybot",
    "ccbot",
    "amazonbot",
    "applebot",
    "facebookexternalhit",
    "meta-externalagent",
    // SEO ツール
    "semrushbot",
    "ahrefsbot",
    "mj12bot",
    "dotbot",
    "dataforseobot",
    "screaming frog",
    // 計測・ヘッドレス・自動操作
    "lighthouse",
    "headlesschrome",
    "phantomjs",
    "puppeteer",
    "playwright",
    "selenium",
    // HTTP クライアント
    "python-requests",
    "python-urllib",
    "aiohttp",
    "go-http-client",
    "curl/",
    "wget/",
    "scrapy",
    "axios/",
    "node-fetch",
    "okhttp",
    "java/",
    "libwww",
    // 汎用（単語として安全なもの）
    "crawler",
    "spider",
  ].join("|"),
  "i",
);

/** 自動化トラフィックと判定したら true（＝GA4 を読み込まない） */
export function isLikelyAutomation(userAgent: string | undefined, webdriver: boolean | undefined): boolean {
  if (webdriver === true) return true;
  if (!userAgent) return true; // UA が空のクライアントは通常のブラウザではない
  return AUTOMATION_UA_PATTERN.test(userAgent);
}
