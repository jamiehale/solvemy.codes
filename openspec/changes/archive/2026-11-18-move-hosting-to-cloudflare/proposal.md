# Proposal

## Why

solvemy.codes is served from the same VPS as soduko.me, and that VPS also runs DNS for the domain. The VPS is going away, so the site needs a new host and new DNS. The site is fully static, and soduko.me has already moved to Cloudflare. Doing the same here keeps both sites in one account, set up the same way.

## What Changes

- **DNS:** the `solvemy.codes` zone moves from the VPS (`dns1/dns2.dotcanada.com`) to the owner's Cloudflare account. Only the records the site needs are kept. The leftover records (the MX pointing at the root, the SPF that allows the VPS and `sendmetric.com`, the `p=none` DMARC) are replaced, since the domain has no email.
- **Anti-spoofing records:** a null MX, SPF `-all`, and DMARC `p=reject`.
- **Hosting:** the `dist/` output is served by a Cloudflare Worker with static assets, on the custom domain `solvemy.codes`. A small `wrangler.jsonc` at the repo root describes it.
- **`www`:** `www.solvemy.codes` redirects to `https://solvemy.codes`, so the site has one origin and the saved puzzle (in `localStorage`, scoped per origin) stays in one place.
- **Deploy workflow:** `.github/workflows/deploy.yaml` still builds on push to `main`, but deploys with `wrangler deploy` instead of `lftp` over FTPS. It also gains `paths-ignore` for docs-only pushes and a queue so deploys never overlap.
- **Secrets:** the repo's `FTP_HOST`, `FTP_USER`, `FTP_PASS`, and `FTP_PORT` secrets are replaced by `CLOUDFLARE_API_TOKEN` (secret) and `CLOUDFLARE_ACCOUNT_ID` (variable) on a new `production` environment that only `main` can deploy to. The deploy job targets that environment, as soduko's does.
- **Docs:** `CLAUDE.md` and the README describe the new hosting, deploy, and rollback.

## Capabilities

### New Capabilities
_None._ Users see the same app at the same address. Only hosting and deploy tooling change, so the change sets `skip_specs: true`.

### Modified Capabilities
_None._

## Impact

- **New:** `wrangler.jsonc`.
- **Changed:** `.github/workflows/deploy.yaml`, `.gitignore`, `CLAUDE.md`, `README.md`.
- **Outside the repo (done by the owner):**
  - the Cloudflare zone and its records
  - the nameserver change at the registrar
  - the API token
  - the `production` environment (created by the agent with approval) and its secret and variable values
  - removing `solvemy.codes` from the VPS
- **Users:** the address stays `https://solvemy.codes`, so saved puzzles survive. The cutover may cause a gap of about a minute while the domain moves from the VPS to the Worker.
- **Not affected:** app code and the build.
