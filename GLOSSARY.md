# solve my . codes

A helper for solving cryptograms: puzzles where each letter of a message has been swapped for another letter.

## Puzzle

**Puzzle**:
A cipher together with its clues; what the user enters and the app keeps between visits.

**Cipher**:
The encrypted text of a puzzle, made of words separated by spaces. It may contain non-letters.
_Avoid_: Ciphertext, code, message

**Letter**:
One of the lowercase letters a–z. Anything else in the cipher (digits, punctuation) is a non-letter and passes through as itself.

**Cipher letter**:
A letter as it appears in the cipher.
_Avoid_: Key letter, setting letter

**Clue**:
A pairing of a cipher letter with a guess that comes with the puzzle. When solving starts, a clue becomes that letter's first guess, and nothing marks it apart from other guesses after that.
_Avoid_: Hint

**Default puzzle**:
The puzzle shown when the user has none of their own.

## Solving

**Puzzle key**:
The full set of guesses during solving: at most one guess for each cipher letter. It starts from the clues every time solving starts.
_Avoid_: Key (it reads as a keyboard key), substitution map, mapping

**Guess**:
The letter the user thinks a cipher letter stands for.
_Avoid_: Substitute, value, clue value, plain letter

**Selected letter**:
The cipher letter whose guess the user is about to set or clear. There is at most one.
_Avoid_: Setting letter, active letter

**Duplicate guess**:
A guess that two or more cipher letters share in the puzzle key. Each of those cipher letters is flagged.
_Avoid_: Clash, conflict, duplicate key

**Reset**:
Putting the puzzle key back to the puzzle's clues, which throws away every guess the user made.

## Modes

**Setup**:
The mode where the user enters or edits the puzzle.
_Avoid_: Game setup, edit mode

**Solving**:
The mode where the user builds the puzzle key against the board.
_Avoid_: Game, play

## Display

**Board**:
The cipher laid out as words of pairs.

**Word**:
A run of cipher characters between spaces, kept together on one line.

**Pair**:
One cipher character shown above its guess (or above itself, for a non-letter).

**Puzzle key panel**:
The display of the whole puzzle key: one puzzle key entry for each letter A–Z.
_Avoid_: Key panel

**Puzzle key entry**:
One cipher letter and its guess in the puzzle key panel.
_Avoid_: Key entry
