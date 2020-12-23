import * as rankFormatterService from '../../services/player_rank_formatter'
import { LeaderBoardEntry } from '../../interfaces/games.interface'

describe('Player rank formatter', () => {
  it('format rankings if less than three participants', async () => {
    const leaderBoard: LeaderBoardEntry[] = [
      { participant: 'participant1', correct: 2 },
      { participant: 'participant2', correct: 1 },
    ]
    const totalQuestions = 6

    expect(rankFormatterService.formatAfterWinnerRankingText(leaderBoard, totalQuestions)).toEqual('participant2 (1/6)')
  })

  it('format rankings if more than three participants', async () => {
    const leaderBoard: LeaderBoardEntry[] = [
      { participant: 'participant1', correct: 8 },
      { participant: 'participant2', correct: 3 },
      { participant: 'participant3', correct: 2 },
      { participant: 'participant4', correct: 1 },
    ]
    const totalQuestions = 6

    expect(rankFormatterService.formatAfterWinnerRankingText(leaderBoard, totalQuestions)).toEqual('participant2 (3/6)\nparticipant3 (2/6)')
  })
})
