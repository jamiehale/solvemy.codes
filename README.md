# solve my . codes

[https://solvemy.codes](https://solvemy.codes)

This is a quick little tool to help me solve cryptogram-style puzzles. Use the keyboard. Type a letter to set it's substitute. ESC or SPACE to clear a letter.

## Building

```
npm install
npm run build
```

## Developing

Use the Node version in `.nvmrc`.

```
npm run dev        # dev server on http://localhost:5173
npm test           # unit tests (Vitest)
npm run test:e2e   # browser tests (Playwright); run `npx playwright install chromium` once first
npm run lint
```

## Deploy

Every pull request runs the CI workflow (unit tests, lint, build, browser tests). Every push to `main` (except one that only changes `openspec/`, `.claude/`, `README.md`, or `CLAUDE.md`) runs CI, then deploys CI's build to a Cloudflare Worker (static assets, configured in `wrangler.jsonc`) with `wrangler deploy`. The deploy uses the `production` environment, which holds the `CLOUDFLARE_API_TOKEN` secret and the `CLOUDFLARE_ACCOUNT_ID` variable. To roll back, revert the commit on `main`.
