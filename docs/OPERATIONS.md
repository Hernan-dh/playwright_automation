# Operations

## Verification

```powershell
python scripts/verify.py
# or: npm run verify
```

The verifier checks Git whitespace, required documentation, private/generated files, file size, potential secrets, Python syntax, TypeScript, and deterministic Chromium tests. CI calls the same script.

CI also runs `npm audit --audit-level=high` after the reproducible `npm ci` install. Review lower-severity findings manually instead of applying unreviewed forced upgrades.

Generate reviewable portfolio evidence locally with `npm run showcase`. The dedicated run currently exercises 11 deterministic context, network, and browser-primitive scenarios and retains a trace and screenshot for every passing test under the ignored `portfolio-artifacts` directory.

## Public portfolio publishing

Build the complete static site locally with:

```powershell
npm run portfolio:build
```

The command reruns the controlled showcase and writes the public site plus HTML report to ignored `dist/`. `.github/workflows/pages.yml` publishes that build to GitHub Pages on `main` and on manual dispatch. Enable Pages with GitHub Actions as its source once for the repository.

The opt-in `.github/workflows/netcup.yml` runs on pushes to `main` and manual recovery dispatches. It produces the same build and deploys both the static mirror and the minimal controlled runner bundle over SSH only when `NETCUP_DEPLOY_ENABLED=true`. It recreates the Compose services and verifies their loopback health endpoint. Server and repository configuration are documented in `deploy/netcup/README.md`. Netcup is a public mirror, not a CI dependency; a server outage never blocks testing or the primary Pages site.

The public runner is disabled in the Pages UI until the repository variable `PUBLIC_RUNNER_API_URL` is set. Use the externally reachable API base including `/qa-api`, for example `https://example.test/qa-api`. The UI loads five allowlisted destinations, submits only the selected identifier, polls its public status, and links to the generated report. Never point this variable at an administrative service or an endpoint that accepts arbitrary URLs or executable input.

The `Jenkinsfile` is an optional portability reference for teams that use Jenkins. Its container preflight completed the smoke suite 2/2 in the pinned Playwright image. A Jenkins controller run is deliberately outside the portfolio acceptance criteria because GitHub Actions is the authoritative CI environment and already publishes the required reports and evidence.

The verifier checks that the Playwright version in `package-lock.json` matches the Docker and Jenkins image tag. GitHub Actions builds that image and runs the deterministic network suite inside it. Local Docker validation requires a running Docker daemon:

`.dockerignore` keeps dependencies, Git metadata, local credentials, reports, traces, and state out of the build context.

```powershell
docker build --tag playwright-qa-portfolio:test .
docker run --rm playwright-qa-portfolio:test npm run test:network
```

The local acceptance run on 2026-10-30 built `playwright-qa-portfolio:test` with Docker Engine 29.9.2 and completed the containerized network suite with 5/5 passing tests and the Chromium/Firefox/WebKit compatibility matrix with 6/6 passing tests. The dedicated Pixel 5 suite passed 2/2 locally. Firefox test processes did not terminate reliably on the Windows host, while the same cases completed in Linux Docker; container/CI is therefore the reference Firefox environment.

## Azure Playwright Workspaces

The optional `azure-playwright` job is disabled unless the repository variable `AZURE_PLAYWRIGHT_ENABLED` equals `true`. Configure GitHub OIDC secrets `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID`, plus the regional `PLAYWRIGHT_SERVICE_URL` secret. The workflow uses Entra ID through `DefaultAzureCredential`; no access token is stored in the repository.

Run the same cloud matrix locally after `az login` and setting the service URL:

```powershell
$env:PLAYWRIGHT_SERVICE_URL = "wss://region.api.playwright.microsoft.com/..."
npm run test:azure
```

See the [official Playwright Workspaces CI quickstart](https://learn.microsoft.com/en-us/azure/app-testing/playwright-workspaces/quickstart-automate-end-to-end-testing).

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
