# puzzle-key Specification

## Purpose

Shows the whole substitution key while solving: every cipher letter's guess, which letter is selected, and which guesses clash.

## Requirements

### Requirement: The key lists all 26 letters
While solving, the key panel SHALL list the cipher letters A to Z in a grid of four columns, each as `<letter>=<guess>`, with nothing after `=` when the letter has no guess. A Reset button SHALL sit below the grid.

#### Scenario: Key with one guess
- **GIVEN** the guess `b` = `y` and no other guesses
- **WHEN** the key panel shows
- **THEN** it lists 26 entries, `B=Y`, and every other entry ends in `=`

### Requirement: Guessed entries are shaded
An entry whose letter has a guess SHALL have a grey background. An entry with no guess SHALL have none.

#### Scenario: Shading
- **GIVEN** the guess `b` = `y`
- **WHEN** the key panel shows
- **THEN** the `B` entry is grey and the `C` entry is not

### Requirement: The selected entry is marked
The entry for the selected cipher letter SHALL have a red border and show `?` in place of its guess. Other entries SHALL have no visible border.

#### Scenario: Selected letter
- **GIVEN** `b` has guess `y`
- **WHEN** the user types `b`
- **THEN** the `B` entry reads `B=?` with a red border

### Requirement: Duplicate guesses are flagged
When two or more cipher letters have the same guess, each of their entries SHALL have a red background in place of grey. The flag SHALL go away as soon as the guesses differ.

#### Scenario: Two letters with one guess
- **GIVEN** the guess `a` = `x`
- **WHEN** the user sets `b` = `x`
- **THEN** the `A` and `B` entries are red, and other guessed entries stay grey

#### Scenario: Clash resolved
- **GIVEN** `a` and `b` both have guess `x`
- **WHEN** the user sets `b` = `y`
- **THEN** neither entry is red
