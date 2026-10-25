# UI検証再開の限定例外案（unit38・未適用）

2026-10-25 JST。対象は既存Mac上の合成UI6ケース。現行unit37の製品コード・DB・本番は変更しない。

## 確認できた原因

前回のChrome起動は終了21で、以下の`bind`がOS隔離に拒否された。試験ページは開いていない。

`/var/folders/1q/lkpf2hnj2fg5lwxnfbd9mc500000gn/T/com.google.Chrome.ow7wco/SingletonSocket`

今回の`getconf DARWIN_USER_TEMP_DIR`も同じ一時領域を返す。Chromiumの[公式実装](https://chromium.googlesource.com/chromium/src/+/main/chrome/browser/process_singleton_posix.cc)は、profileと独立した一時ディレクトリを作成し、0700権限を検査してUnix socketをbind/listenする。前回、TMPDIRを作業用に渡してもこのMacの実Chromeは別のmacOS領域を使用した。外部Webサイトからの拒否ではなく、追加したOS通信隔離による内部IPCの拒否である。

## 承認を求める変更（まだ実行しない）

新しく起動する試験用Chromeのプロセス群に限り、次のUnix socketに対するbind/inboundをプロセス終了まで許可する。恒久設定・他アプリ・ユーザーアカウント・DB権限には適用しない。

- 対象ディレクトリ: このMacの`DARWIN_USER_TEMP_DIR`直下、`com.google.Chrome.`＋英数字6文字の一時ディレクトリ。
- 対象名: `SingletonSocket`だけ。`/var`とその実体`/private/var`の別名を考慮する。
- 処理: 新規socketの作成/待受のみ。network-outboundは許可しないため、他の既存Chromeへの接続を追加しない。
- 外部通信、DNS、TCP/UDP（loopback含む）、remote debugging port、実DB接続は引き続き禁止。Chromium sandboxやProcessSingletonの安全検査を無効化しない。
- 新しい空profile、file URL、合成1物件、模擬保存/通知だけを使用。既存の業務用profileや実資格情報を使わない。インストール/課金なし。

正確な一時suffixはChrome起動時に決まるため事前には固定できない。例外は当該一時名形式とsocket名に限定されるが、同一プロセスから作成可能なその形式の新規socketを許す点が現行制約との差分である。OS例外があっても他の起動制約やDOM不具合が残る可能性があり、成功保証ではない。

承認後は、まずこの限定profileの構文と外部/loopback拒否を確認し、Chrome起動を1回試行する。異なる拒否が出た場合は対象・理由・実行状態を記録して停止し、例外を自動拡張しない。単なる「--no-sandbox」、singleton無効化、別browser/既存profileへの迂回は行わない。

## 先行して完了した準備

- 実sessionStorageを使う合成fixtureへ変更。Reactの再mount確認とページ全体の再読込みを区別し、後者は未検証と明記。
- 成功判定は全6ケースの正確な名称/順序/成功と、物件保存2・模擬cache2・模擬通知1を要求する。
- `--prepare-only`でbundle/HTMLだけを生成できる。Chromeとsandbox/native probeは起動しない。
- 新規の所有process groupだけを停止し、stdout/stderr排出も上限付きにした。停止や排出が不明ならprofileを消さず保持して報告。他のプロセスを探索・停止しない。
- 独立レビューの「別groupの子がpipeを保持すると無期限待機」を修正し、短時間で自動終了する合成子で再現/検証した。

UI6ケースの実行はまだ0件。これは実装済みの2,949件の回帰を再実行したものでも、画面が成功した証拠でもない。今回の先行検証はprocess lifecycle5件、fixtureの型/構文/lint、bundle生成だけ。DB/build/製品ロジックは変更していないため、既存試験を報告目的で再実行しない。

## unit39 承認後の試行結果（2026-10-25 JST）

本人の確認回答と親の一時保留解除を受け、上記範囲だけを試験子プロセスへ適用した。実施は事前検査1回。Chrome起動は0回。

作成した設定はnetwork全体をdenyし、固定Mac temp/Chrome英数字6文字/SingletonSocketへだけnetwork-bind/inboundをallowする。outbound例外はない。恒久設定・既存Chrome・組織/環境側の制限・Chromium sandboxを変更しない。

最初のUnix bind/listen検査が`EPERM`で停止した。対象は`/var/folders/1q/lkpf2hnj2fg5lwxnfbd9mc500000gn/T/com.google.Chrome.l7qZEc/SingletonSocket`。Nodeの検査プロセスは終了1、Chromeを開始する条件に達していない。予定した7項目の成功は0項目であり、残り6項目も未実行。例外の拡大、別ブラウザ、再試行は行わなかった。

`sandbox-exec`はNodeを実行できたため設定の構文エラーではないが、許可filterの意味が対象に一致していない可能性と、別の強制制限が残る可能性の切分けは未完了。環境/組織の制限が原因だと断定しない。次の診断はまず読取りによる許可規則の意味と強制制限の区別であり、拒否を迂回して実行しない。

所有するprobeディレクトリと作業tempはinode照合後に削除し、不存在を確認した。Chromeは未起動なのでChrome固有IPCは作成されていない。独立レビューにより、今後Chromeが起動した場合のprofile清掃とmacOS側IPC清掃は別結果として出すよう修正。外側IPCの所有先/停止を確認できなければ`not_verified`とし、同patternを一括探索・削除しない。この出力修正後にブラウザを再実行していない。

今回の証跡はtask root `evidence/unit39-browser/browser-first.json`、`executed-source-manifest.json`、`cleanup-verification.json`。製品コード・DB・build・既存回帰は変更/再実行なし。UI6ケースは未実施のまま。

### 同日の続行指示後の限定再確認

本人の「続けて」を受けて、macOSにインストール済みの`/usr/share/sandbox/com.apple.smbd.sb`を読取り照合した。同設定ではUnix socketのbindに直接のpath filterを用いていたため、新しい関連根拠として保存。承認済みのpath集合・bind/inboundだけという範囲を維持し、nested local/unix指定から直接path regexへ記述形式だけ変更した。

Chromeが未起動で一時物も不存在であることを確認したうえで事前検査を1回だけ再確認したが、`com.google.Chrome.VSxjQh/SingletonSocket`の待受が再び`EPERM`、Node終了1となった。Chromeは合計0回、UI6ケースは0件、事前検査は2回とも最初で停止して成功0件。これ以上の再試行や許可拡張を行わない。原因を環境/組織側の制限と断定せず、未解決の診断対象として残す。

再確認で作成した`/private/tmp/yotsuba-ui39-Jm7Yco`と上記probeディレクトリも清掃・不存在確認済み。詳細は`browser-path-filter.json`と`native-rule-evidence.txt`。次に必要なのは、保存した最小設定と拒否対象についてのsandbox規則/強制制限の診断であり、外部媒体・本番への接続ではない。

## unit40 原因切分けと次段階の拒否（2026-10-25 JST）

本人の診断・再開指示後、ソケットなしの実SBPLファイル権限照合で、counted {6} は対象不一致、文字クラス6個明記とliteralは対象だけ一致することを確認。同じ許可集合の展開表記へ修正した。native事前検査7項目はすべて成功し、旧Unix listen拒否の解消を確認した。

続くChrome起動1回は自身のsandbox初期化でOperation not permittedとなり、DOM結果なし。別の拒否として再試行を停止し、sandbox/通信制限を緩めない。Chrome helper内部再起動ログを別のrunner実行と数えない。runner終了1、Chrome code:null。OS拒否の内部原因は未確定。

所有process group停止・pipe排出後、所有profileをinode確認して削除。macOS側の別IPCは所有path未捕捉でnot_verifiedのまま、他profile領域は探索/削除しない。試験source/policy hashと結果を独立読取りレビュー済み。製品コード変更なし、全回帰/SQL/build再実行なし。証跡はtask root REPORT-unit40.md / evidence/unit40-browser。
