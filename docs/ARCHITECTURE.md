# Architecture

## Repository structure

- `src/pages`: reusable Page Objects.
- `src/fixtures`: typed Playwright fixtures.
- `src/data`: versioned public test datasets.
- `tests`: E2E, API, network, accessibility, visual, file, BDD, and Mocha suites.
- `playwright.config.ts`: primary multi-browser execution model.
- `playwright.auth.config.ts`: authentication setup and dependent project example.
- `scripts`: dependency-free documentation, verification, and publishing automation.

## Test flow

Playwright Test loads global setup, selects a browser project, creates isolated browser contexts, and records failure evidence according to configuration. External tests target public demo services; deterministic network, file, and browser-primitive tests use local routes or generated data. Reports and state are generated artifacts and are never committed.

## Publication boundary

`scripts/verify.py` is the single local and CI verification entry point. The pre-commit hook invokes it before Git accepts a commit. `scripts/publish.py` gathers a bounded change context, optionally requests Conventional Commit metadata from configured providers, verifies twice, and requires explicit confirmation before commit and push.

See [ADR 0001](decisions/0001-repository-managed-documentation-and-publishing.md).
