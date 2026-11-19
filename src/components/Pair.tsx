import { Stack } from './Stack';
import { Letter } from './Letter';

interface PairProps {
  letter: string;
  solution: string;
  selected: boolean;
}

export const Pair = ({
  letter,
  solution,
  selected,
}: PairProps) => (
  <Stack data-pair>
    <Letter data-testid="cipher" outlined selected={selected} className={`${solution !== ' ' ? 'bg-gray-200' : ''}`}>{letter}</Letter>
    {solution === ' ' ? <Letter data-testid="guess">&nbsp;</Letter> : <Letter data-testid="guess">{solution}</Letter>}
  </Stack>
);
