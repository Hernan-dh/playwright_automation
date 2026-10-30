# Evidence register

Generated reports are CI artifacts and are not committed. Record durable links, run IDs, dates, and outcomes here after external or interactive executions.

| Capability | Status | Required evidence |
|---|---|---|
| Local deterministic gate | Complete | `docs/OPERATIONS.md`: 17/17 |
| Docker network | Complete | `docs/OPERATIONS.md`: 5/5 |
| Docker cross-browser | Complete | `docs/OPERATIONS.md`: 6/6 |
| Docker mobile | Complete | `docs/OPERATIONS.md`: 2/2 |
| Docker Linux visual | Complete | Versioned Linux baseline and 1/1 comparison |
| GitHub Actions smoke | Pending repository run | Workflow URL, commit SHA, artifact name |
| GitHub Actions shards and merge | Pending manual/scheduled run | Workflow URL and merged report artifact |
| Jenkins | Pending Jenkins environment | Build URL and archived JUnit/HTML artifacts |
| Azure Playwright Workspaces | Intentionally inactive | Only record if a workspace is deliberately enabled |
| Inspector | Pending interactive capture | Screenshot showing paused step, locator, and action log |
| Codegen | Pending interactive capture | Reviewed generated draft and resulting committed test |
| Planner → generator → healer | Pending live agent run | Plan, generated test, agent log, reviewed diff, final report |

Never commit credentials, workspace URLs containing identifiers, access tokens, storage state, raw traces with sensitive data, or private CI logs.
