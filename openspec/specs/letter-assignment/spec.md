# letter-assignment Specification

## Purpose

Lets the user build the puzzle key while solving: pick a cipher letter, then give it a guess or clear it.

## Requirements

### Requirement: Typing a letter selects it
While solving with no cipher letter selected, typing a lowercase letter a–z SHALL select that cipher letter. Other keys, including Shift + letter, SHALL do nothing.

#### Scenario: Select by keyboard
- **GIVEN** no letter is selected
- **WHEN** the user types `b`
- **THEN** `b` is selected

#### Scenario: Shifted letter ignored
- **GIVEN** no letter is selected
- **WHEN** the user types Shift + `B`
- **THEN** no letter is selected

### Requirement: Typing a second letter sets the guess
While a cipher letter is selected, typing a lowercase letter a–z SHALL set it as that cipher letter's guess, replacing any earlier guess, and SHALL clear the selection. Any letter is allowed, including the cipher letter itself and a letter already used as another guess.

#### Scenario: Set a guess
- **GIVEN** `b` is selected
- **WHEN** the user types `y`
- **THEN** `b` has guess `y` and no letter is selected

#### Scenario: Replace a guess
- **GIVEN** `b` has guess `y`
- **WHEN** the user types `b` then `z`
- **THEN** `b` has guess `z`

#### Scenario: Replace a clue
- **GIVEN** the clue `a` = `x`
- **WHEN** the user types `a` then `w`
- **THEN** `a` has guess `w`

### Requirement: Space or Escape clears the guess
While a cipher letter is selected, Space or Escape SHALL remove that letter's guess and clear the selection. Space SHALL NOT scroll the page.

#### Scenario: Clear with Space
- **GIVEN** `b` has guess `y` and `b` is selected
- **WHEN** the user presses Space
- **THEN** `b` has no guess and no letter is selected

#### Scenario: Clear with Escape
- **GIVEN** `b` is selected and has no guess
- **WHEN** the user presses Escape
- **THEN** `b` still has no guess and no letter is selected

### Requirement: Other keys keep the selection
While a cipher letter is selected, any key other than a lowercase letter, Space, or Escape SHALL leave the puzzle key and the selection unchanged.

#### Scenario: Digit while selected
- **GIVEN** `b` is selected
- **WHEN** the user types `5`
- **THEN** `b` is still selected and its guess is unchanged

### Requirement: Clicking a puzzle key entry selects it
Clicking a letter in the puzzle key panel SHALL select that cipher letter. If another letter was already selected, its guess SHALL be removed first. Clicking the selected letter again SHALL remove its guess and keep it selected.

#### Scenario: Click with nothing selected
- **GIVEN** no letter is selected
- **WHEN** the user clicks `c` in the puzzle key panel
- **THEN** `c` is selected

#### Scenario: Click while another letter is selected
- **GIVEN** `b` has guess `y` and `b` is selected
- **WHEN** the user clicks `c` in the puzzle key panel
- **THEN** `b` has no guess and `c` is selected

#### Scenario: Click the selected letter
- **GIVEN** `b` has guess `y` and `b` is selected
- **WHEN** the user clicks `b` in the puzzle key panel
- **THEN** `b` has no guess and `b` is still selected

### Requirement: Reset restores the clues
The Reset button SHALL replace the whole puzzle key with the puzzle's clues, removing every guess the user set and restoring any clue they changed. It SHALL NOT change which letter is selected.

#### Scenario: Reset after guesses
- **GIVEN** the clue `a` = `x`, and the user has set `b` = `y` and `a` = `w`
- **WHEN** the user clicks Reset
- **THEN** `a` has guess `x` and `b` has no guess

#### Scenario: Reset keeps the selection
- **GIVEN** `b` is selected
- **WHEN** the user clicks Reset
- **THEN** `b` is still selected

### Requirement: Guesses are not saved
The puzzle key SHALL start from the puzzle's clues each time solving starts, including after a page reload.

#### Scenario: Reload while solving
- **GIVEN** the user is solving and has set `b` = `y`
- **WHEN** the page reloads and the user clicks Done
- **THEN** `b` has no guess
