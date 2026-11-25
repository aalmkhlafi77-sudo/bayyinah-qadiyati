from pathlib import Path
import json


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "dist" / "assets"


def count(text: str, needle: str) -> int:
    return text.count(needle)


def main() -> None:
    rows = []
    for path in sorted(ASSETS.glob("*")):
        if path.suffix not in {".js", ".css"}:
            continue
        text = path.read_text(encoding="utf-8")
        rows.append(
            {
                "file": path.name,
                "chars": len(text),
                "arabic": sum("\u0600" <= ch <= "\u06ff" for ch in text),
                "bad_al": count(text, "\u0637\u00a7\u0638\u201e"),
                "question_runs": count(text, "????"),
                "bayyinah": "\u0628\u064a\u0651\u0646\u0629" in text,
                "register": "\u062a\u0633\u062c\u064a\u0644 \u0645\u0633\u062a\u062e\u062f\u0645 \u062c\u062f\u064a\u062f" in text,
            }
        )
    print(json.dumps(rows, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
