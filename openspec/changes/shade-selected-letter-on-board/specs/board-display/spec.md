# Spec Delta

## MODIFIED Requirements

### Requirement: Filled pairs are shaded
The top box of a pair SHALL have a grey background when the bottom row shows something (a guess, or a passed-through non-letter), and no background otherwise. While the pair's letter is selected, the selected mark SHALL take the place of the grey.

#### Scenario: Shading follows the guess
- **GIVEN** the cipher `ab` and the guess `a` = `x`
- **WHEN** the board shows
- **THEN** the `A` box is grey and the `B` box is not

### Requirement: Pairs of the selected letter are marked
While a cipher letter is selected, the cipher box of every pair for that letter SHALL have a light red background, the same red as a duplicate guess in the puzzle key panel, and keep its black border. The guess row of those pairs SHALL stay as it is. Pairs of other letters and non-letters SHALL keep their usual background. When no letter is selected, no pair SHALL have a red background.

#### Scenario: Select by keyboard
- **GIVEN** the cipher `aba`
- **WHEN** the user types `a`
- **THEN** both `A` cipher boxes are light red and the `B` cipher box has no background
- **AND** every cipher box has a black border

#### Scenario: Select by clicking the puzzle key panel
- **GIVEN** the cipher `ab`
- **WHEN** the user clicks `b` in the puzzle key panel
- **THEN** the `B` cipher box is light red and the `A` cipher box has no background

#### Scenario: Guess row unchanged
- **GIVEN** the cipher `ab` and the guess `a` = `x`
- **WHEN** the user types `a`
- **THEN** the `A` cipher box is light red, not grey, and the `A` pair still shows `X` below

#### Scenario: Setting a guess clears the mark
- **GIVEN** the cipher `ab` and `a` is selected
- **WHEN** the user types `y`
- **THEN** no cipher box is red, and the `A` box is grey

#### Scenario: Clearing a guess clears the mark
- **GIVEN** the cipher `ab` and `a` is selected
- **WHEN** the user presses Escape
- **THEN** no cipher box has a background

#### Scenario: Selected letter not in the cipher
- **GIVEN** the cipher `ab`
- **WHEN** the user types `z`
- **THEN** no cipher box is red
