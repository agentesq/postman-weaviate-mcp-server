FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app .

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "mcpServer.js", "--sse"]