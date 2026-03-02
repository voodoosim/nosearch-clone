#!/bin/sh
set -e

# DB 스키마 동기화
npx prisma db push --skip-generate 2>/dev/null || echo "prisma db push skipped"

exec node server.js
