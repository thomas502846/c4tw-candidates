#!/usr/bin/env bash
# c4twweb 部署腳本：rsync 原始碼到 Lightsail → server 上 docker compose build/up → migrate
#
# 用法：
#   bash deploy/deploy.sh                 # 預設 52.78.36.24 + ~/.ssh/c4twweb-lightsail.pem
#   bash deploy/deploy.sh <host> [key]    # 指定 host / key
#   HOST=1.2.3.4 KEY=~/.ssh/other.pem bash deploy/deploy.sh
#
# 前提（首次部署見 docs/infra/DEPLOY_RUNBOOK_20260612.md）：
#   - server 已裝 docker + docker compose plugin，ubuntu 在 docker group
#   - server 端 ~/c4twweb/.env.production 已存在（由 .env.production.example 複製填值）
#   - src/migrations/ 已有 migration 檔（pnpm payload migrate:create）

set -euo pipefail

HOST="${1:-${HOST:-52.78.36.24}}"
KEY="${2:-${KEY:-$HOME/.ssh/c4twweb-lightsail.pem}}"
REMOTE_USER="${REMOTE_USER:-ubuntu}"
REMOTE_DIR="${REMOTE_DIR:-/home/ubuntu/c4twweb}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_OPTS=(-i "$KEY" -o StrictHostKeyChecking=accept-new)

echo "==> [1/3] rsync ${REPO_ROOT}/ -> ${REMOTE_USER}@${HOST}:${REMOTE_DIR}/"
rsync -az --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.next' \
  --exclude 'docs' \
  --exclude 'pkb' \
  --exclude 'archive' \
  --exclude 'content-assets' \
  --exclude 'e2e' \
  --exclude 'test-results' \
  --exclude 'playwright-report' \
  --exclude '.env' \
  --exclude '.env.production' \
  --exclude '.env.local' \
  --exclude 'tsconfig.tsbuildinfo' \
  -e "ssh ${SSH_OPTS[*]}" \
  "${REPO_ROOT}/" "${REMOTE_USER}@${HOST}:${REMOTE_DIR}/"

echo "==> [2/3] payload migrate（server 端，一次性容器；必須在 build app 之前——app build 的 prerender 需要 DB 已有 schema）"
ssh "${SSH_OPTS[@]}" "${REMOTE_USER}@${HOST}" bash -s <<EOF
set -euo pipefail
cd "${REMOTE_DIR}"
if [ ! -f .env.production ]; then
  echo "ERROR: ${REMOTE_DIR}/.env.production 不存在。先 cp .env.production.example .env.production 並填值。" >&2
  exit 1
fi
docker compose --env-file .env.production build migrate
docker compose --env-file .env.production run --rm migrate
EOF

echo "==> [3/3] docker compose build + up -d（server 端）"
ssh "${SSH_OPTS[@]}" "${REMOTE_USER}@${HOST}" \
  "cd '${REMOTE_DIR}' && docker compose --env-file .env.production build app && docker compose --env-file .env.production up -d"

echo "==> 完成。驗證："
echo "    curl -sI http://${HOST}/ | head -5"
echo "    curl -sI https://staging.carefortaiwan.com.tw/ | grep -i x-robots-tag   # DNS 生效後"
