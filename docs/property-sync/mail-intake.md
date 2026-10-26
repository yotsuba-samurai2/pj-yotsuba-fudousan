# メール取込と既存DBの境界

2026-10-26。原設計（2026-10-22 v0.2）と本人の再確認を維持する。

## 正本は四葉サイトの既存DB

```mermaid
flowchart TD
  Inputs[メール・いい生活・イタンジ等の許可された入力] --> Intake[検査・名寄せ・条件と権利の確認]
  Reins[REINS 本人認証後の個別指示による確認] --> Intake
  Intake --> DB[既存Supabase / Prisma properties：共通物件DBの正本]
  DB --> Site[公開allowlist → 四葉サイト]
  DB --> Plan[変更計画・事前検査 → ATBB正規連携]
  Plan --> ATBB[ATBB / アットホーム]
  Site --> Results[媒体別掲載状態・公開照合・効果測定]
  ATBB --> Results
  Results --> Improve[評価・改善提案・監査・ロールバック]
  Improve --> Intake
```

- `prisma/schema.prisma` の `Property` / `properties` と既存ID・slugを維持する。公開ページは既存 `src/lib/properties.ts` / `toPublicProperty` を通す。
- 入力段階の候補、募集episode、媒体別掲載状態、公開観測、監査は別の責務。メールやATBBの状態で物件本体を無条件に上書きしない。
- 今回のローカル候補ファイルは取込前検査用。正本でも本番用の第二DBでもない。メールからサイト/ATBBへ直接配信する経路は作らない。
- 本番接続では、候補を既存DBの物件・募集回に名寄せし、確認済み根拠と最新の版を使って既存writerに渡す必要がある。メールIDから物件ID・slug・episodeを生成して登録しない。
- AD・当社報酬・業者間情報は内部専用。メール原文・添付を公開データへコピーしない。

## 今回の最小実装

`mail-intake.ts` は既に読み取る権限のあるメールの正規化入力だけを受ける。受信日時はコネクタ由来の `provider_internal_date` で判定し、処理時点から過去168時間（境界を含む）まで。メールのDateヘッダーや引用本文の日付は代用しない。送信済み・下書き・迷惑・ゴミ箱は除外。不明な受信箱/時刻は保留。

受信7日と物件更新14日は別の条件。物件更新日時の抽出候補があっても `sourcePropertyUpdate.basis=unknown`、`normalization=unconfirmed` のまま既存 `rentalFieldEvidenceSchema` に渡す。採否・掲載承諾は確認済みにならない。

対応する数値抽出は、UTF-8へ正しく復号済みのplain text 1 partで、先頭の`物件名:`から連続する単一のラベルブロックだけ。`取引種別`、`用途`、`賃料`（整数円）、`管理費`（整数円）、`間取り`、`専有面積`、`契約形態`、`物件更新日時`（UTCミリ秒ISO）を提案する。万円表記や不明な値を推定で換算しない。同じラベルの反復、複数part、説明文/空行後の別ラベルは複数物件の可能性があるため全抽出を保留する。一般的なメール書式へ無条件に適用するparserではない。

HTML・添付・文字化け・未確認の復号・日報・AD変更通知は参照と保留理由のみ。URL・画像・添付は取得せず、HTMLを実行しない。未公開の表示は掲載承諾とせず、広告禁止の表示は内部限定として記録する。文言検知は補助であり、検知しなかったメールも承諾未確認。

## 保存と再実行

`local-mail-inbox.ts` は既存 `createPrivateJournalStore` の0600・排他lock・一時ファイルからのatomic rename・fsyncを再利用する。メールID＋mailboxRefが同じ場合、同内容なら再実行、内容変更なら保留。別IDの同文メールは関連付けだけ行い、別物件や再募集を自動統合しない。head hashが古い要求は拒否する。

保存対象は参照ID・hash・数値候補・時刻・分類候補・保留理由だけ。本文・件名・住所・建物名・画像・AD原文は保存しない。数値も未確認の社内候補であり公開用ではない。最大250件のローカル検査箱で、長期保管・削除の運用や本番DB候補tableを定めるものではない。hashは改変検知用であり署名や権限証明ではない。

保存後の応答喪失を復旧するため、既に取り込んだ同じメールは新規受付の7日判定より先にhashと保存のdurabilityを再照合する。これは手元の入力と既存履歴の照合だけで、古いメールの追加取得や新規取込を許すものではない。

自己改善ではこの正本と掲載経路を固定条件とし、版ごとの差分・評価ケース・独立レビュー・ロールバック手順を残す。新しい書式への対応や採用条件の改善を理由に、名寄せ・媒体別許諾・公開allowlistを省略しない。

## ローカル実行

既存Node/tsxだけを使う。正規化した入力JSONは0600、候補ファイルの親ディレクトリは0700とし、リポジトリ・public・build出力の外へ置く。

```sh
TSX_TSCONFIG_PATH=scripts/property-sync/tsconfig.json node --import tsx scripts/property-sync/mail-local.ts \
  --input /private/path/messages.json --inbox /private/path/inbox.json --mailbox work-mail
```

入力は `{ "schemaVersion": 1, "messages": [...] }`。1回最大25通・ファイル2MB、各mail envelopeは `mailEnvelopeSchema` を参照。既存コネクタをアプリ用OAuthとして流用しない。新しい認証情報・外部通信・メール送受信・DB接続は持たない。標準出力は件数と固定理由コードだけ。競合・不明な保存結果は保留し、同じ入力の再照合で復旧する。

CLI専用tsconfigで `server-only` マーカーをNext同梱のサーバー用empty moduleへ解決する。アプリ側tsconfigと `server-only` importは維持し、クライアント側への取込禁止を変えない。追加packageの導入は不要。

## 未接続

Gmail本番取得、実メール書式ごとの正規化確認、既存DBへの名寄せ/保存、ATBB writer、実権利確認、自動スケジュールは未接続。ATBBの契約上認められた連携方式と版・結果照合契約は別途確定する。現在の候補ファイルを本番掲載の根拠として使わない。
