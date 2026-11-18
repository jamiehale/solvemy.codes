# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A small React + TypeScript + Vite + Tailwind v4 web app that helps solve cryptogram (letter substitution) puzzles. Live at https://solvemy.codes. The user enters a cipher and an optional clue, then types letters to assign substitutes.

## Commands

- `npm run dev` — dev server
- `npm run build` — type-check (`tsc -b`) then build to `dist/`
- `npm run lint` — ESLint
- `npm run preview` — serve the built `dist/`

There is no test suite.

## Architecture

- `App` switches between two modes: `GameSetup` (edit the puzzle) and `Game` (solve it). The current `Puzzle` (`{ cipher, clues }`, see `src/types.ts`) is saved in localStorage under the key `puzzle` via `useLocalStorage`. Solving progress (the key) is not saved; it resets to the clues on reload or on Reset.
- `Game` wires two hooks together:
  - `usePuzzleKey` (`src/hooks/puzzle-key.ts`) holds the substitution map (cipher letter → guessed letter) and computes `duplicateKeys` — cipher letters that map to the same guess, which `PuzzleKey` highlights in red.
  - `useGameInput` (`src/hooks/game-input.ts`) listens for `keydown` on `window`. It is a two-step state machine: the first letter typed (or clicked in `PuzzleKey`) selects a cipher letter (`settingLetter`); the next letter sets its substitute, and Space/Escape clears it.
- Rendering: `Board` splits the cipher on spaces into `Word`s, and each `Word` renders a `Pair` per character (cipher letter above, guess below). Non-letters pass through unchanged.
- Only lowercase `a`–`z` count as letters (`src/letters.ts`). Inputs are shown uppercase with CSS only.
- `Stack`, `Letter`, `Button`, `IfElse` are tiny layout/UI helpers; styling is Tailwind classes inline.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yaml`, which builds and uploads `dist/` over FTPS. So any commit to `main` goes live.

## OpenSpec

The repo uses OpenSpec (`openspec/`, spec-driven schema) for planning changes. Use the `openspec-*` / `opsx:*` skills to propose, apply, and archive changes.
