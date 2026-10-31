"""Build the static public portfolio and include the curated Playwright report."""
from __future__ import annotations
import json, os, shutil
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE, REPORT, OUTPUT = ROOT / "portfolio", ROOT / "portfolio-artifacts" / "html-report", ROOT / "dist"
if not SOURCE.is_dir(): raise SystemExit("Portfolio source directory is missing.")
if not REPORT.is_dir(): raise SystemExit("Showcase report is missing. Run `npm run showcase` first.")
if OUTPUT.resolve().parent != ROOT.resolve() or OUTPUT.name != "dist": raise SystemExit("Refusing to replace an unexpected output directory.")
if OUTPUT.exists(): shutil.rmtree(OUTPUT)
shutil.copytree(SOURCE, OUTPUT)
shutil.copytree(REPORT, OUTPUT / "report")
status = {"commit": os.getenv("GITHUB_SHA", "local"), "generatedAt": datetime.now(timezone.utc).isoformat(), "runUrl": f"{os.getenv('GITHUB_SERVER_URL')}/{os.getenv('GITHUB_REPOSITORY')}/actions/runs/{os.getenv('GITHUB_RUN_ID')}" if os.getenv("GITHUB_RUN_ID") else "", "runnerApiUrl": os.getenv("PUBLIC_RUNNER_API_URL", "")}
(OUTPUT / "status.json").write_text(json.dumps(status, indent=2), encoding="utf-8")
(OUTPUT / ".nojekyll").touch()
print(f"Portfolio built at {OUTPUT} with report from {REPORT}.")
