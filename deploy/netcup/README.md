# Public Netcup mirror

Netcup is an optional public mirror of the same static `dist` directory deployed to GitHub Pages. It also runs the fixed public showcase behind a rate-limited API. The runner has no secrets, accepts no test parameters, and exposes only controlled reports.

## Server setup

1. Create a dedicated deployment user with Docker access and two directories it owns: `/var/www/playwright-portfolio` for public files and `/opt/playwright-runner` for the controlled application bundle.
2. Point a public subdomain to the server and terminate HTTPS with the server's existing reverse proxy or certificate automation.
3. The deployment workflow builds and starts Compose from the application directory. Nginx listens only on loopback port `8080`; the API is reachable only through that proxy.
4. Keep the firewall, operating system, Docker, and reverse proxy patched.

The public reverse proxy must forward `/qa-api/*` and `/qa-runs/*` to `127.0.0.1:8080` while preserving the path. Do not expose the runner container port directly.

## GitHub configuration

Repository variables: `NETCUP_DEPLOY_ENABLED=true`, `NETCUP_HOST`, `NETCUP_USER`, `NETCUP_DEPLOY_PATH=/var/www/playwright-portfolio`, `NETCUP_APP_PATH=/opt/playwright-runner`, and `PUBLIC_RUNNER_API_URL` with the HTTPS `/qa-api` URL.

Repository secrets: `NETCUP_SSH_KEY` for the dedicated deployment user and `NETCUP_KNOWN_HOSTS` containing the pinned server host-key entry from a trusted server-side source.

Run `Publish Netcup Mirror` manually. It rebuilds the controlled showcase, validates both absolute deployment paths, synchronizes the static site and minimal runner bundle, recreates the Compose services, and checks the private health endpoint.

The Pages and Netcup builds both read `PUBLIC_RUNNER_API_URL`, such as `https://portfolio-hdh.duckdns.org/qa-api`. The frontend remains disabled when the variable is absent.

## Runner controls

- One concurrent run and five-minute global cooldown.
- Three accepted requests per source IP per hour.
- Two-minute execution timeout.
- Maximum 20 runs and 24-hour retention.
- 1 GiB memory, 1.5 CPU, 256 process limit, dropped capabilities, read-only root filesystem.
- Only `npm run showcase`; no request field influences the command.
- Two Playwright workers by default, bounding browser process usage while retaining parallel execution.

Override cooldown, timeout, retention, run count, and `SHOWCASE_WORKERS` with the Compose environment variables documented in `compose.yml`. Keep the defaults for an internet-facing demo unless monitoring shows a reason to reduce them.

Never place `.env`, storage state, private traces, server logs, SSH keys, or CI credentials below the public deployment directory.
