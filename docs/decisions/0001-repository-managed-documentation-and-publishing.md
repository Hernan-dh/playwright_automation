# Repository-managed documentation and publishing

Date: 2026-10-30
Status: accepted

## Context

The repository needs reproducible documentation, public-source checks, and consistent commit metadata without relying on an editor extension or hidden local workflow.

## Decision

Keep architecture, operations, capability evidence, and ADRs in the repository. Use Python standard-library scripts for documentation and controlled publishing. Centralize verification so local runs, Git hooks, and CI execute the same rules. Require explicit confirmation before staging, committing, or pushing.

## Consequences

The workflow is portable and auditable, and commit proposals can use multiple providers or explicit metadata. Contributors need Python and Node.js, must enable hooks per clone, and remain responsible for reviewing generated documentation and commit text.
