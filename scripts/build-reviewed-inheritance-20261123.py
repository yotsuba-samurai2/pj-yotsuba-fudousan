#!/usr/bin/env python3
"""Freeze only the five #534 CMS corrections. Offline, does not read or write production."""
import hashlib
import json
from pathlib import Path
import subprocess

ORIGINAL = "72c3293770b66148506155afe5e608f83ca3ffc9"
REVISED = "cba893460845fbf0bbd360a9ca6cc6cc56a0edae"
SOURCES = {
    "legal": "src/lib/data/souzoku-legal-columns-seed.ts",
    "realestate": "src/lib/data/taiwan-columns-seed.ts",
}
TARGETS = [
    ("legal", "souzoku-kaigai-gaikokuseki", ["ja", "en", "zh-tw", "zh"]),
    ("legal", "kaigai-honkon-singapore-souzokunin-isanbunkatsu-shomei", ["ja", "en", "zh-tw", "zh"]),
    ("legal", "chugoku-tairiku-souzokunin-shinzoku-koshosho-ryoji-ninsho", ["ja", "en", "zh-tw", "zh"]),
    ("realestate", "taiwan-souzoku-kanri-katsuyo", ["zh-tw"]),
    ("realestate", "taiwan-souzoku-japan-fudosan", ["zh-tw"]),
]
FIELDS = ["title", "excerpt", "content", "faq"]


def by_slug(revision, path):
    text = subprocess.check_output(["git", "show", f"{revision}:{path}"], text=True)
    rows = json.loads(text.split("[] = ", 1)[1].strip().removesuffix(";"))
    return {row["slug"]: row for row in rows}


def material(article):
    return {**{field: article[field] for field in FIELDS},
            "translations": {lang: {field: value[field] for field in FIELDS}
                             for lang, value in article["translations"].items()}}


def digest(article):
    # Mirrors reviewedMaterialFingerprint(material): keywords are intentionally excluded from the correction.
    parts = {**article, "keywords": [],
             "translations": {lang: {**value, "keywords": []}
                              for lang, value in article["translations"].items()}}
    return hashlib.sha256(json.dumps(parts, sort_keys=True, ensure_ascii=False,
                                    separators=(",", ":")).encode()).hexdigest()


def main():
    tables = {biz: (by_slug(ORIGINAL, path), by_slug(REVISED, path))
              for biz, path in SOURCES.items()}
    rows = []
    for business, slug, locales in TARGETS:
        old, new = (records[slug] for records in tables[business])
        assert old["date"] == new["date"]
        assert set(old["translations"]) == set(new["translations"]) == set(locales) - {"ja"}
        before, revised = material(old), material(new)
        assert before["title"] == revised["title"]
        assert all(before["translations"][lang]["title"] == value["title"]
                   for lang, value in revised["translations"].items())
        assert before != revised
        rows.append({
            "business": business, "slug": slug, "date": old["date"], "locales": locales,
            "originalFingerprint": digest(before), "revisedFingerprint": digest(revised),
            "revised": revised,
        })
    path = Path("src/lib/data/reviewed-inheritance-20261123.json")
    path.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(rows)} fixed targets -> {path}")


if __name__ == "__main__":
    main()
