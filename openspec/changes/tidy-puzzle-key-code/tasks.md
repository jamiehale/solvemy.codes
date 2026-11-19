# Tasks

## 1. Tidy-up

- [ ] 1.1 Type the puzzle key as `PuzzleKey` in `Board`, `Word`, and `PuzzleKeyPanel` props and in `usePuzzleKey`'s state and `PuzzleKeyHook.puzzleKey`; leave clue-typed values alone. Verify `npm run build` type-checks and `grep -rn 'Record<string, string>' src` lists only `PuzzleKey`'s definition and clue types
- [ ] 1.2 Remove `console.log({ storedPuzzle })` from `src/components/App.tsx`. Verify the console stays quiet on load and `npm run lint` passes
- [ ] 1.3 Run `npx vitest run`, `npm run lint`, `npm run build`, and `npm run test:e2e:docker`, and confirm all pass with no snapshot updates

## Workflow follow-up

- Start after `rename-to-glossary-terms` merges.
- Open a PR; it touches `src/`, so the user merges it. Then archive and clean up.
