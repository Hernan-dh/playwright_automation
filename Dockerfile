FROM mcr.microsoft.com/playwright:v1.64.1-noble
WORKDIR /work
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "test:smoke"]
