# Spec Delta

## Purpose

Keeps the user's puzzle across page loads on the same browser, so they don't have to type the cipher again.

## ADDED Requirements

### Requirement: Done saves the puzzle
Clicking Done SHALL save the puzzle (cipher and clues) in the browser's `localStorage` under the key `puzzle`, as JSON of the form `{"cipher": "<text>", "clues": {"<letter>": "<letter>"}}`. Editing the form without clicking Done SHALL NOT save anything.

#### Scenario: Saved on Done
- **GIVEN** Cipher `abc`, Clue Letter `a`, Clue Value `x`
- **WHEN** the user clicks Done
- **THEN** `localStorage.puzzle` holds `{"cipher":"abc","clues":{"a":"x"}}`

#### Scenario: Not saved before Done
- **GIVEN** a saved puzzle with cipher `abc`
- **WHEN** the user changes the Cipher field to `xyz` and reloads without clicking Done
- **THEN** the setup form shows `abc`

### Requirement: The default puzzle
When nothing is saved under `puzzle`, or the saved value is not valid JSON, the app SHALL use the default puzzle: cipher `qjnra iw . ljpaq` with the clue `q` = `s`. Using the default SHALL NOT write it to storage.

#### Scenario: First visit
- **GIVEN** empty `localStorage`
- **WHEN** the page loads
- **THEN** the setup form shows cipher `QJNRA IW . LJPAQ`, Clue Letter `Q`, and Clue Value `S`

#### Scenario: Corrupt saved value
- **GIVEN** `localStorage.puzzle` holds `not json`
- **WHEN** the page loads
- **THEN** the setup form shows the default puzzle

### Requirement: Older saves still load
A puzzle saved by the app before this change SHALL load unchanged after it.

#### Scenario: Saved-puzzle fixture
- **GIVEN** `localStorage.puzzle` holds the fixture captured from the app before this change
- **WHEN** the page loads and the user clicks Done
- **THEN** the board shows the fixture's cipher and its clue as a guess
