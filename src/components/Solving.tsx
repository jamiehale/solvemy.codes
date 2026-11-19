import { useCallback } from "react";
import useSolvingInput from "../hooks/solving-input";
import { usePuzzleKey } from "../hooks/puzzle-key";
import { Board } from "./Board";
import type { Puzzle } from "../types";
import { PuzzleKeyPanel } from "./PuzzleKeyPanel";

interface SolvingProps {
  puzzle: Puzzle;
}

export const Solving = ({ puzzle }: SolvingProps) => {
  const { puzzleKey, duplicateGuesses, reset, set, clear } = usePuzzleKey(
    puzzle.clues,
  );
  const { selectedLetter, handleClickLetter } = useSolvingInput(set, clear);

  const handleReset = useCallback(() => {
    reset(puzzle.clues);
  }, [reset, puzzle.clues]);

  return (
    <div className="flex md:flex-row flex-col gap-3 justify-between">
      <div className="flex grow border-0 md:border-r-1 md:border-black">
        <Board puzzle={puzzle.cipher} puzzleKey={puzzleKey} selectedLetter={selectedLetter} />
      </div>
      <div className="flex shrink-0">
        <PuzzleKeyPanel
          puzzleKey={puzzleKey}
          duplicateGuesses={duplicateGuesses}
          selectedLetter={selectedLetter}
          onClick={handleClickLetter}
          onReset={handleReset}
        />
      </div>
    </div>
  );
};
