import type { PuzzleKey } from "../puzzle-key";
import { Button } from "./Button";
import { Letter } from "./Letter";
import { letters } from "../letters";
import { Stack } from "./Stack";

interface PuzzleKeyPanelProps {
  puzzleKey: PuzzleKey;
  duplicateGuesses: Set<string>;
  selectedLetter: string | null;
  onClick: (l: string) => void;
  onReset: () => void;
}

export const PuzzleKeyPanel = ({
  puzzleKey,
  duplicateGuesses,
  selectedLetter,
  onClick,
  onReset,
}: PuzzleKeyPanelProps) => (
  <Stack className="gap-3">
    <div data-testid="puzzle-key-panel" className="grid grid-cols-4 gap-x-3 gap-y-1">
      {letters.split("").map((l) => (
        <button key={l} type="button" data-puzzle-key-entry={l} className="cursor-pointer" onClick={() => onClick(l)}>
          <Stack
            horizontal
            className={`border-2 ${selectedLetter === l ? "border-red-400" : "border-transparent"} ${puzzleKey[l] && "bg-gray-200"} ${duplicateGuesses.has(l) && "bg-red-200"}`}
          >
            <Letter>{l}</Letter>=
            {selectedLetter === l ? (
              <Letter>?</Letter>
            ) : (
              <Letter>{puzzleKey[l]}</Letter>
            )}
          </Stack>
        </button>
      ))}
    </div>
    <Stack horizontal>
      <Button onClick={onReset}>Reset</Button>
    </Stack>
  </Stack>
);
