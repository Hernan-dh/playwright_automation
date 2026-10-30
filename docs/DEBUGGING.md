# Debugging and test generation

## Inspector

Inspector is an optional interactive debugging demonstration. It is not part of the automated verification gate or CI acceptance criteria.

Run a focused test with the Playwright Inspector:

```bash
npx playwright test tests/e2e/checkout.spec.ts --debug --project=chromium
```

Use the action log, locator picker, DOM snapshot, console, and network panels to identify the first failing condition. A locator proposed by the picker must still be reviewed for semantics and stability.

## Codegen

Codegen is an optional exploratory aid. Its interactive recording is not CI evidence and is never required for a release.

Generate an exploratory draft against the public demo application:

```bash
npx playwright codegen https://www.saucedemo.com
```

Recorded output is never committed unchanged. Replace generated selectors with semantic locators, extract reusable behavior into Page Objects, remove duplicated actions, and add business-level assertions.

## Trace Viewer

The first retry records a trace. Open it with:

```bash
npx playwright show-trace test-results/path/to/trace.zip
```

The trace is the preferred portfolio artifact because it contains the action timeline, DOM snapshots, console output, network traffic, and source locations.

## Portfolio showcase

Generate a deterministic HTML report whose passing tests retain screenshots and traces:

```bash
npm run showcase
npm run showcase:report
```

The generated `portfolio-artifacts` directory is intentionally ignored by Git. Publish it as a CI artifact or demonstrate it locally; inspect traces before sharing because network payloads and DOM snapshots can contain sensitive data.
