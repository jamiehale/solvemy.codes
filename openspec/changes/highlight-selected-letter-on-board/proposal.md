# Proposal

## Why

When the user selects a cipher letter, only its puzzle key entry shows it. The user has to look away from the board to see which letter they are about to guess, and can't see at a glance where that letter appears in the cipher.

## What Changes

- While a cipher letter is selected, every pair on the board for that letter shows its cipher box with a red border in place of black, matching the red border on its puzzle key entry.
- The guess row of those pairs does not change (no `?`), and nothing else on the board changes.
- The highlight goes away as soon as the selection clears (a guess is set, or Space/Escape).
- The `selected.png` visual baseline is regenerated to show the new look.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `board-display`: adds a requirement that pairs of the selected letter are marked on the board.

## Impact

- `src/components/Solving.tsx`, `Board.tsx`, `Word.tsx`, `Pair.tsx`, `Letter.tsx`: pass the selected letter down to each pair and color its cipher box border.
- `e2e/board-display.spec.ts`: new tests for the highlight; `e2e/helpers.ts` may need a helper for a pair's border color.
- `e2e/visual.spec.ts-snapshots/selected-chromium-linux.png`: regenerated.
- No change to the puzzle key, input handling, or saved data.
