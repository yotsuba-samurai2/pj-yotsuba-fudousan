// IndexNow一括送信スクリプト（2026-07-25・AI可視性強化#2）
//
// 目的：ChatGPT検索・Copilot等はBingインデックスを参照するため、Bing系への
//   インデックス反映を早める。IndexNowはBing・Yandex等が共同運用する即時通知プロトコル。
//   Google はIndexNow非対応（GoogleはGSC/サイトマップ経由のまま＝従来運用を継続）。
//
// 仕組み：
//   - キー証明ファイル＝ public/518a1be74464d9bb27384417ed814447.txt（本文=キー文字列）
//     → https://luck428.com/518a1be74464d9bb27384417ed814447.txt で配信される（キーは公開仕様）。
//   - 本スクリプトが sitemap.xml（本体＋legal）から全URLを取得し、api.indexnow.org へ一括POSTする。
//   - legalサイトのcanonicalは luck428.com/legal/* のため、luck428.com 1ホストの送信で全ページを網羅。
//
// 使い方（浦松Mac・リポジトリ直下で）：
//   node scripts/submit-indexnow.mjs          # 送信
//   node scripts/submit-indexnow.mjs --dry    # 送信せずURL一覧の件数のみ確認
//
// 運用ルール：新規ページ公開・大きな本文更新のリリース後に1回実行する
//   （毎回全URL送信でよい＝IndexNowは冪等・上限10,000件/リクエストに対し当サイトは数百件規模）。
//   実行記録は samurai-app/tasks/ai-visibility-monitor.md に残す。

const KEY = "518a1be74464d9bb27384417ed814447";
const HOST = "luck428.com";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
// 2026-07-25：legal配下は本体sitemap.xmlに統合済み（app/sitemap.ts）＝1本で全ページを網羅
const SITEMAPS = [`https://${HOST}/sitemap.xml`];
const ENDPOINT = "https://api.indexnow.org/indexnow";

const dry = process.argv.includes("--dry");

async function fetchSitemapUrls(sitemapUrl) {
  const res = await fetch(sitemapUrl);
  if (!res.ok) throw new Error(`sitemap取得失敗: ${sitemapUrl} (${res.status})`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const all = [];
  for (const sm of SITEMAPS) {
    const urls = await fetchSitemapUrls(sm);
    console.log(`${sm}: ${urls.length}件`);
    all.push(...urls);
  }
  // 同一ホストのみ・重複除去（IndexNowはhost一致が必須）
  const urlList = [...new Set(all)].filter((u) => {
    try {
      return new URL(u).host === HOST;
    } catch {
      return false;
    }
  });
  console.log(`送信対象: ${urlList.length}件（ホスト=${HOST}）`);

  if (dry) {
    console.log("--dry指定のため送信せず終了");
    return;
  }

  // キー証明ファイルの到達性を先に確認（未デプロイのまま送ると失敗するため）
  const keyRes = await fetch(KEY_LOCATION);
  const keyBody = (await keyRes.text()).trim();
  if (!keyRes.ok || keyBody !== KEY) {
    throw new Error(
      `キー証明ファイルが未配信です: ${KEY_LOCATION} (status=${keyRes.status})。デプロイ後に再実行してください`,
    );
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  });
  // IndexNow: 200=受理 / 202=受理（キー検証は非同期）。それ以外は失敗として内容を表示
  console.log(`IndexNow応答: ${res.status} ${res.statusText}`);
  if (res.status !== 200 && res.status !== 202) {
    console.error(await res.text());
    process.exitCode = 1;
  } else {
    console.log("送信完了（Bing側の反映はBing Webmaster ToolsのIndexNowレポートで確認）");
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
