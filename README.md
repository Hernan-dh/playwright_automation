# Playwright QA Automation Portfolio

A public test automation repository demonstrating modern QA practices with Playwright and TypeScript. The tests run only against public practice websites and APIs; the repository contains no secrets or production data.

## Capabilities

- E-commerce E2E flows, Page Objects, fixtures, external test data, and negative cases.
- API testing, authentication, contract validation, and combined API/UI testing.
- Network interception: response mocking, request mutation, and controlled failures.
- Frames, dialogs, tabs, file upload/download, visual regression, and mobile emulation.
- Cucumber BDD, HTML/JUnit/JSON/Allure reports, traces, screenshots, and videos.
- Local execution, Docker, and GitHub Actions for pull-request smoke tests and scheduled regression.

## Quick start

```bash
npm ci
npx playwright install --with-deps
npm run test:smoke
npm run report
```

On PowerShell systems that block `npx.ps1`, use `npx.cmd` or `node node_modules/@playwright/test/cli.js`.

## Commands by purpose

| Command | Purpose |
|---|---|
| `npm test` | Complete Playwright regression suite |
| `npm run test:smoke` | P0 flows in Chromium |
| `npm run test:api` | API contracts and authentication |
| `npm run test:network` | Isolated and deterministic interception tests |
| `npm run test:accessibility` | Axe accessibility scan |
| `npm run test:session` | Browser state and API-token session tests |
| `npm run test:project-dependencies` | Authentication setup project followed by authenticated tests |
| `npm run test:visual` | Comparison against the approved baseline |
| `npm run test:mobile` | Pixel 5 emulation |
| `npm run bdd` | Cucumber scenarios |
| `npm run mocha` | Mocha interoperability example |

## Portfolio evidence

When a test fails, Playwright stores a screenshot and video; the first retry also records `trace.zip`. Open it with `npx playwright show-trace test-results/.../trace.zip`. The HTML report consolidates steps, attachments, and retries. Generated results are not committed: CI uploads them as artifacts.

See the [test strategy](docs/TEST_STRATEGY.md), [capability matrix](docs/CAPABILITY_MATRIX.md), and [contribution guide](CONTRIBUTING.md).

## Documentation and publishing automation

```bash
python scripts/verify.py
python scripts/install_hooks.py
python scripts/document.py changelog
python scripts/document.py decision "Decision title"
python scripts/publish.py --preview
```

The verifier is shared by local development, the pre-commit hook, and CI. The publishing command can generate Conventional Commit metadata through an optional configured provider, but it never stages, commits, or pushes until verification passes and the user types `PUBLISH`. See [operations](docs/OPERATIONS.md) for the full workflow and recovery instructions.
