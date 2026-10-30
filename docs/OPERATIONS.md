# Operations

## Verification

```powershell
python scripts/verify.py
# or: npm run verify
```

The verifier checks Git whitespace, required documentation, private/generated files, file size, potential secrets, Python syntax, TypeScript, and deterministic Chromium tests. CI calls the same script.

CI also runs `npm audit --audit-level=high` after the reproducible `npm ci` install. Review lower-severity findings manually instead of applying unreviewed forced upgrades.

The verifier checks that the Playwright version in `package-lock.json` matches the Docker and Jenkins image tag. GitHub Actions builds that image and runs the deterministic network suite inside it. Local Docker validation requires a running Docker daemon:

`.dockerignore` keeps dependencies, Git metadata, local credentials, reports, traces, and state out of the build context.

```powershell
docker build --tag playwright-qa-portfolio:test .
docker run --rm playwright-qa-portfolio:test npm run test:network
```

The local acceptance run on 2026-10-30 built `playwright-qa-portfolio:test` with Docker Engine 29.9.2 and completed the containerized network suite with 5/5 passing tests and the Chromium/Firefox/WebKit compatibility matrix with 6/6 passing tests. The dedicated Pixel 5 suite passed 2/2 locally. Firefox test processes did not terminate reliably on the Windows host, while the same cases completed in Linux Docker; container/CI is therefore the reference Firefox environment.

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
