import { useState, useCallback, useEffect, useMemo } from 'react';
import { letters } from '../letters';

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

  const duplicateKeys = useMemo(() => {
    const keys: Record<string, string[]> = letters.split('').reduce((acc, l) => ({ ...acc, [l]: [] }), {});
    Object.keys(puzzleKey).forEach(from => {
      keys[puzzleKey[from]] = [...keys[puzzleKey[from]], from];
    });
    const duplicates = Object.keys(keys).reduce<string[]>((acc, key) => {
      if (keys[key].length > 1) {
        return [...acc, ...keys[key]];
      }
      return acc;
    }, []);
    return new Set(duplicates);
  }, [puzzleKey]);

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
    duplicateKeys,
    reset,
    set,
    clear,
  };
};
