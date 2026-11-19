import { useState, useCallback, useMemo } from "react";
import { findDuplicateGuesses, withGuess, withoutGuess } from "../puzzle-key";

export interface PuzzleKeyHook {
  puzzleKey: Record<string, string>;
  reset: (clues: Record<string, string>) => void;
  set: (key: string, value: string) => void;
  clear: (key: string) => void;
}

export type SetPuzzleKeyFn = PuzzleKeyHook["set"];
export type ClearPuzzleKeyFn = PuzzleKeyHook["clear"];

export const usePuzzleKey = (initialClues: Record<string, string> = {}) => {
  const [puzzleKey, setPuzzleKey] =
    useState<Record<string, string>>(initialClues);

  const duplicateGuesses = useMemo(() => findDuplicateGuesses(puzzleKey), [puzzleKey]);

  const reset = useCallback(
    (clues: Record<string, string>) => {
      setPuzzleKey(clues);
    },
    [setPuzzleKey],
  );

  const set = useCallback(
    (key: string, value: string) => {
      setPuzzleKey(withGuess(puzzleKey, key, value));
    },
    [puzzleKey, setPuzzleKey],
  );

  const clear = useCallback(
    (key: string) => {
      setPuzzleKey(withoutGuess(puzzleKey, key));
    },
    [puzzleKey, setPuzzleKey],
  );

  return {
    puzzleKey,
    duplicateGuesses,
    reset,
    set,
    clear,
  };
};
