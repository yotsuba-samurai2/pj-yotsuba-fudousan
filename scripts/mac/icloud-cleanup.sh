#!/bin/bash
# =============================================================================
# iCloud 整理スクリプト（macOS 専用・bash 3.2 互換）
#
# 使い方（Mac のターミナルで）:
#   bash scripts/mac/icloud-cleanup.sh            # 洗い出しのみ。何も消さない
#   → ~/Desktop/icloud-cleanup/ に report.md と delete.command ができる
#   → report.md を確認し、delete.command をダブルクリック（＝ワンクリック削除）
#
# 削除は「ゴミ箱へ移動」なので元に戻せる。iCloud 上では「最近削除した項目」に
# 30日間残る。確実に空き容量を戻すには Finder のゴミ箱を空にし、
# iCloud.com > iCloud Drive > 最近削除した項目 からも削除する。
#
# 自動で削除リストに入れるのは、次の2種類だけ:
#   A. 再生成できる開発キャッシュ（node_modules / .next / .turbo / .venv など）
#   B. 「◯◯ 2.md」型の同期重複で、元ファイルと中身が完全一致するもの
# それ以外（大きいファイル・中身が違う重複・重複クローン）は「要確認」として
# 一覧にするだけで、削除リストには入れない。
# =============================================================================
set -u

ROOT="$HOME/Library/Mobile Documents"
OUT="$HOME/Desktop/icloud-cleanup"
REPORT="$OUT/report.md"
LIST="$OUT/delete-list.txt"
REVIEW="$OUT/review-list.txt"
DELETE_CMD="$OUT/delete.command"

if [ ! -d "$ROOT" ]; then
  echo "iCloud Drive のフォルダが見つかりません: $ROOT" >&2
  echo "このスクリプトは Mac 上で実行してください。" >&2
  exit 1
fi

mkdir -p "$OUT"
: > "$LIST"
: > "$REVIEW"

# --- helpers -----------------------------------------------------------------
human() { # bytes -> 人間向け
  awk -v b="$1" 'BEGIN{
    split("B KB MB GB TB",u," "); i=1;
    while (b>=1024 && i<5) { b/=1024; i++ }
    printf("%.1f %s", b, u[i]) }'
}
size_of() { # ファイル or ディレクトリの実サイズ(bytes)。.icloud 占位ファイルは plist から読む
  local p="$1"
  case "$(basename "$p")" in
    .*.icloud)
      plutil -p "$p" 2>/dev/null | awk -F'=> ' '/NSURLFileSizeKey/{gsub(/[^0-9]/,"",$2); print $2; exit}'
      return ;;
  esac
  if [ -d "$p" ]; then
    du -sk "$p" 2>/dev/null | awk '{print $1*1024}'
  else
    stat -f %z "$p" 2>/dev/null
  fi
}
add_candidate() { # <bytes> <path>  -> 削除リスト
  printf '%s\t%s\n' "$1" "$2" >> "$LIST"
}
add_review() { # <bytes> <reason> <path> -> 要確認リスト
  printf '%s\t%s\t%s\n' "$1" "$2" "$3" >> "$REVIEW"
}
sum_bytes() { awk -F'\t' '{s+=$1} END{printf("%d", s)}' "$1"; }

echo "iCloud を走査しています（数分かかることがあります）..."

# --- 0. 全体像 -----------------------------------------------------------------
{
  echo "# iCloud 整理レポート（$(date '+%Y-%m-%d %H:%M')）"
  echo
  echo "走査対象: \`$ROOT\`（iCloud Drive。デスクトップと書類の同期が ON ならそれも含む）"
  echo
  echo "## 0. 残量"
  echo
  echo '```'
  brctl quota 2>/dev/null || echo "（brctl quota が使えません）"
  echo '```'
  echo
  echo "注意: iCloud 50GB の大半は **iCloud 写真** と **iPhone/iPad のバックアップ** が占めていることが多く、"
  echo "それらはこのスクリプトでは見えません。システム設定 > Apple ID > iCloud > 「ストレージを管理」で確認してください。"
  if [ -d "$HOME/Pictures/Photos Library.photoslibrary" ]; then
    echo
    echo "参考: Mac 側の写真ライブラリ = $(human "$(size_of "$HOME/Pictures/Photos Library.photoslibrary")")（iCloud 写真が ON ならほぼ同量が iCloud を占有）"
  fi
  echo
  echo "## 1. フォルダ別の使用量（上位20）"
  echo
  echo '| サイズ | フォルダ |'
  echo '|---:|---|'
  du -sk "$ROOT"/* "$ROOT"/com~apple~CloudDocs/* 2>/dev/null \
    | sort -rn | head -20 \
    | while IFS=$'\t' read -r kb p; do
        printf '| %s | `%s` |\n' "$(human $((kb*1024)))" "${p#$ROOT/}"
      done
  echo
} > "$REPORT"

# --- A. 再生成できる開発キャッシュ ------------------------------------------------
find "$ROOT" -type d \
  \( -name node_modules -o -name .next -o -name .turbo -o -name .venv \
     -o -name __pycache__ -o -name .cache -o -name .parcel-cache -o -name .pytest_cache \) \
  -prune -print 2>/dev/null \
  | while IFS= read -r d; do
      add_candidate "$(size_of "$d")" "$d"
    done

# --- B. 「◯◯ 2.md」型の同期重複 ---------------------------------------------------
find -E "$ROOT" -type f -regex '.* [0-9]+(\.[^/.]+)?$' -not -name '.*' 2>/dev/null \
  | while IFS= read -r dup; do
      orig="$(printf '%s' "$dup" | sed -E 's/ [0-9]+(\.[^/.]+)?$/\1/')"
      [ "$orig" = "$dup" ] && continue
      if [ -f "$orig" ]; then
        if cmp -s "$orig" "$dup"; then
          add_candidate "$(size_of "$dup")" "$dup"
        else
          add_review "$(size_of "$dup")" "元ファイルと中身が違う重複（どちらが新しいか要確認）" "$dup"
        fi
      elif [ -f "$(dirname "$orig")/.$(basename "$orig").icloud" ]; then
        add_review "$(size_of "$dup")" "元ファイルが未ダウンロードのため比較できない重複" "$dup"
      fi
    done

# --- C. 大きいファイル（要確認のみ） -------------------------------------------------
find "$ROOT" -type f -size +200M -not -name '.*' 2>/dev/null \
  | while IFS= read -r f; do
      add_review "$(size_of "$f")" "200MB超のファイル" "$f"
    done
# 未ダウンロード（iCloud 上にだけある）大きいファイル
find "$ROOT" -type f -name '.*.icloud' 2>/dev/null \
  | while IFS= read -r ph; do
      b="$(size_of "$ph")"; [ -z "$b" ] && continue
      if [ "$b" -gt 209715200 ]; then
        real="$(dirname "$ph")/$(basename "$ph" .icloud | sed 's/^\.//')"
        add_review "$b" "200MB超（未ダウンロード・iCloud 上にのみ存在）" "$real"
      fi
    done

# --- D. 使わないと決めた重複クローン（CLAUDE.md 2026-08-14） --------------------------
find "$ROOT" -type d -name pj-yotsuba-fudousan -path '*四葉基幹CRM*' -prune -print 2>/dev/null \
  | while IFS= read -r d; do
      add_review "$(size_of "$d")" "CLAUDE.md で『使わない』と決めた重複クローン（未コミットの作業が無ければ丸ごと削除可）" "$d"
    done

# --- レポート本文 ------------------------------------------------------------------
sort -t$'\t' -k1,1rn "$LIST"   -o "$LIST"
sort -t$'\t' -k1,1rn "$REVIEW" -o "$REVIEW"
TOTAL_DEL="$(sum_bytes "$LIST")"
TOTAL_REV="$(sum_bytes "$REVIEW")"

{
  echo "## 2. ワンクリック削除の対象（合計 $(human "$TOTAL_DEL")・$(wc -l < "$LIST" | tr -d ' ') 件）"
  echo
  echo "\`delete.command\` をダブルクリックすると、以下をまとめて **ゴミ箱へ移動** します。"
  echo "内容: 再生成できる開発キャッシュ ＋ 元ファイルと中身が完全一致する「◯◯ 2.xxx」型の重複。"
  echo
  echo '| サイズ | パス |'
  echo '|---:|---|'
  while IFS=$'\t' read -r b p; do
    printf '| %s | `%s` |\n' "$(human "$b")" "${p#$ROOT/}"
  done < "$LIST"
  echo
  echo "## 3. 要確認（自動削除しない・合計 $(human "$TOTAL_REV")・$(wc -l < "$REVIEW" | tr -d ' ') 件）"
  echo
  echo "消してよいものは、そのパスを \`delete-list.txt\` に 1 行ずつ追記してから \`delete.command\` を実行してください（形式: サイズ(bytes) TAB パス。サイズは 0 でも可）。"
  echo
  echo '| サイズ | 理由 | パス |'
  echo '|---:|---|---|'
  while IFS=$'\t' read -r b why p; do
    printf '| %s | %s | `%s` |\n' "$(human "$b")" "$why" "${p#$ROOT/}"
  done < "$REVIEW"
  echo
  echo "## 4. 削除後にやること"
  echo
  echo "1. Finder のゴミ箱を空にする"
  echo "2. iCloud.com > iCloud Drive > 「最近削除した項目」からも削除（30日分の保持をスキップして空きを戻す）"
  echo "3. それでも足りなければ、設定 > Apple ID > iCloud > ストレージを管理 で **写真** と **バックアップ**（使っていない旧端末のバックアップ）を見直す"
} >> "$REPORT"

# --- delete.command（ダブルクリックで実行できる自己完結スクリプト） -------------------
cat > "$DELETE_CMD" <<'EOF'
#!/bin/bash
# iCloud 整理: delete-list.txt の各行をゴミ箱へ移動する（元に戻せる）
set -u
OUT="$HOME/Desktop/icloud-cleanup"
LIST="$OUT/delete-list.txt"
TRASH="$HOME/.Trash/icloud-cleanup-$(date '+%Y%m%d-%H%M%S')"
if [ ! -s "$LIST" ]; then echo "削除リストが空です: $LIST"; read -r -p "Enter で閉じる"; exit 0; fi
N="$(wc -l < "$LIST" | tr -d ' ')"
echo "ゴミ箱へ移動します: $N 件  →  $TRASH"
read -r -p "実行しますか？ [y/N] " ans
case "$ans" in y|Y|yes|YES) ;; *) echo "中止しました"; exit 0 ;; esac
mkdir -p "$TRASH"
ok=0; ng=0
while IFS=$'\t' read -r _bytes p; do
  [ -z "$p" ] && continue
  if [ ! -e "$p" ]; then echo "  skip（既に無い）: $p"; continue; fi
  dest="$TRASH/$(basename "$p")"; i=1
  while [ -e "$dest" ]; do dest="$TRASH/$(basename "$p")-$i"; i=$((i+1)); done
  if mv "$p" "$dest" 2>/dev/null; then ok=$((ok+1)); echo "  ok: $p"
  else ng=$((ng+1)); echo "  NG: $p"; fi
done < "$LIST"
echo
echo "完了: 移動 $ok 件 / 失敗 $ng 件"
echo "空き容量を確定させるには Finder のゴミ箱を空にし、iCloud.com の「最近削除した項目」からも削除してください。"
read -r -p "Enter で閉じる"
EOF
chmod +x "$DELETE_CMD"

echo
echo "完了。レポート: $REPORT"
echo "  削除対象   : $(wc -l < "$LIST" | tr -d ' ') 件 / $(human "$TOTAL_DEL")   → $LIST"
echo "  要確認     : $(wc -l < "$REVIEW" | tr -d ' ') 件 / $(human "$TOTAL_REV")   → $REVIEW"
echo "  ワンクリック削除: $DELETE_CMD をダブルクリック"
open "$REPORT" 2>/dev/null || true
