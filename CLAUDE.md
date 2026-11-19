# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A small React + TypeScript + Vite + Tailwind v4 web app that helps solve cryptogram (letter substitution) puzzles. Live at https://solvemy.codes. The user enters a cipher and an optional clue, then types letters to assign substitutes.

## Commands

Use npm (`package-lock.json`); the Node version is pinned in `.nvmrc`.

- `npm run dev` — dev server on http://localhost:5173 (`strictPort`)
- `npm run build` — type-check (`tsc -b`, which also checks `e2e/` and `playwright.config.ts`) then build to `dist/`
- `npm run lint` — ESLint
- `npm run preview` — serve the built `dist/` on :5173
- `npm test` — Vitest (watch mode in a terminal); `npx vitest run` runs once
- `npx vitest run src/key.test.ts` — one unit test file; add `-t "name"` to filter
- `npm run test:e2e` — Playwright behavior + visual suite (Chromium); starts the dev server itself or reuses one already on :5173
- `npx playwright test e2e/letter-assignment.spec.ts` — one e2e spec; add `-g "test name"` to filter
- `npx playwright test --update-snapshots` — regenerate visual baselines. Only for an intended visual change or a confirmed environment-only diff (font/OS update); look at the new PNGs and say why in the commit.

## Tests

- **Unit** (`src/**/*.test.ts`): pure functions only — `src/key.ts` (`findDuplicates`, `withGuess`, `withoutGuess`) and `src/letters.ts`. They import from `vitest` and run in the `node` environment. Keep logic worth unit-testing in pure modules like `src/key.ts`, not inside hooks.
- **E2E** (`e2e/*.spec.ts`): one spec per capability in `openspec/specs/`, plus `visual.spec.ts` (screenshots in `e2e/visual.spec.ts-snapshots/`, Linux/Chromium-specific). Screenshots compare with a per-pixel `threshold` of 0.05 (`playwright.config.ts`); the default 0.2 can't tell `gray-200` from white.
- DOM hooks for tests: `data-testid="board"`, `data-pair` on each pair (with `data-testid="cipher"` / `"guess"` on its boxes), `data-testid="key"` on the key grid, and `data-key="<letter>"` on each key entry. Keep them when refactoring.
- `e2e/helpers.ts` seeds `localStorage.puzzle` before load (`open(page, puzzle)`, `solve(page, puzzle)` also clicks Done), types through `window` (`type`, `press` blur first so a focused button doesn't also take the key), and reads pair/key text and colors. DOM text is lowercase (uppercase is CSS). Expected colors come from `themeColor`, which resolves Tailwind's `--color-*` variables, so don't hard-code `oklch` values.
- `e2e/fixtures/saved-puzzle-882117f.json` is a real save from before tests existed; never regenerate it. `e2e/capture-fixture.ts` (`node e2e/capture-fixture.ts <url> <out>`, with the dev server running) exists only to capture fixtures for future formats.

## Architecture

- `App` switches between two modes: `GameSetup` (edit the puzzle) and `Game` (solve it). The current `Puzzle` (`{ cipher, clues }`, see `src/types.ts`) is saved in localStorage under the key `puzzle` via `useLocalStorage`. Solving progress (the key) is not saved; it resets to the clues on reload or on Reset.
- `Game` wires two hooks together:
  - `usePuzzleKey` (`src/hooks/puzzle-key.ts`) holds the substitution map (cipher letter → guessed letter) and computes `duplicateKeys` — cipher letters that map to the same guess, which `PuzzleKey` highlights in red. The map transforms and duplicate detection are pure functions in `src/key.ts`.
  - `useGameInput` (`src/hooks/game-input.ts`) listens for `keydown` on `window`. It is a two-step state machine: the first letter typed (or clicked in `PuzzleKey`) selects a cipher letter (`settingLetter`); the next letter sets its substitute, and Space/Escape clears it.
- Rendering: `Board` splits the cipher on spaces into `Word`s, and each `Word` renders a `Pair` per character (cipher letter above, guess below). Non-letters pass through unchanged.
- Only lowercase `a`–`z` count as letters (`src/letters.ts`). Inputs are shown uppercase with CSS only.
- `Stack`, `Letter`, `Button`, `IfElse` are tiny layout/UI helpers; styling is Tailwind classes inline.

## Deploy

- **Workflow:** `.github/workflows/deploy.yaml` runs on push to `main` and by hand. It builds, then runs `wrangler deploy` through `cloudflare/wrangler-action`. Any commit to `main` goes live, except pushes that touch only `openspec/**`, `.claude/**`, `README.md`, or `CLAUDE.md` (`paths-ignore`). Deploys queue; they never overlap.
- **Hosting:** a Cloudflare Worker with static assets, configured in `wrangler.jsonc` (no script; `assets.directory` is `./dist`). Each deploy replaces the whole site at once. Wrangler's version is pinned in `deploy.yaml`, not in `package.json`; deploy by hand with `npx wrangler@<that version> deploy` after `npm run build`.
- **Domain:** `solvemy.codes` is the Worker's custom domain (`routes` in `wrangler.jsonc`), and its DNS is in Cloudflare. `workers_dev` is off and `www` redirects to the root (a Cloudflare Redirect Rule), so the site has one origin: the saved puzzle lives in `localStorage`, which is per origin.
- **Environment `production`** (only `main` may deploy):
  - secret: `CLOUDFLARE_API_TOKEN` (limited to the account and the `solvemy.codes` zone: Workers Scripts Edit, Workers Routes Edit)
  - variable: `CLOUDFLARE_ACCOUNT_ID`
- **Rehearsal:** `npx wrangler@<pinned> deploy --dry-run` after a build reads the config and lists the assets without uploading.
- **Rollback:** revert the commit on `main`; the push redeploys. For an instant rollback, roll back in the Cloudflare dashboard (or `wrangler rollback`), then still revert on `main`.

## OpenSpec

The repo uses OpenSpec (`openspec/`, spec-driven schema) for planning changes. Use the `openspec-*` / `opsx:*` skills to propose, apply, and archive changes.
