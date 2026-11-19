# Tasks

## 1. Pure puzzle key module

- [x] 1.1 `git mv src/key.ts src/puzzle-key.ts` and `git mv src/key.test.ts src/puzzle-key.test.ts`; rename the `Key` type to `PuzzleKey` and `findDuplicates` to `findDuplicateGuesses`; update the import in `src/hooks/puzzle-key.ts`. Verify `npx vitest run` passes
- [x] 1.2 In `src/puzzle-key.test.ts`, reword test titles and variables from "clash"/"key" to "duplicate guess"/"puzzle key" (e.g. `clashing` → `duplicated`, "in an empty key" → "in an empty puzzle key"). Verify `npx vitest run` passes with the new titles

## 2. Hooks and components

- [x] 2.1 In `src/hooks/puzzle-key.ts`, rename `duplicateKeys` to `duplicateGuesses`. Verify `npm run build` type-checks
- [x] 2.2 `git mv src/hooks/game-input.ts src/hooks/solving-input.ts`; rename `useGameInput` to `useSolvingInput` and `settingLetter`/`setSettingLetter` to `selectedLetter`/`setSelectedLetter`. Verify `npm run build` type-checks
- [x] 2.3 `git mv src/components/PuzzleKey.tsx src/components/PuzzleKeyPanel.tsx`; rename the component and props interface to `PuzzleKeyPanel`/`PuzzleKeyPanelProps`, the `duplicates` prop to `duplicateGuesses`, and `settingLetter` to `selectedLetter`. Verify `npm run build` type-checks
- [x] 2.4 `git mv src/components/Game.tsx src/components/Solving.tsx` and `git mv src/components/GameSetup.tsx src/components/Setup.tsx`; rename the components and props interfaces to `Solving`/`SolvingProps` and `Setup`/`SetupProps`, and update `App.tsx`. Verify `npm run build` and `npm run lint` pass

## 3. Test hooks and e2e tests

- [x] 3.1 In `PuzzleKeyPanel.tsx`, change `data-testid="key"` to `data-testid="puzzle-key-panel"` and `data-key={l}` to `data-puzzle-key-entry={l}`. In `e2e/helpers.ts`, update the locator and rename `keyEntry`/`keyText`/`keyBackground`/`keyBorder` to `puzzleKeyEntry`/`puzzleKeyText`/`puzzleKeyBackground`/`puzzleKeyBorder`; update `e2e/puzzle-key.spec.ts` and `e2e/letter-assignment.spec.ts` to use them. Verify `npm run test:e2e` passes
- [x] 3.2 Reword e2e test titles to the glossary terms: "the key lists all 26 letters…" → "the puzzle key panel lists…", "clash resolved" → "duplicate resolved", "clicking a key entry selects it" → "clicking a puzzle key entry selects it", and any other "key"/"game" titles. Verify `npm run test:e2e` passes
- [x] 3.3 In `e2e/visual.spec.ts`, rename the "game with guesses" and "narrow game" tests to "solving with guesses" and "narrow solving", and the `game.png` screenshot to `solving.png`; `git mv e2e/visual.spec.ts-snapshots/game-chromium-linux.png e2e/visual.spec.ts-snapshots/solving-chromium-linux.png`. Verify `npm run test:e2e:docker` passes without `--update-snapshots`

## 4. Specs and docs

- [x] 4.1 Reword the main specs to the glossary terms, without changing any requirement's meaning: `puzzle-key` ("key panel" → "puzzle key panel", "entry" → "puzzle key entry", "clash" → "duplicate guess", Purpose line, requirement title "The puzzle key panel lists all 26 letters"); `letter-assignment` ("substitution key"/"the key" → "puzzle key", "key panel" → "puzzle key panel", requirement title "Clicking a puzzle key entry selects it"; keyboard "keys" stay); `board-display` ("key panel" → "puzzle key panel", "the game with guesses" → "solving with guesses"); `puzzle-setup` ("show the game"/"the game shows" → solving). Check `e2e/*.spec.ts` titles still line up with the requirements, and verify `openspec validate --specs` passes
- [x] 4.2 Update `CLAUDE.md`: "substitutes" → "guesses"; `GameSetup`/`Game` → `Setup`/`Solving`; `useGameInput`/`game-input.ts` → `useSolvingInput`/`solving-input.ts`; `settingLetter` → `selectedLetter`; `duplicateKeys` → `duplicateGuesses`; `PuzzleKey` → `PuzzleKeyPanel`; `src/key.ts`/`findDuplicates` → `src/puzzle-key.ts`/`findDuplicateGuesses`; the test-hook list → `data-testid="puzzle-key-panel"` and `data-puzzle-key-entry="<letter>"`; "substitution map" and "the key" → "puzzle key". Verify that every file and name it mentions exists
- [x] 4.3 Update `README.md`: "Type a letter to set it's substitute" → use "guess" (and fix "it's" → "its"). Verify by reading it

## 5. Integration check

- [x] 5.1 Grep `src/`, `e2e/`, `openspec/specs/`, `CLAUDE.md`, and `README.md` for `settingLetter`, `duplicateKeys`, `findDuplicates\b`, `GameSetup`, `useGameInput`, `game-input`, `data-key`, `testid="key"`, `testid('key')`, `/key'`, `/key"`, `substitut`, and `clash`, and confirm every remaining hit is intended (e.g. "letter substitution" for the puzzle type)
- [x] 5.2 Run `npx vitest run`, `npm run lint`, `npm run build`, and `npm run test:e2e:docker`, and confirm all pass with no snapshot updates

## Workflow follow-up

- Open a PR; it touches `src/`, so the user merges it.
- After merge, archive the change and do the post-archive cleanup from `CLAUDE.md`.
