# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A small React + TypeScript + Vite + Tailwind v4 web app that helps solve cryptogram (letter substitution) puzzles. Live at https://solvemy.codes. The user enters a cipher and an optional clue, then types letters to assign substitutes.

## Commands

- `npm run dev` — dev server
- `npm run build` — type-check (`tsc -b`) then build to `dist/`
- `npm run lint` — ESLint
- `npm run preview` — serve the built `dist/`

There is no test suite.

## Architecture

- `App` switches between two modes: `GameSetup` (edit the puzzle) and `Game` (solve it). The current `Puzzle` (`{ cipher, clues }`, see `src/types.ts`) is saved in localStorage under the key `puzzle` via `useLocalStorage`. Solving progress (the key) is not saved; it resets to the clues on reload or on Reset.
- `Game` wires two hooks together:
  - `usePuzzleKey` (`src/hooks/puzzle-key.ts`) holds the substitution map (cipher letter → guessed letter) and computes `duplicateKeys` — cipher letters that map to the same guess, which `PuzzleKey` highlights in red.
  - `useGameInput` (`src/hooks/game-input.ts`) listens for `keydown` on `window`. It is a two-step state machine: the first letter typed (or clicked in `PuzzleKey`) selects a cipher letter (`settingLetter`); the next letter sets its substitute, and Space/Escape clears it.
- Rendering: `Board` splits the cipher on spaces into `Word`s, and each `Word` renders a `Pair` per character (cipher letter above, guess below). Non-letters pass through unchanged.
- Only lowercase `a`–`z` count as letters (`src/letters.ts`). Inputs are shown uppercase with CSS only.
- `Stack`, `Letter`, `Button`, `IfElse` are tiny layout/UI helpers; styling is Tailwind classes inline.

## Deploy

- **Workflow:** `.github/workflows/deploy.yaml` runs on push to `main` and by hand. It builds, then runs `wrangler deploy` through `cloudflare/wrangler-action`. Any commit to `main` goes live, except pushes that touch only `openspec/**`, `.claude/**`, `README.md`, or `CLAUDE.md` (`paths-ignore`). Deploys queue; they never overlap.
- **Hosting:** a Cloudflare Worker with static assets, configured in `wrangler.jsonc` (no script; `assets.directory` is `./dist`). Each deploy replaces the whole site at once. Wrangler's version is pinned in `deploy.yaml`, not in `package.json`; deploy by hand with `npx wrangler@<that version> deploy` after `npm run build`.
- **Domain:** for now the Worker serves only its `workers.dev` URL (`workers_dev: true`, no `routes`); `solvemy.codes` is still on the old VPS until the cutover.
- **Environment `production`** (only `main` may deploy):
  - secret: `CLOUDFLARE_API_TOKEN` (limited to the account and the `solvemy.codes` zone: Workers Scripts Edit, Workers Routes Edit)
  - variable: `CLOUDFLARE_ACCOUNT_ID`
- **Rehearsal:** `npx wrangler@<pinned> deploy --dry-run` after a build reads the config and lists the assets without uploading.
- **Rollback:** revert the commit on `main`; the push redeploys. For an instant rollback, roll back in the Cloudflare dashboard (or `wrangler rollback`), then still revert on `main`.

## OpenSpec

The repo uses OpenSpec (`openspec/`, spec-driven schema) for planning changes. Use the `openspec-*` / `opsx:*` skills to propose, apply, and archive changes.
