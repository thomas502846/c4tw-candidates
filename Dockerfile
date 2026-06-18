# c4twweb production Dockerfile — Next.js standalone 多階段建置
# 需要 next.config.ts 設 `output: 'standalone'`（已設）。
# 注意：Payload 頁面在 next build 時會連 DB 預先渲染，build 需可連到 DATABASE_URI，
# 且 DB 必須已有 schema —— 所以 migrate 用獨立的 migrator stage（不跑 next build），
# 順序必為：build/run migrate → build app。target: builder 會有雞生蛋問題（build 需要表，表需要 migrate）。

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@10
WORKDIR /app

# ---------- deps：只裝依賴（lockfile 沒變就吃 cache） ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- migrator：migrate/seed 用（含依賴與原始碼，不跑 next build） ----------
FROM base AS migrator
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ---------- builder：next build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# build 時需要的環境變數（由 docker compose build args 傳入）
ARG DATABASE_URI
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG NOINDEX
# NEXT_PUBLIC_* 必須在 build 階段就存在才會 inline 進前端 bundle。
# 聯絡頁地圖：有 key 走官方 Embed API；缺 key 會退回 output=embed（已被 Google 擋，ERR_BLOCKED_BY_RESPONSE）。
ARG NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY
ENV DATABASE_URI=${DATABASE_URI} \
    PAYLOAD_SECRET=${PAYLOAD_SECRET} \
    NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL} \
    NOINDEX=${NOINDEX} \
    NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY} \
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# ---------- runner：standalone 最小執行映像 ----------
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# public 含 postbuild 產生的 sitemap / robots.txt
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
