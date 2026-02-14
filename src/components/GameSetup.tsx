import { useState } from "react";
import type { Puzzle } from "../types";
import { Stack } from "./Stack";
import { Button } from "./Button";

interface GameSetupProps {
  initialPuzzle: Puzzle;
  onSet: (puzzle: Puzzle) => void;
}

export const GameSetup = ({ initialPuzzle, onSet }: GameSetupProps) => {
  const [cipher, setCipher] = useState(initialPuzzle.cipher);
  const [clues, setClues] = useState(initialPuzzle.clues);

  const handleSetCipher = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    setCipher(e.target.value);
  }

  return (
    <Stack>
      <input
        className='border-1'
        value={cipher}
        onChange={handleSetCipher}
      />
      {/* <input
        className='border-1'
        value={clueLetter}
        onChange={(e) => {
          setClueLetter(e.target.value);
        }}
      />
      <input
        className='border-1'
        value={clueValue}
        onChange={(e) => {
          setClueValue(e.target.value);
        }}
      /> */}
      <Button
        onClick={() => {
          onSet({ cipher, clues });
        }}
      >
        Done
      </Button>
    </Stack>

  )
}
