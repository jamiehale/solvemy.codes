import { Stack } from './Stack';
import { Letter } from './Letter';

interface PairProps {
  letter: string;
  solution: string;
}

export const Pair = ({
  letter,
  solution,
}: PairProps) => (
  <Stack>
    <Letter outlined className={`${solution !== ' ' ? 'bg-gray-200' : ''}`}>{letter}</Letter>
    {solution === ' ' ? <Letter>&nbsp;</Letter> : <Letter>{solution}</Letter>}
  </Stack>
);
