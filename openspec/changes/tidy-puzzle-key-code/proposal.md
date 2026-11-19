# Proposal

## Why

`rename-to-glossary-terms` left two small things on purpose, to keep that change to renames only: the puzzle key's type is spelled out as `Record<string, string>` in most places that use it, and `App` logs the stored puzzle to the console on every render.

## What Changes

- Use the `PuzzleKey` type from `src/puzzle-key.ts` wherever a puzzle key is passed or stored: `Board`, `Word`, and `PuzzleKeyPanel` props, and `usePuzzleKey` (its state, `PuzzleKeyHook.puzzleKey`). Clues (`Puzzle.clues`, `initialClues`, `reset`'s argument) are a different concept and keep their own type.
- Remove the `console.log({ storedPuzzle })` from `App`.

No behavior or visual change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. Code-only tidy-up; the change sets `skip_specs: true`.

## Impact

- `src/components/Board.tsx`, `Word.tsx`, `PuzzleKeyPanel.tsx`, `App.tsx`, `src/hooks/puzzle-key.ts`
- The PR touches `src/`, so it deploys and the user merges it.
