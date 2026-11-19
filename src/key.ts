import { letters } from "./letters";

export type Key = Record<string, string>;

export const findDuplicates = (key: Key): Set<string> => {
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

export const withGuess = (key: Key, letter: string, guess: string): Key => ({
  ...key,
  [letter]: guess,
});

export const withoutGuess = (key: Key, letter: string): Key => {
  const rest = { ...key };
  delete rest[letter];
  return rest;
};
