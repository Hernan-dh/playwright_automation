# Public Netcup mirror

Netcup is an optional public mirror of the same static `dist` directory deployed to GitHub Pages. It does not run tests, store credentials in the web root, or expose private evidence.

## Server setup

1. Create a dedicated unprivileged deployment user and `/var/www/playwright-portfolio` owned by that user.
2. Point a public subdomain to the server and terminate HTTPS with the server's existing reverse proxy or certificate automation.
3. Run `docker compose -f deploy/netcup/compose.yml up -d` from a checkout on the server. Nginx listens only on loopback port `8080`; proxy the public HTTPS virtual host to it.
4. Keep the firewall, operating system, Docker, and reverse proxy patched.

## GitHub configuration

Repository variables: `NETCUP_DEPLOY_ENABLED=true`, `NETCUP_HOST`, `NETCUP_USER`, and `NETCUP_DEPLOY_PATH=/var/www/playwright-portfolio`.

Repository secrets: `NETCUP_SSH_KEY` for the dedicated deployment user and `NETCUP_KNOWN_HOSTS` containing the pinned server host-key entry from a trusted server-side source.

Run `Publish Netcup Mirror` manually. It rebuilds the controlled showcase, rejects an empty or root deployment path, and synchronizes only `dist/`.

Never place `.env`, storage state, private traces, server logs, SSH keys, or CI credentials below the public deployment directory.
