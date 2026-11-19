import { letters } from "./letters";

export type PuzzleKey = Record<string, string>;

export const findDuplicateGuesses = (key: PuzzleKey): Set<string> => {
  const keys: Record<string, string[]> = letters
    .split("")
    .reduce((acc, l) => ({ ...acc, [l]: [] }), {});
  Object.keys(key).forEach((from) => {
    keys[key[from]] = [...keys[key[from]], from];
  });
  const duplicates = Object.keys(keys).reduce<string[]>((acc, k) => {
    if (keys[k].length > 1) {
      return [...acc, ...keys[k]];
    }
    return acc;
  }, []);
  return new Set(duplicates);
};

export const withGuess = (key: PuzzleKey, letter: string, guess: string): PuzzleKey => ({
  ...key,
  [letter]: guess,
});

export const withoutGuess = (key: PuzzleKey, letter: string): PuzzleKey => {
  const rest = { ...key };
  delete rest[letter];
  return rest;
};
