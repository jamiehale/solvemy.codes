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
  <Stack data-pair>
    <Letter data-testid="cipher" outlined className={`${solution !== ' ' ? 'bg-gray-200' : ''}`}>{letter}</Letter>
    {solution === ' ' ? <Letter data-testid="guess">&nbsp;</Letter> : <Letter data-testid="guess">{solution}</Letter>}
  </Stack>
);
