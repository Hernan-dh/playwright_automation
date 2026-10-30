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
| GitHub Actions smoke | Published run failed during workflow parsing | Run `41141233095` on `c6ab028`; `actionlint` identified the inline artifact-name mapping and the validated local fix awaits publication |
| GitHub Actions shards and merge | Pending manual/scheduled run | Workflow URL and merged report artifact |
| Jenkins | Local container preflight complete; controller run pending | Image `8c9bd267c762`; smoke 2/2. A Jenkins build URL and archived artifacts still require a controller |
| Azure Playwright Workspaces | Intentionally inactive | Only record if a workspace is deliberately enabled |
| Inspector | Optional demonstration | One-time screenshot or short recording; not required by verification or CI |
| Codegen | Optional demonstration | One-time reviewed recording draft; never required by verification or CI |
| Planner → generator → healer | Complete | `specs/agent-runs`: plan, generated tests, repeated healer run, and acceptance decision |

Never commit credentials, workspace URLs containing identifiers, access tokens, storage state, raw traces with sensitive data, or private CI logs.
