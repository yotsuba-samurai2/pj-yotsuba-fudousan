# 通知キューの修復案（適用禁止・レビュー用）

2026-10-24、既存Supabase `luck428-corporate` を読取り確認。`property_publication_events` は不在。migration履歴は5件で `20260920020000_add_property_publication_events` はない。`20260901000000_add_properties` のchecksumが空のため、履歴だけを前提に一括migrateしてはいけない。デプロイ先DBとの対応と、過去の手動DDLは追加確認が必要。

現行コードは通知記録失敗をcatchするため物件保存自体は進むが、tableがなければ通知を永続化できない。ログの原因や本番での発生件数を今回観測したわけではない。

## 承認に出す手順

1. 適用先ref・実DDL・migration名とchecksum・runtime接続role・既存writer権限を読取りで照合。外部通知を止める正式手段も決める。
2. レビュー済みの単一transaction内で既存CREATE TABLE SQLと `notification-privileges.sql` を組み合わせる。RLS/REVOKE前にcommitしない。既存tableがある環境ではこのCREATEを流さず、列・index・policy・grantを照合した別手順にする。
3. table/column/index/RLS/role別権限を照合。migration履歴への登録方法は手動DDLとの差を整理した上で別に決める。`migrate deploy` や `resolve` の一括実行はしない。
4. 別承認のテスト対象で記録と送信の挙動を確認する。テーブル作成だけで送信成功とはしない。
5. 問題時はwriter停止と原因確認を先に行う。イベントが入ったtableをDROPして履歴を消すrollbackは使わない。具体的なrollback手順を承認前に確定する。

## ローカル権限試験

アプリ依存とは別にPGlite 0.5.11を固定導入。ネット接続・DB URLなしのメモリ内PostgreSQLで、既存SQLと提案SQLを実行する。

```
node scripts/property-sync/check-notification-privileges.mjs /absolute/path/to/isolated-pglite-runtime
```

- default grantsがある旧SQLでは匿名SELECTが通ることを再現。
- 修復案でanon/authenticated/PUBLIC経由guestのSELECT/INSERT/UPDATE/DELETE/TRUNCATEが全て権限エラーとなる。
- RLS有効・client policyなしを確認。ownerと既存service_roleのwriter動作を保持。
- 誤ったSELECT/INSERT grantが後から付いてもRLSで行取得・追加を拒む。
- table不在を誤って成功にせず、anon/authenticatedが存在しない環境でroleを新設しない。

これはローカルのSQL意味論の試験であり、Supabase Data API、実runtime role、稼働環境の権限を確認したことにはならない。権限を緩めるpolicy/SECURITY DEFINER/新roleは提案しない。

参考：[Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)、[PGliteのメモリ内実行](https://pglite.dev/docs/)。
