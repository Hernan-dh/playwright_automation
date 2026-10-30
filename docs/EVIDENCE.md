# Evidence register

Generated reports are CI artifacts and are not committed. Record durable links, run IDs, dates, and outcomes here after external or interactive executions.

| Capability | Status | Required evidence |
|---|---|---|
| Local deterministic gate | Complete | `docs/OPERATIONS.md`: 17/17 |
| Docker network | Complete | `docs/OPERATIONS.md`: 5/5 |
| Docker cross-browser | Complete | `docs/OPERATIONS.md`: 6/6 |
| Docker mobile | Complete | `docs/OPERATIONS.md`: 2/2 |
| Docker Linux visual | Complete | Versioned Linux baseline and 1/1 comparison |
| Local trace showcase | Complete | 11/11 passing tests with retained traces and screenshots |
| GitHub Actions push validation | Complete | Run [`41142677217`](https://github.com/Hernan-dh/playwright_automation/actions/runs/41142677217) on `e751fcd`: verification, smoke, containers, and `playwright-evidence` artifact (`13019626914`) passed |
| GitHub Actions manual portfolio run | Complete | Run [`41141799551`](https://github.com/Hernan-dh/playwright_automation/actions/runs/41141799551): showcase, both regression shards, smoke, containers, and report merge passed |
| GitHub Actions portfolio evidence | Complete | Artifacts `portfolio-showcase` (`13019800203`) and `merged-html-report` (`13019830301`), retained by GitHub for 14 and 30 days respectively |
| Jenkins portability reference | Optional; no pending acceptance work | `Jenkinsfile` plus local container preflight image `8c9bd267c762`, smoke 2/2. GitHub Actions is the authoritative CI environment |
| Azure Playwright Workspaces | Intentionally inactive | Only record if a workspace is deliberately enabled |
| Inspector | Optional demonstration | One-time screenshot or short recording; not required by verification or CI |
| Codegen | Optional demonstration | One-time reviewed recording draft; never required by verification or CI |
| Planner → generator → healer | Complete | `specs/agent-runs`: plan, generated tests, repeated healer run, and acceptance decision |

Never commit credentials, workspace URLs containing identifiers, access tokens, storage state, raw traces with sensitive data, or private CI logs.
