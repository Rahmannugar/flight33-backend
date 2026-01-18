# ---------- Build stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src

RUN pnpm build


# ---------- Runtime stage ----------
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

# Enable pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]
