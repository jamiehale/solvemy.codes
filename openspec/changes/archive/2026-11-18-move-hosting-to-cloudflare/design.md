# Design

## Context

See proposal.md for why. This follows the soduko.me move (`../soduko`, archived change `2026-11-18-move-hosting-to-cloudflare`). Where this repo differs:

- **Build:** `npm run build` runs `tsc -b`, then writes `dist/`: `index.html`, hashed bundles in `assets/`, and `public/smc.svg`. No client-side router, no service worker, Vite base `/`.
- **Deploy:** there is no CI workflow and no tests. `.github/workflows/deploy.yaml` is one job: on push to `main` (or by hand) it checks out, sets up Node 23, runs `npm ci` and `npm run build`, then mirrors `dist/` over FTPS with `lftp` (`assets/` with `--delete`, the root without). There is no `paths-ignore`, no concurrency, no GitHub environment, and no `permissions` block.
- **Secrets:** repo-level `FTP_HOST`, `FTP_USER`, `FTP_PASS`, `FTP_PORT`. No variables, no environments yet.
- **DNS (checked 2026-11-18):** nameservers `dns1/dns2.dotcanada.com`. A `38.111.114.25` (the same VPS as soduko.me), `www` CNAME to the root, MX `0 solvemy.codes.`, SPF `v=spf1 +mx +a +ip4:38.111.114.25 +include:sendmetric.com ~all`, DMARC `p=none`. No DS record, so DNSSEC is off at the registrar.
- **Saved puzzle** lives in `localStorage` under `puzzle`, scoped to `https://solvemy.codes`. Today `www` serves the site too, so a user on `www` has a separate saved puzzle.

## Goals / Non-Goals

**Goals:**
- Users keep using `https://solvemy.codes` with their saved puzzle intact.
- The new host can be tested before the domain moves.
- Hosting config lives in the repo, set up the same way as soduko.me.

**Non-Goals:**
- Adding a CI workflow, tests, or a lint step to deploys.
- Preview deploys for pull requests.
- Custom cache headers (`_headers`).
- Upgrading Node 23 in the workflow. Wrangler 4 runs on it.
- DNSSEC. soduko.me skipped it for the same reasons: HTTPS already protects users and the site has no accounts.
- Keeping `www` users' saved puzzles. After the redirect they see the root's saved puzzle (or the default).

## Decisions

**1. DNS moves to Cloudflare.** Same reasons as soduko.me: a Worker custom domain on the root domain needs Cloudflare to run the zone, and it keeps both sites in one account.

**2. Host on a Cloudflare Worker with static assets only.** No script, `assets.directory: "./dist"`. Static asset requests are free. Each deploy swaps the whole site at once.
- *Alternative:* Cloudflare Pages. Rejected: Cloudflare steers new projects to Workers static assets, and soduko.me already uses Workers.

**3. `wrangler.jsonc` at the repo root.**
- `name: "solvemycodes"`, `compatibility_date: "2026-11-01"` (matches soduko), `assets: { directory: "./dist" }`, `preview_urls: false`.
- `not_found_handling` stays at its default (404). The app has no routes.
- **Before cutover:** `workers_dev: true`, no `routes`. Deploys go only to `solvemycodes.<account-subdomain>.workers.dev`.
- **At cutover:** add `routes: [{ "pattern": "solvemy.codes", "custom_domain": true }]` and set `workers_dev: false`, so there is one origin.
- `.gitignore` gains `/.wrangler`, which wrangler creates on local runs.

**4. The deploy job keeps building, then runs `cloudflare/wrangler-action`.**
- **Steps:** checkout, setup Node 23 with npm cache, `npm ci`, `npm run build`, then `cloudflare/wrangler-action@v4` with `command: deploy`, `wranglerVersion: 4.156.2` (same as soduko), `apiToken: secrets.CLOUDFLARE_API_TOKEN`, `accountId: vars.CLOUDFLARE_ACCOUNT_ID`.
- **Added (as in soduko):**
  - `environment: production` with its URL (Decision 5).
  - `paths-ignore` for `openspec/**`, `.claude/**`, `README.md`, `CLAUDE.md`, so planning and docs commits don't redeploy.
  - `concurrency: { group: deploy-production, cancel-in-progress: false }`, so deploys queue and never abort mid-upload.
  - `permissions: contents: read` and a `timeout-minutes`.
- **Removed:** the `lftp` install and the FTPS script.
- Wrangler is not added to `package.json`. A deploy by hand uses `npx wrangler@4.156.2 deploy` after `npm run build`.
- *Alternative:* split out a `ci.yml` and deploy its artifact, as soduko does. Rejected: there are no tests to gate on, so it adds a job and an artifact hop for nothing. Easy to add when tests exist.

**5. Credentials live on a `production` environment.**
- A new GitHub environment `production`, with a deployment branch policy that allows only `main`. The deploy job sets `environment: { name: production, url: https://solvemy.codes }`.
- `CLOUDFLARE_API_TOKEN` is an environment secret: a custom token limited to the owner's account and the `solvemy.codes` zone, with Workers Scripts Edit (account) and Workers Routes Edit (zone). A new token, not soduko's, so each repo's token touches only its own zone. The zone doesn't exist until task 2.2, so the token starts with Workers Scripts Edit only and gains Workers Routes Edit on the zone before cutover.
- `CLOUDFLARE_ACCOUNT_ID` is an environment variable.
- The agent creates the environment with `gh api` (with approval). The owner enters both values. The FTP repo secrets are deleted once the cutover is confirmed.
- *Why not repo-level:* `workflow_dispatch` runs from any branch, and repo secrets reach every branch. A branch with a changed workflow could deploy it or read the token. The environment keeps the token on `main`, and GitHub logs each deploy with its URL.

**6. Records outside the Worker are set by hand in the Cloudflare dashboard.** Same as soduko.me:
- **Root:** managed by the Worker custom domain. Before cutover, the imported A record to the VPS stays, DNS-only.
- **`www`:** replace the CNAME with a proxied placeholder (`AAAA 100::`) and a Redirect Rule sending `www.solvemy.codes/*` to `https://solvemy.codes/${path}` with a 301, keeping the query string ("Redirect from WWW to root" template).
- **Mail:** null MX (`MX 0 .`), TXT `v=spf1 -all` on the root, TXT `v=DMARC1; p=reject` on `_dmarc`. These replace the imported MX, SPF, and DMARC.
- **Removed:** every other imported record.
- **SSL/TLS:** "Always Use HTTPS" on.

**7. Rehearsal and rollback.**
- **Rehearsal:** the first deploy goes to `workers.dev` while the VPS still serves `solvemy.codes`. Locally, `npx wrangler@4.156.2 deploy --dry-run` after a build checks the config without uploading.
- **Rollback:** revert the commit on `main`; the push redeploys. For speed, roll back in the Cloudflare dashboard (or `wrangler rollback`), then still revert on `main`.

## Risks / Trade-offs

- **[A custom domain can't be attached while a DNS record exists for that hostname]** → At cutover, delete the root A record, then merge the cutover PR at once. About a minute of downtime.
- **[The SPF includes `sendmetric.com`, hinting something once sent mail as the domain]** → It looks like a hosting default, and soduko.me had the same VPS setup with no email. The owner confirms nothing sends mail as `solvemy.codes` before the records are replaced.
- **[The VPS root was mirrored without `--delete`, so it may serve stale files not in `dist/`]** → Those stop being served after cutover. Nothing in the app links to them. Accepted.
- **[Merging the workflow change stops deploys to the VPS]** → The VPS keeps serving the last FTPS build until cutover. Avoid merging app changes in between, or accept they show only on `workers.dev`.
- **[A token scoped too narrowly fails the custom-domain attach]** → The deploy fails loudly; widen the token on the zone and re-run.
- **[Nameserver change takes time to spread]** → The imported A record keeps pointing at the VPS until cutover, so both nameserver sets give the same answer.

## Migration Plan

1. **Workflow PR:** add `wrangler.jsonc` (`workers.dev` only), the new deploy job, `.gitignore` entry, and docs.
2. **Setup:** the agent creates the `production` environment; the owner creates the API token and adds the secret and variable to it.
3. **Merge:** check the deploy succeeds and the `workers.dev` URL serves the app.
4. **Move DNS:** add the zone in Cloudflare, prune records, add mail records and the `www` placeholder, switch nameservers at the registrar. Wait for the zone to show as active.
5. **Cutover PR:** add the custom domain route, set `workers_dev: false`.
6. **Cutover:** delete the root A record, merge the cutover PR, check `https://solvemy.codes`. Add the `www` redirect.
7. **Cleanup:** delete the FTP secrets, remove `solvemy.codes` from the VPS.
