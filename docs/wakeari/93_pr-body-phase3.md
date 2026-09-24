## 目的
売りにくい土地・建物の出口相談（/wakeari）の Phase 3。企画書 v1.0 §10・指示書 v2.0 §11 のうち、リポジトリで完結する3つを行う。

## 変更
1. **繁体字版 2枚**：`/zh-tw/wakeari/kyoyu`・`/zh-tw/wakeari/shakuchi-sokochi`（台湾の相続人の共有・借地の需要＝企画書 §3-3）
   - 本文は日本語版の逐語訳（`ZhTwPage.tsx`）。日本語版の `page.tsx` は locale が zh-tw のときだけ繁体字版を返す＝日本語の出力は不変
   - 共通の固定文言（留保・事業者主語の一文・分離受任の一文・役割表・根拠表の注記）は `src/lib/wakeari-zh-tw.ts` に1か所。`WakeariRoleTable`・`WakeariSources` は `locale` を受け取る（既定 ja＝既存出力は不変）
   - メタデータ：zh-tw は自己canonical、en・zh は ja を canonical、hreflang は ja・zh-Hant・x-default（/souzoku/taiwan と同じ型）。sitemap は `locales: ["ja", "zh-tw"]`
   - FAQPage は `inLanguage: zh-Hant`。日本語のみのページ（ハブ・再建築不可・狭小地・/souzoku/chinese）へは日本語 URL に「（日文）」と明示してリンク
   - 事業体名は日本語表記、買取は「以收購業者為買方的仲介」（「合作／提携」を付けない＝#424 の浦松決定）
2. **/jirei にモデルケース⑤**「再建築不可の旗竿地を、貸して持ち続ける」（企画書 §3-4 の2件目）。既存の型（想定形・数値なし・冒頭注記と「※モデルケースです」）に合わせた。答えブロックと description を「5つ」に更新、関連リンクに /wakeari
3. **定点 #34〜#39** の追記行を `docs/wakeari/92_teiten-34-39.md` に置いた（企画書 §9 の表を機械的に抜き出し。正本のクエリ表は四葉基幹CRM 側にあり、このリポジトリから書けない）

## 見送ったもの（浦松の判断待ち）
- **/jirei の「共有×相続」モデルケース**：企画書どおり熊谷の代償分割をもとにする件で、浦松の可否が要る（決定6）。可否をいただいてから別 PR で足す
- **Wikidata の記述追記**：効果が未検証（企画書 §5-6）。任意のため今回は触らない

## 既存の問題（本 PR では直していない）
- /jirei のモデルケース②「他の専門家との連携」に「提携する司法書士をご紹介します」が残っている。U12（2026-08-06）と #424 の方針（提携の書面は無い）と食い違う。直すなら「司法書士へおつなぎします」等に。2026-07-19 浦松検収済みの本文のため、浦松の指示で直す

## 検証
- `npx tsc --noEmit`：エラー 0
- `npx eslint`（変更ファイル）：エラー 0
- `npx vitest run`：112 ファイル・1,632 件通過（`wakeari-pages.test.ts` に繁体字版の番人を追加：メタデータ実行検査・禁止語・共通部品の使用・（日文）の明示）
- 描画確認：Vercel プレビューで確認（結果は PR コメント／本文に追記）

## マージ後
- GSC 登録（繁体字2URL）：`https://luck428.com/zh-tw/wakeari/kyoyu`・`https://luck428.com/zh-tw/wakeari/shakuchi-sokochi`、/jirei は更新として再登録
- 定点 #34〜#39 をクエリ表へ追記（92_teiten-34-39.md の6行をコピー）

## マージ・デプロイ・GSC は浦松が行う
