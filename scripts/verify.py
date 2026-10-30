"""Run centralized public-repository checks locally, in hooks, and in CI."""
from __future__ import annotations
import ast, re, shutil, subprocess, sys, tokenize
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ESSENTIAL = ("README.md", "LICENSE", "AGENTS.md", "CHANGELOG.md", ".env.example", "package.json", "package-lock.json", "playwright.config.ts", "docs/ARCHITECTURE.md", "docs/OPERATIONS.md", "docs/CAPABILITY_MATRIX.md", "docs/decisions/README.md")
PRIVATE_NAMES = {".env", "credentials.json", "secrets.json", "id_rsa", "id_ed25519", "state.json"}
PRIVATE_SUFFIXES = {".key", ".pem", ".p12", ".pfx"}
GENERATED = {"node_modules", "test-results", "playwright-report", "allure-results", "allure-report", "storage-state", "__pycache__"}
GENERATED_SUFFIXES = {".log", ".webm", ".zip"}
TEXT_SUFFIXES = {".js", ".json", ".md", ".py", ".sh", ".ts", ".yml", ".yaml", ".feature"}
SECRET_PATTERNS = (
    re.compile(r"AIza[0-9A-Za-z_-]{35}"), re.compile(r"\b(?:gsk_|github_pat_|sk-or-v1-)[A-Za-z0-9_-]{20,}"),
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"), re.compile(r"\bgh[opurs]_[A-Za-z0-9_]{30,}"),
    re.compile(r"\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}"),
)
MARKDOWN_LINK = re.compile(r"\[[^]]+\]\((?!https?://|mailto:|#)([^)]+)\)")

def command(args: list[str], *, capture: bool = False) -> subprocess.CompletedProcess:
    return subprocess.run(args, cwd=ROOT, check=False, capture_output=capture)

def repository_files(errors: list[str]) -> list[Path]:
    result = command(["git", "-c", f"safe.directory={ROOT.as_posix()}", "ls-files", "--cached", "--others", "--exclude-standard", "-z"], capture=True)
    if result.returncode: errors.append("Could not list repository files"); return []
    return [ROOT / value.decode("utf-8") for value in result.stdout.split(b"\0") if value]

def run_check(label: str, args: list[str], errors: list[str]) -> None:
    print(f"[check] {label}")
    if command(args).returncode: errors.append(f"{label} failed")

def main() -> int:
    errors: list[str] = []
    files = repository_files(errors)
    run_check("git whitespace", ["git", "-c", f"safe.directory={ROOT.as_posix()}", "diff", "--check"], errors)
    print("[check] files, documentation, and secrets")
    for relative in ESSENTIAL:
        if not (ROOT / relative).is_file(): errors.append(f"Missing essential file: {relative}")
    for path in files:
        if not path.is_file(): continue
        relative = path.relative_to(ROOT)
        private_env = path.name.startswith(".env.") and path.name != ".env.example"
        if private_env or path.name.lower() in PRIVATE_NAMES or path.suffix.lower() in PRIVATE_SUFFIXES: errors.append(f"Private file: {relative}")
        if {part.lower() for part in relative.parts} & GENERATED: errors.append(f"Generated file is not ignored: {relative}")
        if path.suffix.lower() in GENERATED_SUFFIXES: errors.append(f"Generated artifact is not ignored: {relative}")
        if path.stat().st_size > 5 * 1024 * 1024: errors.append(f"File exceeds 5 MiB: {relative}")
        if path.suffix.lower() not in TEXT_SUFFIXES or path.stat().st_size > 1024 * 1024: continue
        try: content = path.read_text(encoding="utf-8")
        except UnicodeDecodeError: continue
        for number, line in enumerate(content.splitlines(), 1):
            if any(pattern.search(line) for pattern in SECRET_PATTERNS): errors.append(f"Sensitive value candidate at {relative}:{number}")
        if path.suffix.lower() == ".md":
            for target in MARKDOWN_LINK.findall(content):
                clean = target.strip("<>").split("#", 1)[0]
                if clean and not (path.parent / clean).resolve().is_file(): errors.append(f"Missing documentation link in {relative}: {target}")
    print("[check] Python syntax")
    for path in files:
        if path.suffix == ".py" and path.is_file():
            try:
                with tokenize.open(path) as source: ast.parse(source.read(), filename=str(path))
            except (SyntaxError, UnicodeError) as error: errors.append(f"Invalid Python in {path.relative_to(ROOT)}: {error}")
    node = shutil.which("node")
    npm = shutil.which("npm")
    if not node or not npm: errors.append("Node.js and npm are required")
    else:
        run_check("TypeScript", [npm, "run", "lint"], errors)
        run_check("deterministic Chromium tests", [node, "node_modules/@playwright/test/cli.js", "test", "--project=chromium", "--grep=@network|UX-|FILE-|UI-02|UI-03|A11Y-|API-03"], errors)
    if errors:
        print("\nVerification failed:")
        for error in errors: print(f"- {error}")
        return 1
    print("\nVerification completed successfully.")
    return 0

if __name__ == "__main__": sys.exit(main())
