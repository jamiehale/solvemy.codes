import type { PuzzleKey } from '../puzzle-key';
import { Word } from './Word';

interface BoardProps {
  puzzle: string;
  puzzleKey: PuzzleKey;
}

export const Board = ({
  puzzle,
  puzzleKey,
}: BoardProps) => {
  const puzzleWords = puzzle.split(' ');

  const words = puzzleWords.map((word, i) => (
    <Word key={i} word={word} puzzleKey={puzzleKey} />
  ));

  return (
    <div data-testid='board' className='flex flex-wrap gap-5'>{words}</div>
  );
};

