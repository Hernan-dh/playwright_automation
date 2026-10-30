# Responsible use of AI, agents, and MCP

Agents may propose a plan, generate an initial draft, or repair a locator; they do not approve quality on their own. Every AI-generated contribution requires human review of selectors, assertions, data, secrets, and false-positive risk.

An agent receives a demo URL, objective, acceptance criteria, and repository conventions. It never receives production tokens or deployment permissions. The minimum output is a reproducible test, a local execution result, a report or trace, and an explanation of what was validated. A healing agent may only propose a patch; changes are accepted through pull-request review and CI.

## Repository implementation

Playwright's agent initializer configured three Codex agents under `.codex/agents`: planner, generator, and healer. Their MCP tool allowlists restrict each role to the capabilities it needs. Versioned prompts live under `.codex/prompts`, reviewed plans under `specs`, and the public SauceDemo starting state in `tests/seed.spec.ts`.

The intended flow is plan → human review → generate one independent case at a time → run → heal only diagnosed failures → human diff review → repository verification. Generated tests never bypass `AGENTS.md`, the pre-commit hook, or CI.
