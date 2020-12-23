import { ParticipantAnswer } from '../interfaces/games.interface'
import { GamesModelInDb } from '../models/games.model'
import { formatStatsMessage } from './message_formatter'
import { AddMessageBody } from './messaging_interfaces'

export class HighscoreService {
  constructor(private gamesModel: GamesModelInDb) {}

  public async fetchStats(channel_id: string): Promise<Map<string, number>[]> {
    const totalAnswers: Map<string, number> = new Map<string, number>()
    const allAnswers: ParticipantAnswer[] = await this.gamesModel.getChannelAnswers(channel_id)
    // eslint-disable-next-line prefer-spread
    const allAnswersFlattened: ParticipantAnswer[] = [].concat.apply([], allAnswers)
    allAnswersFlattened.map((a: ParticipantAnswer) => {
      if (!totalAnswers.has(a.participant)) {
        totalAnswers.set(a.participant, 0)
      }

      if (a.is_correct) {
        totalAnswers.set(a.participant, totalAnswers.get(a.participant) + 1)
      }
    })

    const sortedTotalAnswers = new Map([...totalAnswers.entries()].sort((a, b) => b[1] - a[1]))

    const totalWins: Map<string, number> = new Map<string, number>()
    const allWinners: string[] = await this.gamesModel.getGameWins(channel_id)

    allWinners.map((p: string) => {
      if (p === undefined) return

      if (!totalWins.has(p)) {
        totalWins.set(p, 1)
        return
      }
      totalWins.set(p, totalAnswers.get(p) + 1)
    })

    const sortedTotalWins = new Map([...totalWins.entries()].sort((a, b) => b[1] - a[1]))

    return [sortedTotalAnswers, sortedTotalWins]
  }

  public buildStatsMessage(statsMap: Map<string, number>[], channelId: string): AddMessageBody {
    let msg = ``
    let i = 0

    if (statsMap[0].size > 0) {
      msg += `<h3>Correct answers:</h3>\n`
      for (const [key, value] of statsMap[0].entries()) {
        if (i > 2) break
        msg += `${key} - ${value}\n`
        i++
      }
    }

    if (statsMap[1].size > 0) {
      i = 0
      msg += `\n<h3>Most wins:</h3>\n`
      for (const [key, value] of statsMap[1].entries()) {
        if (i > 2) break
        msg += `${key} - ${value}\n`
        i++
      }
    }

    return formatStatsMessage(msg, channelId)
  }
}
