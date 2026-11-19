# Spec Delta

## ADDED Requirements

### Requirement: Pairs of the selected letter are marked
While a cipher letter is selected, the cipher box of every pair for that letter SHALL have a red border in place of black. The guess row of those pairs SHALL stay as it is. Pairs of other letters and non-letters SHALL keep their black border. When no letter is selected, no pair SHALL have a red border.

#### Scenario: Select by keyboard
- **GIVEN** the cipher `aba`
- **WHEN** the user types `a`
- **THEN** both `A` cipher boxes have a red border and the `B` cipher box has a black border

#### Scenario: Select by clicking the puzzle key panel
- **GIVEN** the cipher `ab`
- **WHEN** the user clicks `b` in the puzzle key panel
- **THEN** the `B` cipher box has a red border and the `A` cipher box has a black border

#### Scenario: Guess row unchanged
- **GIVEN** the cipher `ab` and the guess `a` = `x`
- **WHEN** the user types `a`
- **THEN** the `A` pair still shows `X` below its red-bordered box

#### Scenario: Setting a guess clears the mark
- **GIVEN** the cipher `ab` and `a` is selected
- **WHEN** the user types `y`
- **THEN** no cipher box has a red border

#### Scenario: Clearing a guess clears the mark
- **GIVEN** the cipher `ab` and `a` is selected
- **WHEN** the user presses Escape
- **THEN** no cipher box has a red border

#### Scenario: Selected letter not in the cipher
- **GIVEN** the cipher `ab`
- **WHEN** the user types `z`
- **THEN** no cipher box has a red border
