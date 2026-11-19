# Proposal

## Why

The app has no tests and no specs, so nothing catches a regression. Several dev dependencies are a major behind (Vite 7, `@vitejs/plugin-react` 5, ESLint 9, TypeScript 5, `globals` 16, `eslint-plugin-react-refresh` 0.4), and the deploy workflow builds on Node 23, which is end-of-life. Every push to `main` goes live without any check. The `../soduko` project fixed the same problems with three changes (`add-regression-safety-net`, `migrate-to-vite-vitest`, `upgrade-runtime-libraries`) plus a CI workflow that gates deploys. This change applies the same steps here. It is one change because this stack is already Vite + React 19 + TypeScript, so the upgrade part is small.

## What Changes

- Write down current behavior as specs (below). Change no runtime behavior.
- Pin Node in `.nvmrc` (Node 26, the current Active LTS) and use it in CI.
- Add Vitest unit tests for the pure logic. Move duplicate detection and the key's set/clear transforms out of `usePuzzleKey` into pure functions so they can be tested without a DOM.
- Add Playwright end-to-end tests (Chromium) covering every scenario in the specs, with `data-` attributes as test hooks.
- Add Playwright visual baselines of the setup form, the game, the selected-letter state, duplicates, and the narrow (mobile) layout.
- Add a saved-puzzle fixture captured from the current app and a test that it still loads.
- Upgrade dev tooling, one step per commit, each gated by the full suite: minor/patch bumps; Vite 7 → 8 with `@vitejs/plugin-react` 5 → 6; ESLint 9 → 10 with `@eslint/js` 10, `globals` 17, and `eslint-plugin-react-refresh` 0.5; TypeScript 5.9 → 6.0; `@types/node` → 26.
- Add `.github/workflows/ci.yml` (unit, lint, build, e2e on every pull request). Make `deploy.yaml` call it and deploy CI's build artifact instead of rebuilding. **BREAKING** for the deploy flow only: a push to `main` with a failing test no longer goes live.
- Document the test commands, test hooks, and CI in `CLAUDE.md` and `README.md`.

## Capabilities

### New Capabilities
- `puzzle-setup`: the setup form (cipher, one clue letter and value), entering and leaving edit mode.
- `letter-assignment`: choosing a cipher letter by keyboard or click, setting or clearing its guess, and Reset.
- `board-display`: how the cipher is laid out as words and letter pairs, how guesses and non-letters show, and the page layout.
- `puzzle-key`: the 26-letter key panel, the selected-letter marker, and duplicate highlighting.
- `puzzle-persistence`: saving the puzzle in `localStorage`, the default puzzle, and what is not saved.

### Modified Capabilities
_None. There are no existing specs._

## Impact

- `src/hooks/puzzle-key.ts`: duplicate detection and key transforms become exported pure functions. No behavior change.
- `src/components/*`: `data-` attributes added for tests. No visual change.
- New: `.nvmrc`, `playwright.config.ts`, `e2e/`, `src/**/*.test.ts`, `tsconfig.e2e.json`, `.github/workflows/ci.yml`.
- `package.json` / `package-lock.json`: new dev dependencies `vitest`, `@playwright/test`; upgraded dev dependencies listed above; new scripts `test`, `test:e2e`.
- `vite.config.ts`, `eslint.config.js`, `tsconfig*.json`: config for Vitest, ESLint 10, TypeScript 6, and the e2e files.
- `.github/workflows/deploy.yaml`: runs CI first and deploys its artifact; Node from `.nvmrc`.
- `CLAUDE.md`, `README.md`.
- Out of scope: fixing the quirks the specs record (see design.md), runtime library changes (React and Tailwind get only minor bumps), TypeScript 7.
