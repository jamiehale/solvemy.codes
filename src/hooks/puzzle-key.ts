import { useState, useCallback } from 'react';

export interface PuzzleKeyHook {
  puzzleKey: Record<string, string>;
  reset: (clues: Record<string, string>) => void;
  set: (key: string, value: string) => void;
  clear: (key: string) => void;
}

export type SetPuzzleKeyFn = PuzzleKeyHook["set"];
export type ClearPuzzleKeyFn = PuzzleKeyHook["clear"];

export const usePuzzleKey = (initialClues: Record<string, string> = {}) => {
  const [puzzleKey, setPuzzleKey] = useState<Record<string, string>>(initialClues);

  const reset = useCallback((clues: Record<string, string>) => {
    setPuzzleKey(clues);
  }, [setPuzzleKey]);

  const set = useCallback((key: string, value: string) => {
    setPuzzleKey({
      ...puzzleKey,
      [key]: value
    });
  }, [puzzleKey, setPuzzleKey]);

  const clear = useCallback((key: string) => {
    const { [key]: _, ...newPuzzleKey } = puzzleKey;
    setPuzzleKey(newPuzzleKey);
  }, [puzzleKey, setPuzzleKey]);

  return {
    puzzleKey,
    reset,
    set,
    clear,
  };
};
