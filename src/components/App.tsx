import { useState } from 'react'
import { Stack } from './Stack';
import { Game } from './Game';
import { Button } from './Button';
import type { Puzzle } from '../types';
import { GameSetup } from './GameSetup';
import { IfElse } from './IfElse';
import { useLocalStorage } from '../hooks/local-storage';
import { GitHubLink } from './GitHubLink';

const thePuzzle: Puzzle = {
  cipher: `qjnra iw . ljpaq`,
  clues: {
    q: 's',
  }
}


export const App = () => {
  const [editing, setEditing] = useState(true);
  const [storedPuzzle, setStoredPuzzle] = useLocalStorage('puzzle', thePuzzle);

  console.log({ storedPuzzle })

  const handleSetPuzzle = (newPuzzle: Puzzle) => {
    setStoredPuzzle(newPuzzle);
    setEditing(false);
  }

  return (
    <div className='md:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
      <GitHubLink
        href="https://github.com/jamiehale/solvemy.codes"
        target="_new"
      />

      <Stack className='p-4 gap-5'>
        <h1 className='font-mono text-lg'>solve my . codes</h1>
        <IfElse condition={editing} renderIf={() => (
          <GameSetup initialPuzzle={storedPuzzle} onSet={handleSetPuzzle} />
        )} renderElse={() => (
          <Stack className='gap-4'>
            <Game puzzle={storedPuzzle} />
            <Stack horizontal>
              <Button
                onClick={() => {
                  setEditing(true);
                }}
              >
                Edit Puzzle
              </Button>
            </Stack>
          </Stack >
        )} />
      </Stack>
    </div>
  );
};

