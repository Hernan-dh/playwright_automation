# Mocha migration decision

This repository uses Playwright Test as its primary runner because it integrates fixtures, projects, retries, traces, reporters, and parallel execution. Duplicating the same scenarios in Mocha would increase maintenance cost without improving coverage.

For a legacy Mocha project, retain reusable Page Objects and migrate incrementally: install `@playwright/test`, move smoke tests first, replace hooks with fixtures, enable reports and traces, and retire Mocha once both suites produce equivalent results.
