# Agent instructions

## Continuous documentation

- Document lasting functional, technical, or operational changes in the same task.
- Update `docs/ARCHITECTURE.md` when components, integrations, or execution flows change.
- Update `docs/OPERATIONS.md` when verification, reporting, CI, or publishing changes.
- Update `docs/CAPABILITY_MATRIX.md` only when executable evidence exists.
- Create an ADR when relevant alternatives exist and the decision is not evident from the code.
- Never include credentials, private data, traces, session state, or local values in versioned files.

## Publishing

- Run `python scripts/verify.py` before publishing.
- Do not create commits or push without explicit user authorization.
- Never force-push.
