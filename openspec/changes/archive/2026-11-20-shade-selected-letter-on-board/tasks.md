# Tasks

## 1. Tests first

- [x] 1.1 Rewrite the `pairs of the selected letter are marked` tests in `e2e/board-display.spec.ts` to match `specs/board-display/spec.md`: check cipher box backgrounds against `themeColor(page, 'red-200')` / `'gray-200'` / `transparent`, check every cipher border is black, and make "guess row unchanged" check that red replaces grey; verify the red-background tests fail with `npx playwright test e2e/board-display.spec.ts`
- [x] 1.2 Remove the `borderTopColor` helper from `e2e/helpers.ts` if no test uses it any more; verify `npm run build` passes

## 2. Background instead of border

- [x] 2.1 In `Pair`, give the cipher box `bg-red-200` when selected, else `bg-gray-200` when filled, else no background; drop the `selected` prop from `Letter` so its border is black again; verify `npx playwright test e2e/board-display.spec.ts` passes
- [x] 2.2 Run `npx vitest run`, `npm run lint`, `npm run build`, and `npm run test:e2e`; verify all pass

## 3. Visual baseline

- [x] 3.1 Run `npm run test:e2e:docker -- e2e/visual.spec.ts -g "selected letter" --update-snapshots=all`, look at the new `selected-chromium-linux.png`, and verify the diff against the old one is only inside the `P` cipher box (light red fill, black border); confirm no other baseline changed in `git status`
- [x] 3.2 Run `npm run test:e2e:docker`; verify the whole suite passes

## Workflow follow-up

- Open a PR; it touches `src/`, so the user merges it.
- Archive the change after merge and clean up per `CLAUDE.md`.
