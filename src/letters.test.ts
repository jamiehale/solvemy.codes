import { describe, expect, it } from 'vitest';
import { isLetter, letters } from './letters';

describe('isLetter', () => {
  it('accepts every lowercase letter', () => {
    for (const l of letters) {
      expect(isLetter(l)).toBe(true);
    }
  });

  it.each(['A', 'Z', '5', ' ', '.', ',', '!'])('rejects %j', (c) => {
    expect(isLetter(c)).toBe(false);
  });
});
