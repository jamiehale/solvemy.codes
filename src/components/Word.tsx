import type { PuzzleKey } from '../puzzle-key';
import { Stack } from './Stack';
import { Pair } from './Pair';
import { isLetter } from '../letters';

interface WordProps {
  className?: string;
  word: string;
  puzzleKey: PuzzleKey;
}

export const Word = ({
  className,
  word,
  puzzleKey,
}: WordProps) => {
  const pairs = word.split('').map((letter, i) => (
    <Pair key={i} letter={letter} solution={isLetter(letter) ? puzzleKey[letter] ?? ' ' : letter} />
  ));

  return (
    <Stack horizontal className={`gap-1 ${className}`}>
      {pairs}
    </Stack>
  );
};
