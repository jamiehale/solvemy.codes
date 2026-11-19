# Tasks

From group 5 on, "passes the gate" means `npx vitest run`, `npm run lint`, `npm run build`, and `npm run test:e2e` all pass with zero snapshot updates.

## 1. Baseline and fixture

- [x] 1.1 Create a branch. Add `.nvmrc` pinning Node 26. Verify that `npm ci` and `npm run build` succeed under Node 26.
- [x] 1.2 Add `@playwright/test` as a dev dependency and install Chromium (`npx playwright install chromium`). Add `playwright-report/` and `test-results/` to `.gitignore`. Verify with `npx playwright --version`.
- [x] 1.3 Before any `src/` change, write `e2e/capture-fixture.ts` (run with `npx tsx` or `node --experimental-strip-types`, not matched by the suite) that drives the running app: types a cipher with capitals and punctuation, sets a clue, clicks Done, and writes `localStorage.puzzle` to `e2e/fixtures/saved-puzzle-882117f.json`. Run it and commit the fixture. Verify the JSON has `cipher` (lowercase) and `clues` with one entry.

## 2. Pure key logic and unit tests

- [x] 2.1 Add `vitest` as a dev dependency, a `test: { environment: 'node', include: ['src/**/*.test.ts'] }` block in `vite.config.ts`, and a `test: vitest` script. Verify that `npx vitest run` runs (with `--passWithNoTests` until 2.3 lands).
- [x] 2.2 Move duplicate detection and the set/clear transforms from `src/hooks/puzzle-key.ts` into `src/key.ts` as `findDuplicates`, `withGuess`, and `withoutGuess`, moving the code as is (design Decision 2). `usePuzzleKey` keeps its return shape. Verify that `npm run build` and `npm run lint` pass and the app behaves the same by hand (set, clear, duplicate red, Reset).
- [x] 2.3 Add `src/key.test.ts` (duplicates: none, one pair, three-way, cleared clash; `withGuess` adds and replaces without mutating; `withoutGuess` removes and is a no-op for a missing letter) and `src/letters.test.ts` (`isLetter` true for a–z, false for capitals, digits, space, punctuation). Import from `vitest`. Verify with `npx vitest run`.

## 3. Playwright behavior tests

- [x] 3.1 Add `playwright.config.ts` (Chromium, viewport 1024×800, `webServer: npm run dev` on 5173, `reuseExistingServer`, the screenshot settings from design Decision 10), `tsconfig.e2e.json` referenced from `tsconfig.json`, `server`/`preview` `port: 5173, strictPort: true` in `vite.config.ts`, Node globals for `e2e/**` and root configs in `eslint.config.js`, and a `test:e2e` script. Verify that `npm run test:e2e` runs an empty suite cleanly and `npm run build` type-checks `e2e/`.
- [x] 3.2 Add the `data-` hooks from design Decision 5 to `Board`, `Pair`/`Letter`, and `PuzzleKey`. Verify in the browser DOM that the default puzzle shows 13 `[data-pair]` and 26 `[data-key]` elements, and that the page looks unchanged.
- [x] 3.3 Add `e2e/helpers.ts`: seed `localStorage.puzzle` with `addInitScript`, start solving (click Done), read a pair's cipher and guess text, read a key entry's text, background, and border colors, and resolve expected Tailwind colors through a probe element (design Decision 6). Verify through the first spec in 3.4.
- [x] 3.4 Add `e2e/puzzle-setup.spec.ts` covering every scenario in `specs/puzzle-setup/spec.md`. Verify that `npm run test:e2e` passes.
- [x] 3.5 Add `e2e/letter-assignment.spec.ts` covering every scenario in `specs/letter-assignment/spec.md`. Verify that `npm run test:e2e` passes.
- [x] 3.6 Add `e2e/board-display.spec.ts` and `e2e/puzzle-key.spec.ts` covering every scenario in those specs except the visual-baseline one (wide and narrow layout checked through element bounding boxes, source link through `href` and `target`). Verify that `npm run test:e2e` passes.
- [x] 3.7 Add `e2e/puzzle-persistence.spec.ts` covering every scenario in `specs/puzzle-persistence/spec.md`, including loading `e2e/fixtures/saved-puzzle-882117f.json`. Verify that `npm run test:e2e` passes.

## 4. Visual baselines and docs

- [x] 4.1 Add `e2e/visual.spec.ts` with `toHaveScreenshot()` for the states in design Decision 10. Generate baselines with `npx playwright test e2e/visual.spec.ts --update-snapshots`, check each image by eye against the running app, and commit them. Verify that a second `npm run test:e2e` passes with no snapshot changes.
- [x] 4.2 Update `CLAUDE.md` (remove "There is no test suite"; add the test commands, a single spec, `-g`, `--update-snapshots` and when to use it, where tests live, the `data-` hooks, the seeding helper, the fixture rule, `src/key.ts`, `.nvmrc`) and the README's Developing section. Verify each documented command runs as written.

## 5. Dependency upgrades

- [x] 5.1 Minor/patch bumps: `react`/`react-dom` 19.3, `tailwindcss`/`@tailwindcss/vite` 4.3, `@types/react`, `@types/react-dom`, `typescript-eslint`, `eslint-plugin-react-hooks` 7.1, `eslint`/`@eslint/js` latest 9.39. Verify that `npm ls` shows no peer conflicts and the change passes the gate.
- [x] 5.2 Vite 8 and `@vitejs/plugin-react` 6 together. Verify that the change passes the gate, and that `npm run build && npx playwright test` against `npm run preview` (point `webServer` at it for one run, then restore) passes with zero snapshot updates.
- [x] 5.3 ESLint 10, `@eslint/js` 10, `globals` 17, `eslint-plugin-react-refresh` 0.5 (`configs.vite()` is now a function). Fix only trivial, behavior-neutral findings; disable the rest per line with a reason. Verify that the change passes the gate.
- [x] 5.4 TypeScript 6.0 (latest 6.0.x, the newest `typescript-eslint` supports) and `@types/node` 26. Verify that `tsc -b` prints no deprecation warnings and the change passes the gate.
- [x] 5.5 Update `CLAUDE.md` with the stack versions and the TypeScript 6 exception (held until `typescript-eslint` supports 7). Verify that `npm outdated` shows no major lag except `typescript`.

## 6. CI and deploy

- [x] 6.1 Add `.github/workflows/ci.yml` as in design Decision 12 (pull requests + `workflow_call`, `ubuntu-24.04`, Node from `.nvmrc`, unit, lint, build, Playwright Chromium with deps, e2e, `dist` artifact, report on failure). Verify with `npx --yes @action-validator/cli .github/workflows/ci.yml` or an equivalent schema check.
- [x] 6.2 Change `.github/workflows/deploy.yaml`: add a `ci` job calling `ci.yml`; the deploy job `needs: ci`, checks out only `wrangler.jsonc`, downloads the `dist` artifact to `dist/`, and runs the pinned wrangler. Keep triggers, `paths-ignore`, environment, and concurrency. Verify with the same schema check and `npx wrangler@4.156.2 deploy --dry-run` after a local build.
- [ ] 6.3 Open the PR and check the CI run. If the visual suite fails only on font rendering, move the e2e job into the Playwright Docker image and regenerate baselines with the same image (design Risks), then document the `docker run` command in `CLAUDE.md`. Verify that CI passes on the PR.
- [ ] 6.4 Update `CLAUDE.md`'s Deploy section and the README for the CI gate and the artifact-based deploy. Verify the docs match both workflow files.

## 7. Integration check

- [ ] 7.1 From a clean checkout under Node 26, run `npm ci` and the full gate. Verify all pass with no snapshot updates.
- [ ] 7.2 After merge, check the deploy run: CI ran first, the deploy job used CI's `dist` artifact, and https://solvemy.codes loads and solves the default puzzle.

## Workflow follow-up

- Archive this change after the deploy check so the five specs land in `openspec/specs/`.
- Consider a follow-up change for the recorded quirks, starting with lowercasing the clue fields (a capital clue value crashes the game).
