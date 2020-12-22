import { MESSAGING_URL } from '../config'
import { Game, LeaderBoardEntry, Question } from '../interfaces/games.interface'
import { init, sendMessage, updateMessage } from './messaging_service'
import {
  formatQuestionMessage,
  formatStartGameMessage,
  formatQuestionAnsweredMessage,
  formatEndOfGameMessage,
  formatEndOfGameNoAnswersMessage,
} from './message_formatter'
import { GamesModel } from '../models/games.model'
import { formatPlayerRankText } from './player_rank_formatter'

export class MessangerService {
  constructor(private gamesModel: GamesModel) {
    init(MESSAGING_URL)
  }
  public async sendStartGameInMessage(game: Game, time: number): Promise<void> {
    console.dir(game)
    console.dir(time)
  }
  public async sendStartGameMessage(game: Game): Promise<void> {
    const messages = await sendMessage(game.access_token, formatStartGameMessage(game))

    this.gamesModel.setMessageId(game.id, messages[0].id)
  }
  public async sendQuestionMessage(game: Game, question: Question): Promise<void> {
    const messages = await sendMessage(game.access_token, formatQuestionMessage(game, question))

    this.gamesModel.setCurrentQuestionMessageId(game.id, messages[0].id)
  }
  public async updateQuestionAnswered(game: Game, question: Question, participant: string): Promise<void> {
    const status = this.gamesModel.getStatus(game.id)
    await updateMessage(game.access_token, { message_id: status.current_question_message_id }, formatQuestionAnsweredMessage(question, participant))
  }
  public async sendEndOfGameMessage(game: Game, leaderBoard: LeaderBoardEntry[]): Promise<void> {
    if (leaderBoard.length > 0) {
      const rankingsText: string = formatPlayerRankText(leaderBoard)
      await sendMessage(game.access_token, formatEndOfGameMessage(game, rankingsText))
    } else {
      await sendMessage(game.access_token, formatEndOfGameNoAnswersMessage(game))
    }
  }
}
