# Proposal

## Why

`GLOSSARY.md` now fixes the project's vocabulary. The code, tests, specs, and docs still use older or mixed names for the same things: "key" (which also means a keyboard key), "setting letter", "duplicate keys", "clash", "substitute", and "game". Renaming them now, while the app is small, means one name for each concept everywhere.

## What Changes

- Code renames:
  - `PuzzleKey.tsx` / `PuzzleKey` → `PuzzleKeyPanel.tsx` / `PuzzleKeyPanel`
  - `Game.tsx` / `Game` → `Solving.tsx` / `Solving`; `GameSetup.tsx` / `GameSetup` → `Setup.tsx` / `Setup`
  - `src/hooks/game-input.ts` / `useGameInput` → `src/hooks/solving-input.ts` / `useSolvingInput`
  - `settingLetter` → `selectedLetter`; `duplicateKeys` and the panel's `duplicates` prop → `duplicateGuesses`
  - `src/key.ts` / `Key` → `src/puzzle-key.ts` / `PuzzleKey`; `findDuplicates` → `findDuplicateGuesses` (and `src/key.test.ts` → `src/puzzle-key.test.ts`)
- Test hooks: `data-testid="key"` → `data-testid="puzzle-key-panel"`; `data-key="<letter>"` → `data-puzzle-key-entry="<letter>"`. The `e2e/helpers.ts` helpers and the specs that use them change to match (`keyEntry` → `puzzleKeyEntry`, and so on).
- Test titles and the visual baseline `game.png` → `solving.png` (the file is renamed; its pixels don't change).
- Specs: main specs under `openspec/specs/` are reworded to use "puzzle key", "puzzle key panel", "puzzle key entry", "duplicate guess", and "solving". No requirement changes.
- Docs: `CLAUDE.md` and `README.md` use "guess" instead of "substitute", plus the new names and test hooks.

No behavior or visual change. The UI labels ("Clue Letter", "Clue Value", "Edit Puzzle", "Done", "Reset") stay as they are.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The specs are reworded but their requirements don't change, so the change sets `skip_specs: true` and edits the main specs directly.

## Impact

- `src/components/`, `src/hooks/`, `src/key.ts`, `src/key.test.ts`
- `e2e/helpers.ts`, `e2e/*.spec.ts`, `e2e/visual.spec.ts-snapshots/game-chromium-linux.png`
- `openspec/specs/*/spec.md`, `CLAUDE.md`, `README.md`
- The PR touches `src/`, so it deploys and the user must merge it. The built site should behave and look the same.
