// Possible outcomes of a single bet
export type BetResult = 'Pending' | 'Won' | 'Lost' | 'Void'

// Possible bet market values — maps to the match outcome market
// biome-ignore format: keep vertical alignment
export type MarketValue
  = | 'Under 0.5'
    | 'Under 1.5'
    | 'Under 2.5'
    | 'Under 3.5'
    | 'Under 4.5'
    | 'Over 0.5'
    | 'Over 1.5'
    | 'Over 2.5'
    | 'Over 3.5'
    | 'Over 4.5'
    | 'Yes'
    | 'No'

/**
 * A single resolved or pending bet placed by a character.
 */
export interface Bet {
  // Unique identifier
  id: string
  // Match start time, ISO-8601 string — formatted locally in the component
  matchStartsAt: string
  // League display string, e.g. "England/Premier League"
  league: string
  // Home team name
  homeTeam: string
  // Away team name
  awayTeam: string
  // Market label displayed to the user, e.g. "Over 2.5"
  marketValue: MarketValue
  // Decimal odd at the time of bet placement
  odd: number
  // Stake amount in USD
  stake: number
  // Bet settlement result — null while pending
  result: BetResult
}

/**
 * Aggregated statistics for a character.
 */
export interface CharacterStats {
  // Ordered array of the last N bet results, most recent last
  lastBets: BetResult[]
  // Total number of bets placed across all time
  betsPlaced: number
  // Average decimal odds across all bets
  avgOdds: number
  // Yield percentage, e.g. 18.2 means +18.2%
  yield: number
  // Net profit in USD (positive = profit, negative = loss)
  profit: number
}

/**
 * Full character data passed to the CharacterCard and its children.
 */
export interface Character {
  // Unique identifier
  id: string
  // Display name
  name: string
  // URL to the character's avatar image
  avatarUrl: string
  // Aggregated performance statistics
  stats: CharacterStats
  // List of bets to display in the bets feed
  bets: Bet[]
}
