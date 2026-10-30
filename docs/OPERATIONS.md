# Operations

## Verification

```powershell
python scripts/verify.py
# or: npm run verify
```

The verifier checks Git whitespace, required documentation, private/generated files, file size, potential secrets, Python syntax, TypeScript, and deterministic Chromium tests. CI calls the same script.

CI also runs `npm audit --audit-level=high` after the reproducible `npm ci` install. Review lower-severity findings manually instead of applying unreviewed forced upgrades.

Enable the repository-managed pre-commit hook for this clone:

```powershell
python scripts/install_hooks.py
# or: npm run hooks:install
```

## Documentation

```powershell
python scripts/document.py changelog
python scripts/document.py decision "Decision title"
```

The changelog is rebuilt from Conventional Commit history. ADR drafts receive the next available number.

## Commit proposal and publication

Copy `.env.example` to `.env` and configure at least one optional provider key, or provide metadata explicitly. `.env` remains ignored.

```powershell
python scripts/publish.py --preview
python scripts/publish.py
python scripts/publish.py --title "test: expand session coverage" --description "Add authenticated-state and API-to-UI verification."
```

Preview mode does not modify Git. Publishing lists every included path and requires typing `PUBLISH` before staging, re-verifying, committing, and pushing. It never force-pushes. Provider-bound context is capped and treats repository content as untrusted data.

## Recovery

If verification fails, correct the reported problem and rerun it. If metadata generation fails, retry another configured provider or pass both metadata arguments. If a commit succeeds but push fails, inspect the remote and branch before running `git push`; do not rewrite history automatically.
