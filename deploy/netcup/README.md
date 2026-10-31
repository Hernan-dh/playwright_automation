# Public Netcup mirror

Netcup is an optional public mirror of the same static `dist` directory deployed to GitHub Pages. It also runs five fixed public-site suites behind a rate-limited API. The runner has no secrets, accepts only an allowlisted site identifier, and exposes controlled reports.

## Server setup

1. Use the existing deployment account with passwordless access to the narrowly scoped Docker command and two sibling directories it owns: `/srv/portfolio-demos/playwright-portfolio` for public files and `/srv/portfolio-demos/playwright_automation` for the controlled application bundle. Keeping them separate prevents application synchronization from deleting the static build.
2. Point a public subdomain to the server and terminate HTTPS with the server's existing reverse proxy or certificate automation.
3. The deployment workflow builds and starts Compose from the application directory. Nginx listens only on loopback port `7870`; the API is reachable only through Caddy.
4. Keep the firewall, operating system, Docker, and reverse proxy patched.

The public reverse proxy forwards `/qa-api/*` and `/qa-runs/*` to `127.0.0.1:7870` while preserving the path, and may expose the static mirror below `/qa/`. Do not expose the runner container port directly.

## GitHub configuration

Repository variables: `NETCUP_DEPLOY_ENABLED=true`, `NETCUP_DEPLOY_PATH=/srv/portfolio-demos/playwright-portfolio`, `NETCUP_APP_PATH=/srv/portfolio-demos/playwright_automation`, and `PUBLIC_RUNNER_API_URL` with the HTTPS `/qa-api` URL.

Repository secrets: `NETCUP_HOST`, `NETCUP_USER`, `NETCUP_SSH_KEY`, and `NETCUP_KNOWN_HOSTS`, matching the other public demo repositories.

Every push to `main` runs `Publish Netcup Mirror` when `NETCUP_DEPLOY_ENABLED=true`; it can also be dispatched manually for recovery. The workflow rebuilds the controlled showcase, validates both absolute deployment paths, synchronizes the static site and minimal runner bundle, recreates the Compose services, and checks the private health endpoint.

The Pages and Netcup builds both read `PUBLIC_RUNNER_API_URL`, such as `https://portfolio-hdh.duckdns.org/qa-api`. The frontend remains disabled when the variable is absent.

## Runner controls

- One concurrent run and five-minute global cooldown.
- Ten accepted requests per source IP per hour, enough to exercise all five destinations while limiting abuse.
- Three-minute quick-suite timeout and ten-minute full-regression timeout.
- Maximum 20 runs and 24-hour retention.
- 1 GiB memory, 1.5 CPU, 256 process limit, dropped capabilities, read-only root filesystem.
- Only `npm run public-site`; the selected identifier maps to one fixed spec and never becomes a command or URL.
- Two Playwright workers by default, bounding browser process usage while retaining parallel execution.
- CORS restricted to the GitHub Pages site and the Netcup mirror by default.

Override cooldown, timeout, retention, run count, and `SHOWCASE_WORKERS` with the Compose environment variables documented in `compose.yml`. Keep the defaults for an internet-facing demo unless monitoring shows a reason to reduce them.

Never place `.env`, storage state, private traces, server logs, SSH keys, or CI credentials below the public deployment directory.
