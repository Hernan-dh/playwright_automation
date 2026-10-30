# Contributing

1. Create a branch from `main` and keep each change small and verifiable.
2. Prefer `getByRole`, `getByLabel`, or `getByTestId`; avoid brittle CSS/XPath unless no semantic alternative exists.
3. Keep every test independent. Never use real credentials or `waitForTimeout`.
4. Run `npm run lint` and the affected test tag before opening a pull request.
5. Manually review every snapshot change before running `npm run test:visual -- --update-snapshots`.

Do not commit `node_modules`, reports, videos, traces, session state, `.env` files, generated exports, or third-party training material.
