# Architecture

## Repository structure

- `src/pages`: reusable Page Objects.
- `src/fixtures`: typed Playwright fixtures.
- `src/data`: versioned public test datasets.
- `tests`: E2E, API, network, accessibility, visual, file, BDD, and Mocha suites.
- `src/schemas`: versioned API contracts compiled by AJV.
- `specs`: human-reviewed plans used by Playwright agents.
- `.codex/agents` and `.codex/prompts`: planner, generator, and healer definitions backed by the Playwright test MCP server.
- `playwright.config.ts`: primary multi-browser execution model.
- `playwright.auth.config.ts`: authentication setup and dependent project example.
- `playwright.service.config.ts`: optional Azure Playwright Workspaces execution using Entra ID credentials.
- `scripts`: dependency-free documentation, verification, and publishing automation.
- `portfolio`: buildless public presentation site.
- `deploy/netcup`: optional public Nginx mirror configuration.
- `docs/TRACEABILITY.md`: automated case IDs mapped to risks, commands, environments, and evidence.
- `docs/EVIDENCE.md`: honest status register for local, CI, interactive, and external runs.

## Test flow

Playwright Test loads global setup, selects a browser project, creates isolated browser contexts, and records failure evidence according to configuration. External tests target public demo services; deterministic network, file, and browser-primitive tests use local routes or generated data. Reports and state are generated artifacts and are never committed.

Contract tests validate API responses against versioned JSON Schemas. Performance and defensive-security tests run only against ephemeral loopback servers owned by the test process, keeping thresholds deterministic and security checks explicitly authorized.

## Publication boundary

`scripts/verify.py` is the single local and CI verification entry point. The pre-commit hook invokes it before Git accepts a commit. `scripts/publish.py` gathers a bounded change context, optionally requests Conventional Commit metadata from configured providers, verifies twice, and requires explicit confirmation before commit and push.

See [ADR 0001](decisions/0001-repository-managed-documentation-and-publishing.md).

## Public evidence publishing

The controlled showcase produces traces, screenshots, and an HTML report without private credentials or production data. `scripts/build_portfolio_site.py` combines that report with the static `portfolio` source into the ignored `dist` directory. GitHub Pages is the authoritative public site. The optional Netcup workflow deploys the identical build to a public Nginx mirror, so hosting differences cannot change test evidence.

The public QA site links back to the main professional portfolio's independently deployed GitHub Pages site, whose bilingual project card provides stable context and links to both this evidence site and its source repository. The repositories remain independently deployable and neither site is embedded in the other. A Netcup domain may mirror either site later without becoming a navigation dependency.

## Public showcase runner

The optional Netcup runner exposes only `POST /qa-api/runs`, `GET /qa-api/runs/latest`, `GET /qa-api/runs/{id}`, and a health endpoint. Requests cannot select a command, test, URL, branch, browser, or environment variable. The service always launches `npm run showcase` with a unique output directory and publishes only the controlled HTML report.

The runner container has no repository or provider secrets, uses a read-only root filesystem, drops Linux capabilities, limits processes, memory and CPU, and writes only to its result volume. The API exposes five immutable site definitions and two immutable suite levels; identifiers map server-side to fixed specs, tags, and URLs. It enforces one concurrent run, a per-site-and-suite cooldown, per-IP rate limiting, separate quick/full timeouts, bounded logs, result retention, and a maximum run count. GitHub Pages is a separate static failure boundary: if Netcup or an external practice site is unavailable, the published site and its last CI report continue to work.
