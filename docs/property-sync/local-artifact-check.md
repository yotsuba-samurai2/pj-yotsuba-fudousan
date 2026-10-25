# ローカル成果物の実在・完全bytes・形式入口の照合

`local-artifact-check.ts` は許可済みローカルfileを検査するサーバー側関数。外部ダウンロード・Library取得・ストレージURL推測・ブラウザログインはしない。`library-file:`/`project-file:`/URL/相対pathをMac上の実在fileとみなさず、絶対pathを要求する。

## 検査

固定したmanifest hash、artifact ID/version、期待byte長/sha256、形式、取得種別/許可参照、完成状態を受け取る。未確認許可・in_progress/unknownは読み込み前に保留。

最終path要素のsymlinkを拒否し、NONBLOCKでFIFO停止を避け、regular fileだけを最大8MBで読む。statだけでなく実読取りbyte長も制限する。同じ長さの別内容もSHA-256で拒否。途中fileやstat後の増大を完成扱いしない。検査は元fileを変更しない。

- PDF：先頭の`%PDF-`をexact byteで照合し、末尾64byte内の`%%EOF`とその後のASCII空白だけを許容する限定契約。ログインHTMLやheaderだけの途中fileを拒否。上位bitを落としてASCIIへ変換しない。
- JSON：厳密UTF8とJSON構文だけを検査する。業務schema/重複key/精度/深さ等の意味的安全性は後続parserの責任。
- UTF8 text：壊れたbyte列を置換して受理しない。HTML等の内容分類や命令の安全性を確定する機能ではない。

path・原文・認可参照・例外詳細は返却しない。返すのは固定reason、artifact参照、byte長/sha/hash/検査時刻だけ。

## 意味と限界

`matched`は期待bytesと限定的な形式入口が一致したことだけ。簡易PDF fixtureのように構造が不完全でもheader/EOFは持ち得るため、PDF parser・暗号化/破損・添付/active content・画像中の内部情報を検証済みとはしない。許容していないPDF配置等は保守的に保留する。

全結果`contentSafe:false`・`executable:false`。原本/manifestの真正性、完成宣言の正当性、業務parser、公開本文/画像reviewはpending。期待hashを同じ未確認入力から計算するだけでは独立した信頼基点にならない。

呼出元は許可されたpathと管理下の親ディレクトリを指定すること。最終要素NOFOLLOWは親ディレクトリの信頼や全filesystemの隔離を証明しない。一般公開APIには接続していない。実在しない場合に別環境の同名pathへフォールバックしたり、安全制限を迂回したりする経路はない。

RF10/11/12の部分的ローカル証跡。合成tempfileで検証しており、実Library原本や媒体exportの取得成功を表すものではない。
