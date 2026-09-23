#!/usr/bin/env python3
"""
物件比較資料サンプル（public/samples/property-search/*.pdf）を、
サイト内ビューア（/sample/[kind]）用のページ画像に書き出す。

なぜ要るか（2026-09-23）:
  スマートフォンでPDFへ直接リンクすると、機種・ブラウザによって
  - Android Chrome：PDFを表示できず、ダウンロード→外部アプリへ渡される
  - LINE等のアプリ内ブラウザ：PDFが全画面表示になり、戻る操作が見つからない
  - iOS Safari：PDF表示中はツールバーが隠れ、戻る方法が分かりにくい
  という理由で「元のページへ戻れない」状態になる。PR #382 で同じタブ表示に
  変えたが、ブラウザの戻る操作に頼る限り解消しなかった。
  そこでPDFはダウンロード用に残し、閲覧はサイト内のHTMLページで行う。

使い方（PDFを差し替えたら必ず再実行してコミットする）:
  python3 -m venv /tmp/venv-render
  /tmp/venv-render/bin/pip install pymupdf pillow
  /tmp/venv-render/bin/python scripts/render-sample-pages.py

出力:
  public/samples/property-search/pages/<PDF名（拡張子なし）>/01.webp …
  public/samples/property-search/pages/manifest.json  … {"<PDF名>": {"pages": N, "width": W, "height": H}}
"""
from __future__ import annotations

import io
import json
import shutil
import sys
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "public" / "samples" / "property-search"
OUT_DIR = SRC_DIR / "pages"

# スマホの画面幅（CSS 390px × DPR 3 ≒ 1170px）に合わせる。拡大しても文字が読める幅。
TARGET_WIDTH = 1100
WEBP_QUALITY = 72


def render(pdf_path: Path) -> dict:
    name = pdf_path.stem
    dest = OUT_DIR / name
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)

    doc = pymupdf.open(pdf_path)
    width = height = 0
    for index, page in enumerate(doc, start=1):
        zoom = TARGET_WIDTH / page.rect.width
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
        image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        buf = io.BytesIO()
        image.save(buf, "WEBP", quality=WEBP_QUALITY, method=6)
        (dest / f"{index:02d}.webp").write_bytes(buf.getvalue())
        if index == 1:
            width, height = pix.width, pix.height
    pages = doc.page_count
    doc.close()
    return {"pages": pages, "width": width, "height": height}


def main() -> int:
    pdfs = sorted(SRC_DIR.glob("*.pdf"))
    if not pdfs:
        print(f"PDFが見つかりません: {SRC_DIR}", file=sys.stderr)
        return 1
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict] = {}
    for pdf in pdfs:
        manifest[pdf.stem] = render(pdf)
        info = manifest[pdf.stem]
        print(f"{pdf.name}: {info['pages']}ページ {info['width']}x{info['height']}")
    (OUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    print(f"{len(manifest)}件のPDFを書き出しました → {OUT_DIR.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
