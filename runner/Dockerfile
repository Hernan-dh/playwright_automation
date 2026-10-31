FROM mcr.microsoft.com/playwright:v1.64.1-noble
WORKDIR /work
COPY package*.json ./
RUN npm ci
COPY playwright.showcase.config.ts ./
COPY tests/context ./tests/context
COPY tests/network ./tests/network
COPY tests/ui/browser-primitives.spec.ts ./tests/ui/browser-primitives.spec.ts
COPY runner/server.mjs ./runner/server.mjs
RUN mkdir -p /data/runs && chown -R pwuser:pwuser /work /data
USER pwuser
ENV NODE_ENV=production RUNNER_DATA_ROOT=/data/runs
EXPOSE 3000
CMD ["node", "runner/server.mjs"]
