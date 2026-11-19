# Design

## Context

See proposal.md for why. Current state:

- Vite 7, React 19.2, Tailwind 4.1, TypeScript 5.9 strict, ESLint 9 flat config. `tsc -b` checks `src/` (`tsconfig.app.json`) and `vite.config.ts` (`tsconfig.node.json`). No test runner, no `test` script.
- All logic lives in two hooks. `usePuzzleKey` (`src/hooks/puzzle-key.ts`) holds the key in `useState` and computes `duplicateKeys` inline. `useGameInput` (`src/hooks/game-input.ts`) is a keyboard/click state machine on `window` `keydown`.
- No DOM test hooks. Letters are uppercase only through CSS, so the DOM text is lowercase. State shows only as Tailwind classes, which compute to `oklch(...)` colors.
- Deploy (`.github/workflows/deploy.yaml`) runs `npm ci` and `npm run build` on Node 23 and deploys `dist/`. Nothing tests before it.
- `../soduko` is the model: specs first, then runner-neutral unit tests, a Playwright behavior + visual suite as the upgrade gate, a captured save fixture, step-by-step upgrades, and a `ci.yml` that `deploy.yml` calls.
- Peer ranges checked on 2026-11-18: `@vitejs/plugin-react` 6 needs Vite 8; `typescript-eslint` 8.73 needs TypeScript `<6.1.0`; `eslint-plugin-react-hooks` 7.1 and `eslint-plugin-react-refresh` 0.5 accept ESLint 10; `@tailwindcss/vite` 4.3 and Vitest 5 accept Vite 8.

## Goals / Non-Goals

**Goals:**
- Tests that don't depend on Vite, React internals, or Tailwind's class names, so they hold through every upgrade step.
- Every upgrade step lands as its own commit that passes the full gate with no snapshot updates.
- Nothing reaches production unless CI passed on that exact build.

**Non-Goals:**
- Fixing the quirks listed below. The specs describe current behavior; fixes are follow-up changes.
- Component tests with React Testing Library or jsdom. The e2e suite covers UI behavior.
- Cross-browser coverage. Chromium only.
- TypeScript 7 (see Decision 8).
- Removing or restyling anything. The visual baselines must not move.

## Decisions

**1. Order: safety net, then upgrades, then CI.**
Tests are written and green against today's app before any dependency moves, so each upgrade step is checked by the same suite. CI comes last so its first run uses the final toolchain.

**2. Pure key logic moves to `src/key.ts`.**
Move the duplicate computation and the set/clear transforms out of `usePuzzleKey` into exported pure functions (`findDuplicates(key)`, `withGuess(key, letter, guess)`, `withoutGuess(key, letter)`). Move the code as it is; don't rewrite it, so behavior stays identical, including for guesses outside a–z. `usePuzzleKey` keeps its return shape and calls them. `useGameInput` stays as it is; the e2e suite covers its state machine.
*Alternative:* test the hooks with `renderHook` in jsdom. Rejected: two more dev dependencies for logic that is easy to make pure.

**3. Vitest in the `node` environment, explicit imports.**
Tests are `src/**/*.test.ts` and import `describe`/`it`/`expect` from `vitest`, so TypeScript needs no global types. Vitest config goes in `vite.config.ts` under `test` (`include: ['src/**/*.test.ts']`, `environment: 'node'`). `npm test` runs `vitest`; `npx vitest run` runs once. Unit tests cover `isLetter`, `findDuplicates`, `withGuess`, and `withoutGuess`.

**4. Playwright in TypeScript, type-checked by `tsc -b`.**
`playwright.config.ts` at the root and `e2e/*.spec.ts`. Add `tsconfig.e2e.json` (Node types, `include: ["e2e", "playwright.config.ts"]`) and reference it from `tsconfig.json`, so `npm run build` type-checks the tests too. `webServer` runs `npm run dev` on Vite's port 5173; set `server.strictPort` and `preview.port`/`strictPort` so the URL never drifts. Chromium only, viewport 1024×800, `reuseExistingServer: true`. One spec file per capability in `specs/`, plus `visual.spec.ts`.

**5. Test hooks are `data-` attributes.**
`data-testid="board"` on the board, `data-pair` on each pair (with `data-testid="cipher"` and `data-testid="guess"` on its two boxes), `data-testid="key"` on the key grid, and `data-key="<letter>"` on each key entry button. Assertions read `textContent`, which is lowercase because uppercase comes from CSS, plus computed `text-transform` once to check that uppercase display holds. Form fields are found by their labels.

**6. Colors are compared against the theme, not hard-coded.**
Tailwind 4 colors compute to `oklch(...)`, and a Tailwind bump can tweak palette values. The helper resolves the expected color by rendering a probe element with `background-color: var(--color-gray-200)` (or `red-200`, `red-400` for the border) in the page and reading its computed value. A Tailwind palette change then passes the behavior tests and is caught by the visual baselines, where it belongs.

**7. Seed and inspect state through `localStorage`.**
`e2e/helpers.ts` writes `{ cipher, clues }` under `puzzle` with `page.addInitScript` before load, and can click Done to start solving. Guesses aren't saved, so tests set them by typing, which also exercises the input state machine.

**8. Upgrade targets and the TypeScript exception.**
Steps, one commit each: (a) minor/patch bumps (`react`/`react-dom` 19.3, `tailwindcss`/`@tailwindcss/vite` 4.3, `@types/react*`, `typescript-eslint`, `eslint-plugin-react-hooks` 7.1, ESLint 9.39.x); (b) Vite 8 + `@vitejs/plugin-react` 6 together, since the plugin needs Vite 8; (c) ESLint 10 + `@eslint/js` 10 + `globals` 17 + `eslint-plugin-react-refresh` 0.5, whose configs become functions (`reactRefresh.configs.vite()`); (d) TypeScript 6.0 and `@types/node` 26. TypeScript stays on 6.0 because `typescript-eslint` supports only `<6.1.0`; TypeScript 7 waits for it, the same way `../soduko` held ESLint at 9.

**9. Node 26.**
`.nvmrc` pins 26, the Active LTS since October 2026 and the version installed locally. `../soduko` pinned 24 before 26 reached LTS. CI and deploy read `.nvmrc`; `@types/node` follows it.

**10. Visual baselines like `../soduko`.**
`toHaveScreenshot()` with `animations: 'disabled'`, `maxDiffPixelRatio: 0.01`, and a per-pixel `threshold` of 0.05 so `gray-200` is not read as white. States: setup form (default puzzle), game with guesses, a selected letter, duplicate guesses, and the game at 390×844. Baselines are committed with Playwright's Linux suffix. They are generated in the Playwright Docker image (`npm run test:e2e:docker`), the same image CI runs in, and `visual.spec.ts` skips anywhere else. Changed during apply: the first CI run spent minutes in `playwright install --with-deps` (apt), and the image's fonts differ from Debian's (2 of 5 shots failed), so the planned fallback became the plan. The image's sans font has no bold, so baselines show the bold letters as regular; colors, layout, and spacing are still locked.

**11. Saved-puzzle fixture from the current app.**
`e2e/capture-fixture.ts` (not matched by the suite) drives the current app: types a cipher with capitals and punctuation, sets a clue, clicks Done, and writes `localStorage.puzzle` to `e2e/fixtures/saved-puzzle-882117f.json`, named for the commit it came from. It runs once, before any source change, and the fixture is never regenerated.

**12. CI like `../soduko`.**
`.github/workflows/ci.yml` runs on pull requests and as a reusable workflow (`workflow_call`): `npm ci`, `npx vitest run`, `npm run lint`, `npm run build`, `npx playwright install --with-deps chromium`, `npm run test:e2e`, then uploads `dist/` as the `dist` artifact (and the Playwright report on failure). It runs in `container: mcr.microsoft.com/playwright:v1.65.1-noble` (`--ipc=host`) with no browser install step; `@playwright/test` is pinned to exactly the image's version. `deploy.yaml` keeps its name, triggers, `paths-ignore`, environment, and concurrency; it gets a `ci` job that calls `ci.yml`, and its deploy job `needs: ci`, checks out only `wrangler.jsonc`, downloads the `dist` artifact, and runs the pinned wrangler. Action majors match `../soduko` (`checkout@v7`, `setup-node@v7`, `upload-artifact@v7`, `download-artifact@v8`).

**13. Lint covers the tests.**
`eslint.config.js` adds Node globals for `e2e/**` and the root config files, and ignores `playwright-report/` and `test-results/`. `.gitignore` adds those two directories.

### Quirks recorded, not fixed

- Shift + letter in Clue Letter or Clue Value stores a capital. A capital clue letter never matches the lowercase cipher, and a capital clue value makes the game crash on Done (duplicate detection looks up a letter outside a–z). Not specified; candidate follow-up: lowercase the clue fields like the cipher field.
- Clicking a key entry while another letter is selected clears the selected letter's guess. Specified as is in `letter-assignment`.
- Entry class strings include `undefined`/`false`, `Button` accepts an unused `color` prop, and `App` logs the puzzle on every render.
- Fixed during apply: key entries had no React `key`. Vite 8 forwards browser console errors to the dev server's output, so the warning flooded every e2e run; adding `key={l}` changes no behavior.
- Found during apply: Tailwind 4.3 changed its default `--font-sans` stack, which moved the key panel's letters in the visual baselines. `src/index.css` pins the 4.1 stack in `@theme`, so the look is unchanged and no baseline was updated.

## Risks / Trade-offs

- [Screenshots depend on the machine's fonts] → Baselines and CI both use the Playwright Docker image; host runs skip the visual spec. Never update baselines to hide a real diff.
- [The image tag and `@playwright/test` drift apart] → `@playwright/test` is pinned exactly; `CLAUDE.md` says to bump the package, the `ci.yml` tag, and the `test:e2e:docker` script together.
- [Vite 8 swaps the bundler to Rolldown, and plugin-react 6 drops Babel for Oxc, so production output can differ from dev] → Run the e2e and visual suites once against `npm run preview` at step (b).
- [TypeScript 6 deprecates options and changes defaults] → `tsconfig*.json` already sets `types`, `moduleResolution: bundler`, and `target` explicitly. Treat any new deprecation warning as a failure of the step and fix the config.
- [ESLint 10 or the new `globals` flags code that passed before] → Fix only trivial, behavior-neutral findings; disable the rest per line with a reason.
- [Space on a focused button both clears a guess and could press the button] → Tests focus the page body before keyboard input, matching how the app is used.
- [CI gating slows a deploy by the length of the e2e run] → Accepted; the suite is small.

## Migration Plan

One branch, opened as a PR so the new CI runs on it before merge. Commits in order: fixture capture; key extraction + unit tests; test hooks + e2e suite; visual baselines; docs; each upgrade step (a)–(d); CI and deploy workflows. Merging to `main` deploys through the new path for the first time; check that the deploy job uses CI's artifact and the site still loads. Rollback: revert the merge on `main`. For an instant rollback, roll back in the Cloudflare dashboard, then revert.
