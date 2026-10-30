# Test traceability matrix

This matrix is the authoritative map from automated case IDs to risk, executable source, command, environment, and expected evidence. `scripts/check_traceability.py` fails verification when a test ID is missing from this document.

| IDs | Coverage and risk | Source | Primary command | Reference environment | Evidence |
|---|---|---|---|---|---|
| AUTH-01, AUTH-02, CART-01, CHECK-01, CHECK-02 | Authentication, cart, and revenue-critical checkout | `tests/e2e/checkout.spec.ts` | `npm run test:smoke` | Chromium + SauceDemo | HTML report; failure trace/video |
| AUTH-03 | Reusable authenticated browser state | `tests/auth/session.spec.ts` | `npm run test:session` | Chromium + SauceDemo | State written only to test output |
| AUTH-04 | Data-driven invalid authentication | `tests/e2e/data-driven-login.spec.ts` | `npm test -- --grep AUTH-04` | Chromium + SauceDemo | Parameterized report entries |
| AUTH-05, SETUP-01 | Setup-project dependency and preauthenticated execution | `tests/setup`, `tests/auth/preauthenticated.spec.ts` | `npm run test:project-dependencies` | Chromium + SauceDemo | Setup and dependent-project report |
| API-01, API-02 | Product contract and public authentication endpoint | `tests/api/contracts.spec.ts` | `npm run test:api` | DummyJSON | Request/response trace |
| API-03 | Persisted API lifecycle and cleanup | `tests/api/lifecycle.spec.ts` | `npm test -- --grep API-03` | Ephemeral loopback API | Create/get/delete/404 assertions |
| API-04 | API token injection into browser storage | `tests/api/lifecycle.spec.ts` | `npm run test:session` | DummyJSON + controlled UI | API response and UI assertion |
| API-05 | Formal JSON Schema validation | `tests/api/schema.spec.ts` | `npm run test:contract` | DummyJSON | AJV error details on drift |
| NET-01, NET-02, NET-03, NET-04, NET-05 | Mock, request mutation, failure, response mutation, and abort | `tests/network/routes.spec.ts` | `npm run test:network` | Controlled browser routes | Network timeline and assertions |
| UI-01 | Semantic locators and native controls | `tests/ui/interactions.spec.ts` | `npm test -- --grep UI-01` | Public practice form | UI assertions |
| UI-02, UI-03 | Autocomplete and date input | `tests/ui/dynamic-controls.spec.ts` | `npm test -- --grep UI-` | Controlled DOM | Deterministic UI assertions |
| UX-01, UX-02, UX-03 | Dialog, iframe, and new tab | `tests/ui/browser-primitives.spec.ts` | `npm test -- --grep UX-` | Controlled DOM | Browser-event assertions |
| FILE-01, FILE-02, FILE-03 | Upload, download, and Excel mutation | `tests/files` | `npm test -- --grep FILE-` | Generated test artifacts | Download/workbook in isolated output |
| VIS-01 | Reviewed inventory visual baseline | `tests/visual/inventory.spec.ts` | `npm run test:visual` | Chromium Windows/Linux | Versioned baseline and diff on failure |
| A11Y-01 | Serious and critical accessibility violations | `tests/accessibility` | `npm run test:accessibility` | Controlled accessible page | Axe violation details |
| PERF-01 | Navigation and API timing budgets | `tests/performance` | `npm run test:performance` | Ephemeral loopback server | Performance API metrics |
| SEC-01 | Defensive response headers | `tests/security` | `npm run test:security` | Authorized loopback server | Header assertions |
| MOBILE-01, MOBILE-02 | Responsive navigation and overflow | `tests/mobile` | `npm run test:mobile` | Pixel 5 emulation / Docker | Mobile project report |
| COMPAT-01, COMPAT-02 | Forms and storage across engines | `tests/cross-browser` | `npm run test:cross-browser` | Chromium, Firefox, WebKit / Docker | Cross-project report |
| BDD-01, BDD-02 | Executable behavior specifications | `tests/bdd` | `npm run bdd` | Chromium + SauceDemo | Cucumber HTML report |
| MOCHA-01 | Playwright interoperability with Mocha | `tests/mocha` | `npm run mocha` | Chromium | Mocha result |
| SEED-01 | Agent starting state | `tests/seed.spec.ts` | Playwright test MCP | Chromium + SauceDemo | Agent log and generated test reference |

## External execution evidence

Docker network, mobile, visual, and cross-browser runs are recorded in `docs/OPERATIONS.md`. GitHub Actions, Jenkins, Azure Workspaces, Inspector, Codegen, and live agent executions require their respective external or interactive environment; use `docs/EVIDENCE.md` to record them without overstating their status.
