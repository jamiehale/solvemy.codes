# Design

## Context

`selectedLetter` already reaches each `Pair` as a `selected` boolean (from `highlight-selected-letter-on-board`). Today `Letter` uses it to pick `border-red-400`, and `Pair` separately picks `bg-gray-200` for filled pairs through `className`.

## Goals / Non-Goals

**Goals:**
- Swap the selected mark from border to background with the least code.

**Non-Goals:**
- Changing the puzzle key panel or the duplicate-guess color.
- Tightening the visual suite's `maxDiffPixelRatio` (see Risks).

## Decisions

- **Pick the background in `Pair`, in one place.** `Pair` already chooses the cipher box background. It becomes: selected → `bg-red-200`, else filled → `bg-gray-200`, else none. Keeping both choices in one expression makes "red takes the place of grey" obvious and avoids two classes fighting over `background-color`.
- **Drop `selected` from `Letter`.** With the border back to black, `Letter` goes back to deciding only `outlined`. The prop plumbing through `Solving` → `Board` → `Word` → `Pair` stays as it is.
- **`red-200`, the duplicate-guess red.** Chosen by the user for visibility. The board never shows duplicate guesses, so the same red doesn't mean two things in one place.

## Risks / Trade-offs

- [The panel uses `red-200` for duplicate guesses, so a selected letter that is also a duplicate shows red in both places for different reasons] → Accepted: the panel marks its selected entry with a red border and `?`, which still sets it apart.
- [The visual suite won't notice this change: the `P` box is about 600 pixels, under the 1% `maxDiffPixelRatio`] → Regenerate `selected.png` with `--update-snapshots=all` for that one test, and rely on the e2e color tests to check the behavior.
