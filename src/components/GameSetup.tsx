import { useMemo, useState } from "react";
import type { Puzzle } from "../types";
import { Stack } from "./Stack";
import { Button } from "./Button";

interface GameSetupProps {
  initialPuzzle: Puzzle;
  onSet: (puzzle: Puzzle) => void;
}

const useInitialClue = (clues: Puzzle["clues"]): { initialClueLetter: string, initialClueValue: string } => {
  const initialClueLetter = useMemo(() => Object.keys(clues)[0] ?? '', [clues]);
  return { initialClueLetter: initialClueLetter, initialClueValue: initialClueLetter === '' ? '' : clues[initialClueLetter] ?? '' }
}

export const GameSetup = ({ initialPuzzle, onSet }: GameSetupProps) => {
  const [cipher, setCipher] = useState(initialPuzzle.cipher);
  const { initialClueLetter, initialClueValue } = useInitialClue(initialPuzzle.clues);
  const [clueLetter, setClueLetter] = useState<string>(initialClueLetter);
  const [clueValue, setClueValue] = useState<string>(initialClueValue);

  const handleSetCipher = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    setCipher(e.target.value);
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clues: Puzzle["clues"] = {};
    if (clueLetter !== '' && clueValue !== '') {
      clues[clueLetter] = clueValue;
    }
    onSet({ cipher, clues });
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return;
    }
    if (!/^[A-Za-z]$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack className="gap-3">
        <Stack horizontal className="gap-3 items-center">
          <label htmlFor="cipher" className="font-mono lowercase">Cipher:</label>
          <div className="flex grow">
            <input
              id="cipher"
              className='border-1 py-1 px-2 w-[100%]'
              value={cipher}
              onFocus={handleFocus}
              onChange={handleSetCipher}
            />
          </div>
        </Stack>
        <Stack horizontal className="gap-3 items-center">
          <label htmlFor="clueLetter" className="font-mono lowercase">Clue Letter:</label>
          <input
            id="clueLetter"
            type="text"
            className='border-1 py-1 px-2 uppercase w-8'
            maxLength={1}
            value={clueLetter}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setClueLetter(e.target.value);
            }}
          />
          <label htmlFor="clueValue" className="font-mono lowercase">Clue Value:</label>
          <input
            id="clueValue"
            type="text"
            className='border-1 py-1 px-2 uppercase w-8'
            maxLength={1}
            value={clueValue}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setClueValue(e.target.value);
            }}
          />
        </Stack>
        <Stack horizontal>
          <Button type="submit">
            Done
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
