import { describe, expect, it } from 'vitest';
import { findDuplicateGuesses, withGuess, withoutGuess } from './puzzle-key';

describe('findDuplicateGuesses', () => {
  it('finds nothing in an empty puzzle key', () => {
    expect(findDuplicateGuesses({})).toEqual(new Set());
  });

  it('finds nothing when every guess differs', () => {
    expect(findDuplicateGuesses({ a: 'x', b: 'y' })).toEqual(new Set());
  });

  it('finds both letters of a shared guess', () => {
    expect(findDuplicateGuesses({ a: 'x', b: 'x', c: 'y' })).toEqual(new Set(['a', 'b']));
  });

  it('finds all three letters of a three-way duplicate guess', () => {
    expect(findDuplicateGuesses({ a: 'x', b: 'x', c: 'x' })).toEqual(new Set(['a', 'b', 'c']));
  });

  it('finds nothing once a duplicate guess is resolved', () => {
    const duplicated = { a: 'x', b: 'x' };
    expect(findDuplicateGuesses(withGuess(duplicated, 'b', 'y'))).toEqual(new Set());
  });
});

describe('withGuess', () => {
  it('adds a guess', () => {
    expect(withGuess({ a: 'x' }, 'b', 'y')).toEqual({ a: 'x', b: 'y' });
  });

  it('replaces a guess', () => {
    expect(withGuess({ a: 'x' }, 'a', 'w')).toEqual({ a: 'w' });
  });

  it('leaves the original puzzle key alone', () => {
    const puzzleKey = { a: 'x' };
    withGuess(puzzleKey, 'a', 'w');
    expect(puzzleKey).toEqual({ a: 'x' });
  });
});

describe('withoutGuess', () => {
  it('removes a guess', () => {
    expect(withoutGuess({ a: 'x', b: 'y' }, 'a')).toEqual({ b: 'y' });
  });

  it('does nothing for a letter with no guess', () => {
    expect(withoutGuess({ a: 'x' }, 'b')).toEqual({ a: 'x' });
  });

  it('leaves the original puzzle key alone', () => {
    const puzzleKey = { a: 'x' };
    withoutGuess(puzzleKey, 'a');
    expect(puzzleKey).toEqual({ a: 'x' });
  });
});
