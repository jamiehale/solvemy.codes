# Proposal

## Why

The 1px red border that marks the selected letter's pairs on the board (added in `highlight-selected-letter-on-board`) is too faint to spot at a glance. A filled background stands out much more.

## What Changes

- While a cipher letter is selected, the cipher box of each of its pairs on the board gets a light red background (the same red as a duplicate guess in the puzzle key panel).
- The red border goes away: those cipher boxes keep the black border like every other cipher box.
- The red background replaces the grey shading while the letter is selected. When the selection clears, the box goes back to grey if the letter has a guess, or to no background if it doesn't.
- The guess row stays plain, and nothing else on the board changes.
- The `selected.png` visual baseline is regenerated.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `board-display`:
  - "Pairs of the selected letter are marked": the mark changes from a red border to a light red background.
  - "Filled pairs are shaded": grey shading gives way to the selected mark.

## Impact

- `src/components/Letter.tsx`, `src/components/Pair.tsx`: move the selected mark from the border color to the background.
- `e2e/board-display.spec.ts`: the selected-letter tests check background instead of border; the "setting a guess" test also checks that grey comes back.
- `e2e/visual.spec.ts-snapshots/selected-chromium-linux.png`: regenerated.
- No change to the puzzle key panel, input handling, or saved data.
