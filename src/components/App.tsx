import { useState } from 'react'
import { Stack } from './Stack';
import { Game } from './Game';
import { Button } from './Button';
import type { Puzzle } from '../types';
import { GameSetup } from './GameSetup';
import { IfElse } from './IfElse';

// const thePuzzle: Puzzle = {
//   cipher: `hmb jvibeu lvguhxyu wbu yp xu yutbuyvgp bdvaghyvu levj hmb fgyaa wbup vl vai cmyqm ubbibi hv zb ebwbxhbian iywwbi yuhv yuo. lvguhxyu wbup mxdb hmbye vcu ebpbedvyep xui ibwbui gwvu texdyhn xui hmb uxhgexa lavc vl ayfgyi hv ceyhb. uyzp xeb jxib vl phxyuabpp phbba ve tvai xui ebwbxhbi gpb qxu cbxe hmb uyz hv hmb gpbe'p mxuiceyhyut, jxoyut yh wbepvuxaysbi.`,
//   clues: {}
// }

const thePuzzle: Puzzle = {
  cipher: `zmc owsi gjjwdjvca iwaowz tmhvm qsgxca tgb vdaacjzsx wj zmc oaccj. hz tgb qdzzca vwjidbhwj.`,
  clues: {
    m: 'h'
  }
}

// const thePuzzle: Puzzle = {
//   cipher: `qjnra iw ljpaq`,
//   clues: {
//     l: 'c',
//     p: 'd',
//     a: 'e',
//     n: 'l',
//     i: 'm',
//     j: 'o',
//     q: 's',
//     r: 'v',
//     w: 'y'
//   }
// }


export const App = () => {
  const [editing, setEditing] = useState(true);
  const [puzzle, setPuzzle] = useState(thePuzzle);

  const handleSetPuzzle = (newPuzzle: Puzzle) => {
    setPuzzle(newPuzzle);
    setEditing(false);
  }

  return (
    <div className='md:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
      <Stack className='p-4 gap-5'>
        <h1 className='font-mono text-lg'>solve my . codes</h1>
        <IfElse condition={editing} renderIf={() => (
          <GameSetup initialPuzzle={thePuzzle} onSet={handleSetPuzzle} />
        )} renderElse={() => (
          <Stack>
            <Game puzzle={puzzle} />
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

