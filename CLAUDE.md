# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A small web app that helps solve cryptogram (letter substitution) puzzles: React 19, TypeScript 6, Vite 8, Tailwind 4, ESLint 10, Vitest 5, Playwright. Live at https://solvemy.codes. The user enters a cipher and an optional clue, then types letters to set a guess for each cipher letter.

Domain terms (puzzle, cipher, clue, guess, puzzle key, setup, solving, …) are defined in `GLOSSARY.md`. Use them in code, specs, tests, and docs.

## Commands

Use npm (`package-lock.json`); the Node version is pinned in `.nvmrc`.

- `npm run dev` — dev server on http://localhost:5173 (`strictPort`)
- `npm run build` — type-check (`tsc -b`, which also checks `e2e/` and `playwright.config.ts`) then build to `dist/`
- `npm run lint` — ESLint
- `npm run preview` — serve the built `dist/` on :5173
- `npm test` — Vitest (watch mode in a terminal); `npx vitest run` runs once
- `npx vitest run src/key.test.ts` — one unit test file; add `-t "name"` to filter
- `npm run test:e2e` — Playwright suite (Chromium) on this machine; starts the dev server itself or reuses one already on :5173. The visual tests skip here (see Tests)
- `npm run test:e2e:docker` — the whole suite, visual tests included, in the Playwright Docker image that CI uses. Pass Playwright args after `--`
- `npx playwright test e2e/letter-assignment.spec.ts` — one e2e spec; add `-g "test name"` to filter
- `npm run test:e2e:docker -- --update-snapshots` — regenerate visual baselines. Only for an intended visual change or a confirmed environment-only diff (new image version); look at the new PNGs and say why in the commit.

## Tests

- **Unit** (`src/**/*.test.ts`): pure functions only — `src/puzzle-key.ts` (`findDuplicateGuesses`, `withGuess`, `withoutGuess`) and `src/letters.ts`. They import from `vitest` and run in the `node` environment. Keep logic worth unit-testing in pure modules like `src/puzzle-key.ts`, not inside hooks.
- **E2E** (`e2e/*.spec.ts`): one spec per capability in `openspec/specs/`, plus `visual.spec.ts` (screenshots in `e2e/visual.spec.ts-snapshots/`). Baselines come from the `mcr.microsoft.com/playwright:v<version>-noble` image, whose fonts differ from a desktop Linux, so `visual.spec.ts` skips unless it runs in that image (`PLAYWRIGHT_BROWSERS_PATH=/ms-playwright`). That image's sans font has no bold, so the baselines show the bold letters as regular; they still lock colors, layout, and spacing. `@playwright/test` is pinned to an exact version: the image tag in `ci.yml` and the `test:e2e:docker` script must match it, so bump all three together. Screenshots compare with a per-pixel `threshold` of 0.05 (`playwright.config.ts`); the default 0.2 can't tell `gray-200` from white.
- DOM hooks for tests: `data-testid="board"`, `data-pair` on each pair (with `data-testid="cipher"` / `"guess"` on its boxes), `data-testid="puzzle-key-panel"` on the puzzle key panel's grid, and `data-puzzle-key-entry="<letter>"` on each puzzle key entry. Keep them when refactoring.
- `e2e/helpers.ts` seeds `localStorage.puzzle` before load (`open(page, puzzle)`, `solve(page, puzzle)` also clicks Done), types through `window` (`type`, `press` blur first so a focused button doesn't also take the key), and reads the text and colors of pairs and puzzle key entries. DOM text is lowercase (uppercase is CSS). Expected colors come from `themeColor`, which resolves Tailwind's `--color-*` variables, so don't hard-code `oklch` values.
- `e2e/fixtures/saved-puzzle-882117f.json` is a real save from before tests existed; never regenerate it. `e2e/capture-fixture.ts` (`node e2e/capture-fixture.ts <url> <out>`, with the dev server running) exists only to capture fixtures for future formats.

## Architecture

- `App` switches between two modes: `Setup` (edit the puzzle) and `Solving` (solve it). The current `Puzzle` (`{ cipher, clues }`, see `src/types.ts`) is saved in localStorage under the key `puzzle` via `useLocalStorage`. Solving progress (the puzzle key) is not saved; it resets to the clues on reload or on Reset.
- `Solving` wires two hooks together:
  - `usePuzzleKey` (`src/hooks/puzzle-key.ts`) holds the puzzle key (cipher letter → guess) and computes `duplicateGuesses`: the cipher letters that share a guess, which `PuzzleKeyPanel` highlights in red. The puzzle key transforms and duplicate detection are pure functions in `src/puzzle-key.ts`.
  - `useSolvingInput` (`src/hooks/solving-input.ts`) listens for `keydown` on `window`. It is a two-step state machine: the first letter typed (or clicked in `PuzzleKeyPanel`) selects a cipher letter (`selectedLetter`); the next letter sets its guess, and Space/Escape clears it.
- Rendering: `Board` splits the cipher on spaces into `Word`s, and each `Word` renders a `Pair` per character (cipher letter above, guess below). Non-letters pass through unchanged.
- Only lowercase `a`–`z` count as letters (`src/letters.ts`). Inputs are shown uppercase with CSS only.
- `Stack`, `Letter`, `Button`, `IfElse` are tiny layout/UI helpers; styling is Tailwind classes inline.
- `src/index.css` pins Tailwind 4.1's `--font-sans` stack. Tailwind 4.3 changed the default to one that renders a different font on Linux; the visual baselines lock the old look in. Don't remove it without checking the visual suite.

## Version holds

- **TypeScript stays on 6.0** (`~6.0.x`): `typescript-eslint` supports only TypeScript `<6.1.0`. Move to 7 when it does.

## CI and deploy

- **CI:** `.github/workflows/ci.yml` runs on every pull request and is also called by the deploy workflow. It runs inside the Playwright Docker image (Chromium and its libraries preinstalled, and the image the baselines come from), then `npm ci`, `npx vitest run`, `npm run lint`, `npm run build`, and `npm run test:e2e`, and uploads `dist/` as the `dist` artifact (and the Playwright report on failure). Node comes from `.nvmrc`.
- **Deploy:** `.github/workflows/deploy.yaml` runs on push to `main` and by hand. It runs CI first, then deploys that exact `dist` artifact without rebuilding: the deploy job checks out only `wrangler.jsonc` and runs `wrangler deploy` through `cloudflare/wrangler-action`. A commit whose tests fail doesn't go live. Pushes that touch only `openspec/**`, `.claude/**`, `README.md`, or `CLAUDE.md` don't deploy (`paths-ignore`). Deploys queue; they never overlap.
- **Hosting:** a Cloudflare Worker with static assets, configured in `wrangler.jsonc` (no script; `assets.directory` is `./dist`). Each deploy replaces the whole site at once. Wrangler's version is pinned in `deploy.yaml`, not in `package.json`; deploy by hand with `npx wrangler@<that version> deploy` after `npm run build`.
- **Domain:** `solvemy.codes` is the Worker's custom domain (`routes` in `wrangler.jsonc`), and its DNS is in Cloudflare. `workers_dev` is off and `www` redirects to the root (a Cloudflare Redirect Rule), so the site has one origin: the saved puzzle lives in `localStorage`, which is per origin.
- **Environment `production`** (only `main` may deploy):
  - secret: `CLOUDFLARE_API_TOKEN` (limited to the account and the `solvemy.codes` zone: Workers Scripts Edit, Workers Routes Edit)
  - variable: `CLOUDFLARE_ACCOUNT_ID`
- **Rehearsal:** `npx wrangler@<pinned> deploy --dry-run` after a build reads the config and lists the assets without uploading.
- **Rollback:** revert the commit on `main`; the push redeploys the previous build. For an instant rollback, roll back in the Cloudflare dashboard (or `wrangler rollback`), then still revert on `main`.

## OpenSpec

The repo uses OpenSpec (`openspec/`, spec-driven schema) for planning changes. Use the `openspec-*` / `opsx:*` skills to propose, apply, and archive changes.

After archiving a change, clean up what was made for it and is no longer needed: remove its git worktrees, delete local branches that have been merged into `main`, and delete temporary files (scratch scripts, captured test output, stray `dist/` or `test-results/` from its runs). Check that a branch is merged before deleting it: PRs are squash-merged, so `git branch --merged main` won't list it; check instead that its PR merged at the branch's head commit (`gh pr view <n> --json state,headRefOid`). List what you removed.

A PR that touches only paths in `deploy.yaml`'s `paths-ignore` (`openspec/**`, `.claude/**`, `README.md`, `CLAUDE.md`) can't deploy, so you may merge it yourself (squash) once its CI passes, without asking. Any PR that touches anything else needs the user to merge it or say to.
