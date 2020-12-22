import { LeaderBoardEntry } from '../interfaces/games.interface'

export function formatPlayerRankText(leaderBoard: LeaderBoardEntry[]): string {
  const rankTexts: string[] = leaderBoard.map(e => `${e.participant} (${e.correct})`)

  return rankTexts.slice(0, 3).join(', ')
}
