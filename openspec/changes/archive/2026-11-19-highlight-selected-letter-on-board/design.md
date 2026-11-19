# Design

## Context

`useSolvingInput` in `Solving` owns `selectedLetter` and passes it only to `PuzzleKeyPanel`. The board path is `Solving` → `Board` → `Word` → `Pair` → `Letter`. `Letter` sets its border color from `outlined` (`border-black` or `border-transparent`) on a 1px border.

## Goals / Non-Goals

**Goals:**
- Mark the selected letter's pairs on the board without moving anything on the page.

**Non-Goals:**
- Changing the puzzle key panel's look.
- Hover or focus effects on pairs; pairs stay non-interactive.

## Decisions

- **Pass `selectedLetter` down as a prop.** `Solving` passes it to `Board`, `Board` to each `Word`, and `Word` gives each `Pair` a `selected` boolean (`letter === selectedLetter`). The tree is three levels deep and has one consumer, so a React context would add more than it saves.
- **Change only the border color, keep the 1px width.** The cipher box goes from `border-black` to `border-red-400`. A thicker border, like the panel's `border-2`, would grow the box and shift the board's layout when the selection changes. `red-400` matches the panel's selected border, so the two read as the same mark.
- **Color the border through `Letter`.** `Letter` takes a `selected` flag (or `Pair` passes a border class) so `outlined` stays the single place that decides the border. Non-letters never match `selectedLetter`, since it is always a letter, so they need no special case.

## Risks / Trade-offs

- [A 1px red border is subtle next to the panel's 2px one] → Accepted for now to avoid layout shift; revisit with a ring or outline if it proves hard to see.
- [`selected.png` baseline changes] → Regenerate it in the Docker image and check that only the `P` cipher boxes changed.
