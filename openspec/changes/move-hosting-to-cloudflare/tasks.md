# Tasks

Pushing branches, opening and merging PRs, and running workflows all reach GitHub. Each needs the user's go-ahead at the time. Cloudflare, registrar, and VPS changes are made by the user. Secret values never pass through the agent.

## 1. Deploy to workers.dev

- [x] 1.1 Add `wrangler.jsonc` as in design Decision 3, before-cutover form: `name: "solvemycodes"`, `compatibility_date`, `assets.directory: "./dist"`, `workers_dev: true`, `preview_urls: false`, no `routes`. Add `/.wrangler` to `.gitignore`. Verify with `npm run build` and then `npx wrangler@4.156.2 deploy --dry-run`, which reads the config and lists the assets without uploading.
- [x] 1.2 Rewrite `.github/workflows/deploy.yaml` as in design Decision 4:
  - keep checkout, Node 23 setup, `npm ci`, `npm run build`
  - replace the `lftp` install and FTPS script with `cloudflare/wrangler-action@v4` (`command: deploy`, `wranglerVersion: 4.156.2`, token secret, account ID variable)
  - add `paths-ignore`, `concurrency` (no cancel), `permissions: contents: read`, `timeout-minutes`
  - add `environment: { name: production, url: https://solvemy.codes }` (design Decision 5)

  Verify that `actionlint` (run via `go run` or Docker, not installed into the repo) reports no errors, and that `ftp`/`lftp` appear nowhere in the workflow.
- [x] 1.3 Update `CLAUDE.md` (Deploy section) and add a short "Deploy" section to the README:
  - the site deploys to a Cloudflare Worker with `wrangler deploy`, configured in `wrangler.jsonc`
  - the `production` environment (only `main`) holds `CLOUDFLARE_API_TOKEN` (secret) and `CLOUDFLARE_ACCOUNT_ID` (variable)
  - docs-only pushes don't deploy
  - rehearsal is `wrangler deploy --dry-run`; rollback is a revert, or a Cloudflare rollback followed by a revert

  Verify that the names in the docs match `deploy.yaml` and `wrangler.jsonc`.
- [x] 1.4 With approval, create the `production` environment with `gh api` (design Decision 5): deployment branch policy allowing only `main`. Verify with `gh api repos/{owner}/{repo}/environments/production` that it exists with a custom branch policy, and that `.../deployment-branch-policies` lists only `main`.
- [x] 1.5 The user creates the API token (design Decision 5) and sets `CLOUDFLARE_API_TOKEN` (secret) and `CLOUDFLARE_ACCOUNT_ID` (variable) on `production`. Verify that `gh secret list --env production` and `gh variable list --env production` show both names.
- [x] 1.6 With approval, push a branch and open a PR, then merge with approval. Verify the push runs the deploy job successfully and that the `workers.dev` URL loads the app, accepts a cipher in setup, and assigns letters by keyboard.

## 2. Move DNS to Cloudflare

- [x] 2.1 The user confirms nothing sends mail as `solvemy.codes` (the current SPF includes `sendmetric.com`; see design Risks). Verify `dig +short DS solvemy.codes` still returns nothing.
- [x] 2.2 The user adds `solvemy.codes` to Cloudflare and reviews the imported records:
  - keep the root A record to `38.111.114.25`, DNS-only (grey cloud)
  - delete everything else, including the `www` CNAME, MX, SPF, and DMARC
  - add the mail records and `www` placeholder from design Decision 6
  - turn on "Always Use HTTPS"
- [x] 2.3 The user switches nameservers at the registrar to the two Cloudflare gives. Verify that `dig +short NS solvemy.codes` returns Cloudflare's nameservers, the dashboard shows the zone as active, and `https://solvemy.codes` still loads from the VPS.

## 3. Cut over

- [ ] 3.1 The user adds Workers Routes Edit on the `solvemy.codes` zone to the API token. Change `wrangler.jsonc` to the cutover form (design Decision 3): add `routes: [{ "pattern": "solvemy.codes", "custom_domain": true }]`, set `workers_dev: false`. Update `CLAUDE.md` and README if they mention `workers.dev`. Verify `npx wrangler@4.156.2 deploy --dry-run` accepts the config. With approval, open a PR.
- [ ] 3.2 Cutover, with the user:
  1. The user deletes the root A record in Cloudflare.
  2. Merge the cutover PR at once (with approval).
  3. Verify the deploy job succeeds and the Worker's settings list `solvemy.codes` as a custom domain.
  4. Verify `https://solvemy.codes` serves the app with a valid certificate, and `curl -sI http://solvemy.codes` redirects to HTTPS.
  5. Verify a saved puzzle in a browser that used the site before the cutover is still there.
  6. Verify the `workers.dev` URL no longer serves the app.
- [ ] 3.3 The user adds the `www` Redirect Rule (design Decision 6). Verify that `curl -sI https://www.solvemy.codes/x?y=1` returns 301 with `location: https://solvemy.codes/x?y=1`.

## 4. Clean up

- [ ] 4.1 The user deletes the `FTP_HOST`, `FTP_USER`, `FTP_PASS`, and `FTP_PORT` repo secrets. Verify `gh secret list` shows no repo secrets, and `gh secret list --env production` still shows `CLOUDFLARE_API_TOKEN`.
- [ ] 4.2 The user removes `solvemy.codes` from the VPS's DNS and web server config. Verify that `https://solvemy.codes` still loads and `dig +short solvemy.codes` returns Cloudflare addresses, not `38.111.114.25`.

## Workflow follow-up

- Archive this change once the cutover and cleanup are done.
