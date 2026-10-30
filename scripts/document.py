"""Generate the changelog and ADR drafts from repository information."""
from __future__ import annotations
import argparse, re, subprocess, unicodedata
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DECISIONS = ROOT / "docs" / "decisions"
CATEGORIES = (("feat", "Features"), ("fix", "Fixes"), ("test", "Tests"), ("docs", "Documentation"), ("refactor", "Refactors"), ("perf", "Performance"), ("build", "Build"), ("ci", "CI"), ("chore", "Maintenance"))
COMMIT = re.compile(rf"^({'|'.join(kind for kind, _ in CATEGORIES)})(?:\([^)]+\))?!?:\s+(.+)$", re.I)

def git(*args: str, check: bool = True) -> str:
    result = subprocess.run(["git", "-c", f"safe.directory={ROOT.as_posix()}", "-C", str(ROOT), *args], check=check, capture_output=True, text=True, encoding="utf-8")
    return result.stdout

def write_changelog() -> None:
    records: dict[str, list[tuple[str, str]]] = defaultdict(list)
    history = git("log", "--pretty=format:%h%x1f%s%x1e", check=False)
    for entry in history.split("\x1e"):
        entry = entry.strip()
        if not entry or "\x1f" not in entry: continue
        commit_hash, subject = entry.split("\x1f", 1)
        match = COMMIT.match(subject)
        records[match.group(1).lower() if match else "other"].append((commit_hash, match.group(2) if match else subject))
    lines = ["# Changelog", "", "Generated deterministically from Git history.", ""]
    if not records: lines.extend(["No commits have been recorded yet.", ""])
    for kind, heading in (*CATEGORIES, ("other", "Other changes")):
        if records[kind]: lines.extend([f"## {heading}", "", *(f"- {subject} (`{commit_hash}`)" for commit_hash, subject in records[kind]), ""])
    (ROOT / "CHANGELOG.md").write_text("\n".join(lines), encoding="utf-8")
    print("CHANGELOG.md updated.")

def create_decision(title: str) -> None:
    slug = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode().lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug).strip("-")
    if not slug: raise SystemExit("The title must contain letters or numbers.")
    numbers = [int(path.name[:4]) for path in DECISIONS.glob("[0-9][0-9][0-9][0-9]-*.md")]
    path = DECISIONS / f"{max(numbers, default=0) + 1:04d}-{slug}.md"
    path.write_text(f"# {title}\n\nDate: {date.today().isoformat()}\nStatus: proposed\n\n## Context\n\n<!-- Situation, constraints, and alternatives. -->\n\n## Decision\n\n<!-- Selected option and rationale. -->\n\n## Consequences\n\n<!-- Benefits, costs, and risks. -->\n", encoding="utf-8")
    print(path.relative_to(ROOT))

parser = argparse.ArgumentParser(description=__doc__)
commands = parser.add_subparsers(dest="command", required=True)
commands.add_parser("changelog")
decision = commands.add_parser("decision"); decision.add_argument("title")
arguments = parser.parse_args()
write_changelog() if arguments.command == "changelog" else create_decision(arguments.title)
