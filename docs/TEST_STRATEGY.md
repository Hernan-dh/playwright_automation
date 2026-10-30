# Test strategy

## Objective

Reduce regression risk across authentication, catalog, cart, and checkout by applying a balanced test pyramid: fast API contract tests, critical UI E2E coverage, and a small set of reviewed visual snapshots.

## Risk matrix

| ID | Scenario | Risk | Priority | Evidence |
|---|---|---:|---:|---|
| AUTH-01/02 | valid / invalid login | access | P0/P1 | UI, trace |
| AUTH-03..05 | storage state, data-driven login, and setup dependency | access / efficiency | P1 | UI, state artifact |
| CART-01 | add a product | revenue | P0 | UI E2E |
| CHECK-01/02 | purchase / required fields | revenue | P0/P1 | UI E2E |
| CART-02 | remove a product before checkout | revenue / recovery | P1 | UI E2E |
| CHECK-03..05 | field validation, overview integrity, and cancellation | revenue / data integrity | P1 | UI E2E and trace |
| API-01/02 | contract / authentication | integration | P1 | request/response |
| API-03/04 | resource lifecycle and API-to-UI token injection | integration / cleanup | P1 | request/response, UI |
| NET-01..03 | mock, request mutation, and failure | resilience | P1/P2 | network trace |
| FILE-01/02 | upload/download | operations | P2 | downloaded file |
| UX-01..03 | frame, dialog, and tab | compatibility | P2 | report |
| VIS-01 | catalog | visual regression | P2 | snapshot |
| A11Y-01 | serious and critical accessibility rules | usability / compliance | P1 | Axe results |
| PERF-01 | navigation and API response budgets | performance regression | P2 | Performance API metrics |
| SEC-01 | defensive response headers | security hardening | P1 | HTTP response headers |
| API-05 | JSON Schema conformance | integration drift | P1 | AJV validation errors |
| MOBILE-01/02 | mobile navigation and horizontal overflow | responsive usability | P1 | Pixel 5 project |
| COMPAT-01/02 | forms and storage across browser engines | compatibility | P1 | Chromium, Firefox, WebKit matrix |
| CTX-01/02 | geolocation permission and offline behavior | environment resilience / privacy | P1 | context state and UI assertion |
| TIME-01 | deterministic timer behavior | reliability / execution time | P1 | virtual-clock assertion |

## Entry and exit criteria

Entry: dependencies and browsers installed, demo URLs available, and visual baseline reviewed. Exit: all P0 scenarios pass; P1 scenarios pass or have a documented defect; reports and attachments are published. A test that passes only after a retry is investigated as potential flakiness.

## Triage

1. Open the HTML report and classify the issue as product, infrastructure, test, or data related.
2. Inspect screenshots, video, and trace data: timeline, DOM, console, requests, and responses.
3. Reproduce in the affected project; do not increase timeouts without explaining the awaited condition.
4. Record severity, reproduction steps, expected/actual results, and evidence.
