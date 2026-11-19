# Design

## Context

See proposal.md for why. The renames touch components, hooks, a pure module, its unit tests, the e2e helpers and specs, one visual baseline, the main specs, and two docs. The visual suite only runs in the Playwright Docker image (`npm run test:e2e:docker`).

## Goals / Non-Goals

**Goals:**
- Every name in code, tests, specs, and docs uses the `GLOSSARY.md` term for its concept.
- The app behaves and renders exactly as before; the existing tests prove it.

**Non-Goals:**
- Changing UI text. "Clue Letter" and "Clue Value" stay as form labels, even though the glossary avoids "clue value" as a term.
- Refactoring beyond renames, such as typing `Board`/`Word` props with `PuzzleKey` or removing the `console.log` in `App`.
- Renaming spec capabilities. `puzzle-key` already matches; `letter-assignment`, `board-display`, `puzzle-setup`, and `puzzle-persistence` don't clash with the glossary.

## Decisions

- **`skip_specs: true`, and edit the main specs directly.** Requirements don't change, only their wording. Delta specs would need a MODIFIED block for nearly every requirement, and they can't update the Purpose lines. Editing `openspec/specs/*/spec.md` in the implementation keeps the history readable. Two requirement titles change: "The key lists all 26 letters" → "The puzzle key panel lists all 26 letters", and "Clicking a key entry selects it" → "Clicking a puzzle key entry selects it".
- **Test hook names: `data-testid="puzzle-key-panel"` and `data-puzzle-key-entry="<letter>"`.** They name the glossary concepts directly, so a reader of the tests learns the domain terms. `data-entry` alone was shorter but too vague. The testid stays on the grid element, as now.
- **The pure module becomes `src/puzzle-key.ts`.** That shares a base name with `src/hooks/puzzle-key.ts`. That's acceptable: the hook holds React state for the puzzle key and the module holds the pure functions on it, and the import paths (`../puzzle-key` vs `./puzzle-key`) say which. A suffix such as `puzzle-key-ops.ts` adds a term that isn't in the glossary.
- **The `Key` type becomes `PuzzleKey`.** That name is free once the component is `PuzzleKeyPanel`.
- **`findDuplicates` becomes `findDuplicateGuesses`**, to match `duplicateGuesses`. It still returns the cipher letters that share a guess.
- **Rename the visual baseline with `git mv`, without regenerating it.** The screenshot name in `visual.spec.ts` changes from `game.png` to `solving.png`, so Playwright looks for `solving-chromium-linux.png`. The pixels stay the same, and the Docker visual run proves nothing moved. Renaming the other baselines isn't needed: `setup`, `selected`, `duplicates`, and `narrow` already fit.
- **Rename files with `git mv`**, so git history follows them.

## Risks / Trade-offs

- [A missed old name stays behind] → After the renames, grep for `settingLetter`, `duplicateKeys`, `findDuplicates\b`, `GameSetup`, `useGameInput`, `data-key`, `testid="key"`, `"../key"`, `substitut`, and `clash`, and check every remaining hit is intended.
- [The renamed baseline doesn't match, for example after a typo in the name] → Run `npm run test:e2e:docker` before opening the PR. A missing baseline fails the run; it doesn't silently write a new one in CI.
- [The PR deploys] → No behavior change, and CI runs the full suite before deploy. Rollback is a revert on `main`.
