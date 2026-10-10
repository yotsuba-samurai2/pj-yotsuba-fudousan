#!/usr/bin/env python3
"""Offline generator for the fixed 2026-10-10 correction batch. No DB or network."""
import argparse
import hashlib
import json
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--original', type=Path, default=Path('../pending-review/manifest.json'))
parser.add_argument('--revised', type=Path, default=Path('../revision-review/revised-manifest.json'))
parser.add_argument('--output', type=Path, default=Path('src/lib/data/columns-reviewed-update-20261010.ts'))
args = parser.parse_args()
locales = ['en', 'zh-tw', 'zh']
fields = ['title', 'excerpt', 'content', 'keywords', 'faq']

def material(article):
    data = {field: article[field] for field in fields if field in article}
    data['translations'] = {locale: {field: article['translations'][locale][field] for field in fields
                                     if field in article['translations'][locale]} for locale in locales}
    return data

def fingerprint(value):
    value = json.loads(json.dumps(value))
    for data in [value, *value['translations'].values()]:
        data.setdefault('keywords', [])
        data.setdefault('faq', [])
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()

notices = {
    'eiju-kyoka-shinsei-chuka-taiwan-senmonshoku': '本人確認待ち：永住ガイドラインの最新版、在留年数の特例、公的義務・提出書類を現在の一次資料で確認してください。',
    'isan-bunkatsu-10nen-904jo-3-tokubetsu-jueki': '本人確認待ち：民法904条の3の例外、施行前相続の経過措置、特別受益・寄与分の取扱いを資格者が確認してください。',
    'jihitsu-yuigon-hokan-seido-souzoku-tetsuzuki': '本人確認待ち：保管申請・閲覧・証明書の現行条件と検認不要の対象範囲を資格者が確認してください。',
    'kaigai-kyoju-remote-koyo-chuka-taiwan-shaho-roumu': '本人確認待ち：海外居住者に対する日本の労働法・社会保険と、現地法・協定・適用除外の範囲を資格者が確認してください。',
    'ninka-hoikusho-20nin-bukken-youto-engei': '本人確認待ち：東京都の定員20人以上の保育所に適用する現行施設基準・避難条件を自治体資料で確認してください。',
    'keieikanri-zairyu-jimusho-bukken-youken-chugokugo': '本人確認待ち：経営・管理の改正後の最新許可基準と事務所の独立性・継続使用要件を一次資料で確認してください。',
    'ginou-tokutei-ginou-ryo-shukusha-bukken-menseki-shobo': '本人確認待ち：技能実習と特定技能の居室面積・算定方法・最新住居基準を制度別に確認してください。',
}
old = json.loads(args.original.read_text())
new = json.loads(args.revised.read_text())
old_by_key = {(article['business'], article['slug']): article for article in old}
new_by_key = {(article['business'], article['slug']): article for article in new}
if len(old) != 18 or len(new) != 18 or len(old_by_key) != 18 or old_by_key.keys() != new_by_key.keys():
    raise SystemExit('Expected exactly the same 18 unique business/slug pairs.')
rows = []
for key, before in old_by_key.items():
    after = new_by_key[key]
    for field in ['business', 'slug', 'date', 'locales']:
        if before.get(field) != after.get(field):
            raise SystemExit(f'Protected field changed: {key}/{field}')
    rows.append({**{field: before[field] for field in ['business', 'slug', 'date', 'locales']},
                 'originalFingerprint': fingerprint(material(before)), 'revisedFingerprint': fingerprint(material(after)),
                 'original': material(before), 'revised': material(after),
                 'notice': notices.get(before['slug'], '訂正稿にも個別判断の留保があります。具体的な案件の適合性は資格者が確認します。')})
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text('// Generated offline by scripts/build-reviewed-column-update.py. Fixed 18-article correction batch.\n'
                       'import type { ReviewedUpdate } from "@/lib/columns-reviewed-update";\n\n'
                       'export const REVIEWED_COLUMN_UPDATES: ReviewedUpdate[] = '
                       + json.dumps(rows, ensure_ascii=False, indent=2) + ';\n')
print(f'Generated {len(rows)} fixed correction records: {args.output}')
