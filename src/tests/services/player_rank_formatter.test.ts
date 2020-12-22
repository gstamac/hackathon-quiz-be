import * as rankFormatterService from '../../services/player_rank_formatter'
import { LeaderBoardEntry } from '../../interfaces/games.interface'

describe('Player rank formatter', () => {
  it('format rankings if less than three participants', async () => {
    const leaderBoard: LeaderBoardEntry[] = [
      { participant: 'participant1', correct: 2 },
      { participant: 'participant2', correct: 1 },
    ]

    expect(rankFormatterService.formatPlayerRankText(leaderBoard)).toEqual('participant1 (2), participant2 (1)')
  })

  it('format rankings if more than three participants', async () => {
    const leaderBoard: LeaderBoardEntry[] = [
      { participant: 'participant1', correct: 8 },
      { participant: 'participant2', correct: 6 },
      { participant: 'participant3', correct: 3 },
      { participant: 'participant4', correct: 1 },
    ]

    expect(rankFormatterService.formatPlayerRankText(leaderBoard)).toEqual('participant1 (8), participant2 (6), participant3 (3)')
  })
})
