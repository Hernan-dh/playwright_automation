# Debugging and test generation

## Inspector

Run a focused test with the Playwright Inspector:

```bash
npx playwright test tests/e2e/checkout.spec.ts --debug --project=chromium
```

Use the action log, locator picker, DOM snapshot, console, and network panels to identify the first failing condition. A locator proposed by the picker must still be reviewed for semantics and stability.

## Codegen

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
