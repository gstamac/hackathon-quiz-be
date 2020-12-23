import { LeaderBoardEntry } from '../interfaces/games.interface'

export function formatAfterWinnerRankingText(leaderBoard: LeaderBoardEntry[], totalQuestions: number): string {
  const rankTexts: string[] = leaderBoard.map(e => `${e.participant} (${e.correct}/${totalQuestions})`)

  return rankTexts.slice(1, 3).join('\n')
}
