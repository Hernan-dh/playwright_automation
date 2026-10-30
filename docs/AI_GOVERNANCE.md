# Responsible use of AI, agents, and MCP

Agents may propose a plan, generate an initial draft, or repair a locator; they do not approve quality on their own. Every AI-generated contribution requires human review of selectors, assertions, data, secrets, and false-positive risk.

An agent receives a demo URL, objective, acceptance criteria, and repository conventions. It never receives production tokens or deployment permissions. The minimum output is a reproducible test, a local execution result, a report or trace, and an explanation of what was validated. A healing agent may only propose a patch; changes are accepted through pull-request review and CI.
