# Automation capability matrix

| Capability | Implementation | Status |
|---|---|---|
| JavaScript/TypeScript and async/await | Strict TypeScript, fixtures, and Page Objects | Implemented |
| Locators, assertions, waits, selects, radios, and checkboxes | `tests/ui/interactions.spec.ts` | Implemented |
| Tabs, dialogs, and frames | `tests/ui/browser-primitives.spec.ts` | Implemented |
| E-commerce E2E | `tests/e2e/checkout.spec.ts` | Implemented |
| API authentication and contract testing | `tests/api/*.spec.ts` | Implemented |
| Formal JSON Schema validation | `src/schemas`, `tests/api/schema.spec.ts` | Implemented |
| API resource lifecycle and teardown | `tests/api/lifecycle.spec.ts` | Implemented |
| API token injection into the UI | `tests/api/lifecycle.spec.ts` | Implemented |
| Browser storage-state reuse | `tests/auth/session.spec.ts` | Implemented |
| Project dependencies and authentication setup | `playwright.auth.config.ts`, `tests/setup` | Implemented |
| Network routing, response mutation, and abort | `tests/network/routes.spec.ts` | Implemented |
| Fixtures, JSON, and data-driven parameterization | `src/fixtures`, `src/data` | Implemented |
| Global setup and teardown | `src/global-setup.ts`, `src/global-teardown.ts` | Implemented |
| Screenshots, videos, traces, Inspector, and codegen | Configuration and `docs/DEBUGGING.md` | Implemented |
| Desktop Chromium visual regression | `tests/visual` | Implemented with a reviewed baseline |
| Responsive mobile behavior | `tests/mobile` | Implemented; Pixel 5 suite 2/2 passed |
| Chromium, Firefox, and WebKit compatibility | `tests/cross-browser` | Implemented; container suite 6/6 passed |
| Retries, parallelism, and tags | Playwright configuration and tagged suites | Implemented |
| Upload, download, and ExcelJS | `tests/files` | Implemented |
| Autocomplete and date controls | `tests/ui/dynamic-controls.spec.ts` | Implemented |
| Automated accessibility checks | `tests/accessibility` | Implemented |
| Performance budgets | `tests/performance` | Implemented |
| Defensive security checks on authorized targets | `tests/security` | Implemented |
| Page Object Model | Maintainable TypeScript Page Objects | Implemented |
| Cucumber BDD | `tests/bdd` | Implemented |
| Playwright with Mocha | `tests/mocha`, `docs/MOCHA_MIGRATION.md` | Implemented |
| Allure reporting | Scripts and reporter integration | Implemented |
| Docker configuration and version alignment | Dockerfile and centralized verifier | Implemented |
| Docker image build and execution | Local Docker run and GitHub Actions `container-validation` | Implemented; network 5/5 and cross-browser 6/6 passed in container |
| Jenkins pipeline | Jenkinsfile | Configured; requires a Jenkins environment |
| GitHub Actions, sharding, and report merge | `.github/workflows/playwright.yml` | Configured; runtime evidence provided by Actions |
| Azure Playwright cloud execution | Not configured | Requires an Azure subscription and credentials |
| Playwright planner, generator, healer, and test MCP | `.codex/agents`, `.codex/prompts`, `specs` | Initialized for Codex; live agent run pending |

The repository keeps Playwright Test as the single primary runner. Cucumber provides a focused BDD example, while the Mocha guide explains migration without duplicating the suite.
