import { Button } from "./Button";
import { Letter } from "./Letter";
import { letters } from "../letters";
import { Stack } from "./Stack";

interface PuzzleKeyProps {
  puzzleKey: Record<string, string>;
  settingLetter: string | null;
  onReset: () => void;
}

export const PuzzleKey = ({ puzzleKey, settingLetter, onReset }: PuzzleKeyProps) => (
  <Stack>
    <Stack className="flex-wrap max-h-[260px] gap-y-1 gap-x-1 items-center">
      {letters.split('').map(l => (
        <Stack horizontal className={`border-2 ${settingLetter === l ? 'border-red-400' : 'border-transparent'} ${puzzleKey[l] && 'bg-gray-200'}`}>
          <Letter>{l}</Letter>
          =
          <Letter>{puzzleKey[l]}</Letter>
        </Stack>
      ))}

    </Stack>
    <Stack horizontal>
      <Button onClick={onReset}>Reset</Button>
    </Stack>


  </Stack>
)
