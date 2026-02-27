import { Button } from "./Button";
import { Letter } from "./Letter";
import { letters } from "../letters";
import { Stack } from "./Stack";

interface PuzzleKeyProps {
  puzzleKey: Record<string, string>;
  duplicates: Set<string>;
  settingLetter: string | null;
  onReset: () => void;
}

export const PuzzleKey = ({
  puzzleKey,
  duplicates,
  settingLetter,
  onReset,
}: PuzzleKeyProps) => (
  <Stack className="gap-3">
    <div className="grid grid-cols-4 gap-x-3 gap-y-1">
      {letters.split("").map((l) => (
        <Stack
          horizontal
          className={`border-2 ${settingLetter === l ? "border-red-400" : "border-transparent"} ${puzzleKey[l] && "bg-gray-200"} ${duplicates.has(l) && "bg-red-200"}`}
        >
          <Letter>{l}</Letter>=
          {settingLetter === l ? (
            <Letter>?</Letter>
          ) : (
            <Letter>{puzzleKey[l]}</Letter>
          )}
        </Stack>
      ))}
    </div>
    <Stack horizontal>
      <Button onClick={onReset}>Reset</Button>
    </Stack>
  </Stack>
);
