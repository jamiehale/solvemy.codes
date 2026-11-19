# board-display Specification

## Purpose

Shows the cipher as words of letter pairs, each cipher letter above its current guess, and sets out the page around it.

## Requirements

### Requirement: The cipher is split into words
The board SHALL split the cipher on each space into words and show them in order, wrapping onto new lines as needed. Each word SHALL keep its characters together on one line.

#### Scenario: Two words
- **WHEN** the cipher is `ab cd`
- **THEN** the board shows two words, `AB` and `CD`

### Requirement: Each character is a pair
Each character of a word SHALL show as a pair: the cipher character in an outlined box on top, and below it the guess for that letter, or a blank if it has none. Letters SHALL display in uppercase.

#### Scenario: Letter with a guess
- **GIVEN** the cipher `abc` and the guess `b` = `y`
- **WHEN** the board shows
- **THEN** the pairs read `A` over blank, `B` over `Y`, and `C` over blank

#### Scenario: Repeated letter
- **GIVEN** the cipher `aba` and the guess `a` = `x`
- **WHEN** the board shows
- **THEN** both `A` pairs show `X` below

### Requirement: Non-letters pass through
A character that is not a lowercase letter a–z (a digit or punctuation) SHALL show as itself in both rows of its pair. It SHALL NOT be selectable or take a guess.

#### Scenario: Punctuation
- **WHEN** the cipher is `ab.`
- **THEN** the third pair shows `.` above and `.` below

### Requirement: Filled pairs are shaded
The top box of a pair SHALL have a grey background when the bottom row shows something (a guess, or a passed-through non-letter), and no background otherwise.

#### Scenario: Shading follows the guess
- **GIVEN** the cipher `ab` and the guess `a` = `x`
- **WHEN** the board shows
- **THEN** the `A` box is grey and the `B` box is not

### Requirement: Page layout
Every page SHALL show the heading "solve my . codes" and a "View source on GitHub" corner link to `https://github.com/jamiehale/solvemy.codes` that opens in a new tab. While solving, at widths of 768px and up the board SHALL sit on the left with a vertical rule, and the puzzle key panel on the right; below 768px the puzzle key panel SHALL sit under the board.

#### Scenario: Wide screen
- **GIVEN** a 1024px-wide window
- **WHEN** the user is solving
- **THEN** the puzzle key panel is to the right of the board

#### Scenario: Narrow screen
- **GIVEN** a 390px-wide window
- **WHEN** the user is solving
- **THEN** the puzzle key panel is below the board

#### Scenario: Source link
- **WHEN** any page shows
- **THEN** a corner link to the GitHub repository is shown

### Requirement: The look is locked by visual baselines
The setup form, solving with guesses, a selected letter, duplicate guesses, and the narrow layout SHALL match their committed screenshots. A visual change SHALL update the screenshots on purpose, in the same commit.

#### Scenario: Unchanged rendering
- **WHEN** the visual suite runs against an unchanged app
- **THEN** every screenshot matches its baseline
