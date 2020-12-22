import { LeaderBoardEntry } from '../interfaces/games.interface'

export function formatAfterWinnerRankingText(leaderBoard: LeaderBoardEntry[]): string {
  const rankTexts: string[] = leaderBoard.map(e => `${e.participant} (${e.correct})`)

  return rankTexts.slice(1, 3).join(', ')
}
