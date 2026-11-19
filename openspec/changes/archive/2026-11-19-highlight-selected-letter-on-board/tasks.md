# Tasks

## 1. Tests first

- [x] 1.1 Add a helper in `e2e/helpers.ts` that reads a cipher box's top border color (tests compare it with `themeColor(page, 'red-400')`); verify `npm run build` type-checks it
- [x] 1.2 Add a `pairs of the selected letter are marked` describe block to `e2e/board-display.spec.ts` with one test per scenario in `specs/board-display/spec.md` (keyboard select, panel click, guess row unchanged, guess clears it, Escape clears it, letter not in cipher); verify they fail with `npx playwright test e2e/board-display.spec.ts`

## 2. Highlight on the board

- [x] 2.1 Pass `selectedLetter` from `Solving` to `Board`, from `Board` to each `Word`, and give each `Pair` a `selected` boolean; verify `npm run build` passes
- [x] 2.2 Make the selected pair's cipher box use `border-red-400` in place of `border-black` (1px width unchanged) through `Letter`/`Pair`; verify the new tests in `e2e/board-display.spec.ts` pass and the existing black-border test still passes
- [x] 2.3 Run `npx vitest run`, `npm run lint`, and `npm run test:e2e`; verify all pass

## 3. Visual baseline

- [x] 3.1 Run `npm run test:e2e:docker -- --update-snapshots`, look at the new `e2e/visual.spec.ts-snapshots/selected-chromium-linux.png`, and verify only the `P` cipher boxes changed (red border); confirm the other four baselines are unchanged in `git status`
- [x] 3.2 Run `npm run test:e2e:docker` without updating; verify the whole suite passes

## Workflow follow-up

- Open a PR; it touches `src/` so the user merges it.
- Archive the change after merge and clean up per `CLAUDE.md`.
