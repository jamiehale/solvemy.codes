import { useCallback } from "react";
import useGameInput from "../hooks/game-input";
import { usePuzzleKey } from "../hooks/puzzle-key";
import { Board } from "./Board";
import type { Puzzle } from "../types";
import { PuzzleKey } from "./PuzzleKey";

interface GameProps {
  puzzle: Puzzle;
}

export const Game = ({ puzzle }: GameProps) => {
  const { puzzleKey, duplicateKeys, reset, set, clear } = usePuzzleKey(
    puzzle.clues,
  );
  const { settingLetter, handleClickLetter } = useGameInput(set, clear);

  const handleReset = useCallback(() => {
    reset(puzzle.clues);
  }, [reset, puzzle.clues]);

  return (
    <div className="flex md:flex-row flex-col gap-3 justify-between">
      <div className="flex grow border-0 md:border-r-1 md:border-black">
        <Board puzzle={puzzle.cipher} puzzleKey={puzzleKey} />
      </div>
      <div className="flex shrink-0">
        <PuzzleKey
          puzzleKey={puzzleKey}
          duplicates={duplicateKeys}
          settingLetter={settingLetter}
          onClick={handleClickLetter}
          onReset={handleReset}
        />
      </div>
    </div>
  );
};
