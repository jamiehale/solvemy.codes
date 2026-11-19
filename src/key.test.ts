import { describe, expect, it } from 'vitest';
import { findDuplicates, withGuess, withoutGuess } from './key';

describe('findDuplicates', () => {
  it('finds nothing in an empty key', () => {
    expect(findDuplicates({})).toEqual(new Set());
  });

  it('finds nothing when every guess differs', () => {
    expect(findDuplicates({ a: 'x', b: 'y' })).toEqual(new Set());
  });

  it('finds both letters of a shared guess', () => {
    expect(findDuplicates({ a: 'x', b: 'x', c: 'y' })).toEqual(new Set(['a', 'b']));
  });

  it('finds all three letters of a three-way clash', () => {
    expect(findDuplicates({ a: 'x', b: 'x', c: 'x' })).toEqual(new Set(['a', 'b', 'c']));
  });

  it('finds nothing once a clash is resolved', () => {
    const clashing = { a: 'x', b: 'x' };
    expect(findDuplicates(withGuess(clashing, 'b', 'y'))).toEqual(new Set());
  });
});

describe('withGuess', () => {
  it('adds a guess', () => {
    expect(withGuess({ a: 'x' }, 'b', 'y')).toEqual({ a: 'x', b: 'y' });
  });

  it('replaces a guess', () => {
    expect(withGuess({ a: 'x' }, 'a', 'w')).toEqual({ a: 'w' });
  });

  it('leaves the original key alone', () => {
    const key = { a: 'x' };
    withGuess(key, 'a', 'w');
    expect(key).toEqual({ a: 'x' });
  });
});

describe('withoutGuess', () => {
  it('removes a guess', () => {
    expect(withoutGuess({ a: 'x', b: 'y' }, 'a')).toEqual({ b: 'y' });
  });

  it('does nothing for a letter with no guess', () => {
    expect(withoutGuess({ a: 'x' }, 'b')).toEqual({ a: 'x' });
  });

  it('leaves the original key alone', () => {
    const key = { a: 'x' };
    withoutGuess(key, 'a');
    expect(key).toEqual({ a: 'x' });
  });
});
