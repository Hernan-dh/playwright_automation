FROM mcr.microsoft.com/playwright:v1.58.0-noble
WORKDIR /work
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "test:smoke"]
