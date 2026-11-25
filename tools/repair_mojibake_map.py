from __future__ import annotations

from pathlib import Path
import shutil
import sys


ARABIC_CHARS = (
    "ابتثجحخدذرزسشصضطظعغفقكلمنهويىةأإآءؤئ"
    "ًٌٍَُِّْـ،؛؟"
    "٠١٢٣٤٥٦٧٨٩"
    "–—•·…“”‘’"
)


def build_map() -> dict[str, str]:
    mapping: dict[str, str] = {}
    for ch in ARABIC_CHARS:
        try:
            bad = ch.encode("utf-8").decode("cp1256")
        except UnicodeError:
            continue
        if bad != ch:
            mapping[bad] = ch
    return dict(sorted(mapping.items(), key=lambda kv: len(kv[0]), reverse=True))


def score(text: str, keys: list[str]) -> int:
    return sum(text.count(k) for k in keys)


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: repair_mojibake_map.py <file>")
        return 2
    path = Path(sys.argv[1])
    text = path.read_text(encoding="utf-8-sig")
    backup = path.with_suffix(path.suffix + ".pre-map-repair.bak")
    if not backup.exists():
        shutil.copy2(path, backup)
    mapping = build_map()
    before = score(text, list(mapping.keys()))
    replacements = 0
    for bad, good in mapping.items():
        count = text.count(bad)
        if count:
            replacements += count
            text = text.replace(bad, good)
    after = score(text, list(mapping.keys()))
    path.write_text(text, encoding="utf-8")
    print(f"target={path}")
    print(f"backup={backup}")
    print(f"map_entries={len(mapping)}")
    print(f"replacements={replacements}")
    print(f"before_score={before}")
    print(f"after_score={after}")
    print(f"arabic_after={sum(chr(0x600) <= ch <= chr(0x6ff) for ch in text)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
