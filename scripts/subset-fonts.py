"""Builds the self-hosted fonts in src/assets/fonts/ from Google Fonts.

Same outlines as Google's "latin" files, trimmed to what the site uses:
the weights in design-system.md, the OpenType features text needs (kerning,
marks, contextual forms, ligatures) and the characters in CHARSET. This cuts
the fonts from ~115 KB to ~55 KB, which shortens LCP (performance-seo.md).

Run after adding a character to the copy that is not in CHARSET (the unit test
src/content/fonts-charset.test.ts names it):

    python3 -m venv .venv-fonts && .venv-fonts/bin/pip install fonttools==4.60.1 brotli==1.1.0
    .venv-fonts/bin/python scripts/subset-fonts.py
"""

import io
import json
import re
import urllib.request
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "fonts"
# A current browser user agent, so the CSS API answers with WOFF2 files.
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"

# Printable ASCII, every French letter, the punctuation French and English copy
# uses, and the symbols in the dictionaries. Wider than today's copy on purpose.
CHARSET = (
    "".join(chr(c) for c in range(0x20, 0x7F))
    + "  "  # no-break space, narrow no-break space (French « : ; ! ? »)
    + "àâäæçéèêëîïôöœùûüÿÀÂÄÆÇÉÈÊËÎÏÔÖŒÙÛÜŸ"
    + "’‘“”«»‹›–—…•·©®™€°×"
    + "→↓↗✓"
)

# (output file, CSS API family query, weight axis range or None for static)
FONTS = [
    ("inter-latin.woff2", "Inter:wght@400;500;600;700", (400, 700)),
    ("bricolage-latin.woff2", "Bricolage+Grotesque:wght@700;800", (700, 800)),
    ("kalam-400-latin.woff2", "Kalam:wght@400", None),
    ("kalam-700-latin.woff2", "Kalam:wght@700", None),
]

FEATURES = ["kern", "mark", "mkmk", "calt", "ccmp", "locl", "liga"]


def latin_woff2_url(family: str) -> str:
    request = urllib.request.Request(
        f"https://fonts.googleapis.com/css2?family={family}&display=swap",
        headers={"User-Agent": UA},
    )
    css = urllib.request.urlopen(request).read().decode()
    # The CSS lists one @font-face per subset, each preceded by a /* subset */ comment.
    for block in re.split(r"/\* ", css):
        if block.startswith("latin */"):
            return re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
    raise RuntimeError(f"no latin subset for {family}")


def build(family: str, axis) -> bytes:
    data = urllib.request.urlopen(latin_woff2_url(family)).read()
    font = TTFont(io.BytesIO(data), lazy=False)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = FEATURES
    options.name_IDs = [1, 2, 3, 4, 5, 6]
    options.notdef_outline = True
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=CHARSET)
    subsetter.subset(font)
    if axis and "fvar" in font:
        font = instancer.instantiateVariableFont(font, {"wght": axis})
    out = io.BytesIO()
    font.flavor = "woff2"
    font.save(out)
    return out.getvalue()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for filename, family, axis in FONTS:
        data = build(family, axis)
        (OUT / filename).write_bytes(data)
        print(f"{filename}: {len(data)} bytes")
    (OUT / "charset.json").write_text(
        json.dumps({"characters": CHARSET}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
