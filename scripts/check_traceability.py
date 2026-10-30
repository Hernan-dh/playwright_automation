"""Ensure every automated case ID is represented in the traceability matrix."""
from __future__ import annotations
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CASE_ID = re.compile(r"\b[A-Z][A-Z0-9]+-\d{2}\b")
SOURCE_SUFFIXES = {".ts", ".js", ".feature"}

source_ids: set[str] = set()
for path in (ROOT / "tests").rglob("*"):
    if path.is_file() and path.suffix in SOURCE_SUFFIXES:
        source_ids.update(CASE_ID.findall(path.read_text(encoding="utf-8")))

documented = set(CASE_ID.findall((ROOT / "docs" / "TRACEABILITY.md").read_text(encoding="utf-8")))
missing = sorted(source_ids - documented)
stale = sorted(documented - source_ids)
if missing or stale:
    if missing: print("Missing traceability IDs: " + ", ".join(missing))
    if stale: print("Documented IDs without executable source: " + ", ".join(stale))
    sys.exit(1)
print(f"Traceability verified: {len(source_ids)} executable case IDs documented.")
