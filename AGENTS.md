<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# E2E Tests

Run: `npx playwright test`
The config auto-builds (`npm run build && npx next start`) because Turbopack dev mode crashes under parallel Playwright load (RSC manifest bug).

## DB setup
- `.env.local` must point to `prisma/test.db` (not `dev.db`)
- Test fixtures seed `tests/fixtures/seed.ts` runs in `beforeAll`
- If you need to seed manually: `npx prisma db push && npx tsx tests/fixtures/seed.ts`

## Common failures
1. **`net::ERR_ABORTED`**: Stale dev server on port 3000 — kill it with `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess`
2. **Login stays on `/admin/login?`**: Wrong database — ensure `.env.local` points to the same DB the seed writes to
3. **`Could not find the module in the React Client Manifest`**: Turbopack bug in dev mode — use production server (`next start`)
