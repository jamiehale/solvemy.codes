# Spec Delta

## Purpose

Lets the user enter the cipher text and one optional clue, then switch between editing the puzzle and solving it.

## ADDED Requirements

### Requirement: The app opens on the setup form
Every page load SHALL show the setup form, filled with the saved puzzle: a Cipher field, a Clue Letter field, a Clue Value field, and a Done button.

#### Scenario: Load with a saved puzzle
- **GIVEN** a saved puzzle with cipher `abc` and clue `a` = `x`
- **WHEN** the page loads
- **THEN** the setup form shows Cipher `abc`, Clue Letter `a`, and Clue Value `x`

#### Scenario: Load with no saved puzzle
- **GIVEN** no saved puzzle
- **WHEN** the page loads
- **THEN** the setup form shows the default puzzle's cipher and clue

### Requirement: The cipher field lowercases its input
The Cipher field SHALL store what the user types in lowercase. It SHALL accept any characters, including spaces, digits, and punctuation. It SHALL display its text in uppercase.

#### Scenario: Typed capitals are stored lowercase
- **WHEN** the user types `Hello, World` into the Cipher field and clicks Done
- **THEN** the saved cipher is `hello, world`

#### Scenario: Cipher shown in uppercase
- **WHEN** the Cipher field holds `abc`
- **THEN** it displays `ABC`

### Requirement: Clue fields take one letter each
The Clue Letter and Clue Value fields SHALL each hold at most one character. They SHALL ignore key presses other than A–Z (either case), Backspace, Delete, Tab, Escape, Enter, and the left and right arrows. They SHALL display their text in uppercase.

#### Scenario: Digit is ignored
- **WHEN** the user types `5` into the Clue Letter field
- **THEN** the field stays unchanged

#### Scenario: Second letter is refused
- **GIVEN** the user has just typed `q` into the empty Clue Letter field
- **WHEN** the user types `r`
- **THEN** the field still holds `q`

### Requirement: Focusing a field selects its text
Focusing the Cipher, Clue Letter, or Clue Value field SHALL select all of its text, so the next key press replaces it.

#### Scenario: Replace a clue letter
- **GIVEN** the Clue Letter field holds `q`
- **WHEN** the user clicks into the field and types `r`
- **THEN** the field holds `r`

### Requirement: Done saves the puzzle and starts solving
Clicking Done, or pressing Enter in a field, SHALL save the puzzle and show the game. The puzzle SHALL have one clue (Clue Letter → Clue Value) when both fields are filled, and no clues otherwise.

#### Scenario: Done with a clue
- **GIVEN** Cipher `abc`, Clue Letter `a`, Clue Value `x`
- **WHEN** the user clicks Done
- **THEN** the game shows, and cipher letter `a` already has guess `x`

#### Scenario: Done with half a clue
- **GIVEN** Cipher `abc`, Clue Letter `a`, and an empty Clue Value
- **WHEN** the user clicks Done
- **THEN** the game shows with no guesses

#### Scenario: Enter submits
- **WHEN** the user presses Enter in the Cipher field
- **THEN** the puzzle is saved and the game shows

### Requirement: Edit Puzzle returns to the setup form
While solving, an Edit Puzzle button SHALL return to the setup form, filled with the saved puzzle. Guesses made while solving SHALL be discarded; clicking Done again SHALL start with only the clue.

#### Scenario: Edit and return
- **GIVEN** the user is solving and has set `b` = `y`
- **WHEN** the user clicks Edit Puzzle and then Done without changes
- **THEN** the game shows with only the clue's guess, and `b` has no guess

### Requirement: Only the first clue is editable
When the saved puzzle has more than one clue, the setup form SHALL show only the first one, and Done SHALL save only the clue in the form.

#### Scenario: Saved puzzle with two clues
- **GIVEN** a saved puzzle with clues `a` = `x` and `b` = `y`
- **WHEN** the page loads and the user clicks Done
- **THEN** the form showed `a` / `x`, and the saved puzzle has only the clue `a` = `x`
