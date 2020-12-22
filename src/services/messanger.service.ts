import { MESSAGING_URL } from '../config'
import { Game, LeaderBoardEntry, Question } from '../interfaces/games.interface'
import { init, sendMessage, updateMessage } from './messaging_service'
import {
  formatMessage,
  formatQuestionMessage,
  formatQuestionAnsweredContent,
  formatEndOfGameMessage,
  formatStartGameContent,
  formatStartGameInContent,
  formatEndOfGameNoAnswersMessage,
  formatQuestionTimedoutContent,
} from './message_formatter'
import { GamesModel } from '../models/games.model'
import { formatAfterWinnerRankingText } from './player_rank_formatter'
import { UpdateMessageContent } from './messaging_interfaces'

export class MessangerService {
  constructor(private gamesModel: GamesModel) {
    init(MESSAGING_URL)
  }

  public async sendStartGameInMessage(game: Game): Promise<void> {
    await this.sendOrUpdateStartGameMessage(game, formatStartGameInContent(5))
  }

  public async sendStartGameMessage(game: Game): Promise<void> {
    await this.sendOrUpdateStartGameMessage(game, formatStartGameContent())
  }

  private async sendOrUpdateStartGameMessage(game: Game, content: UpdateMessageContent): Promise<void> {
    const status = await this.gamesModel.getStatus(game.id)
    if (status.message_id) {
      await updateMessage(game.access_token, { message_id: status.message_id }, content)
    } else {
      const messages = await sendMessage(game.access_token, formatMessage(game, content))
      await this.gamesModel.setMessageId(game.id, messages[0].id)
    }
  }

  public async sendQuestionMessage(game: Game, question: Question): Promise<void> {
    const messages = await sendMessage(game.access_token, formatQuestionMessage(game, question))

    await this.gamesModel.setCurrentQuestionMessageId(game.id, messages[0].id)
  }

  public async updateQuestionAnswered(game: Game, question: Question, participant: string): Promise<void> {
    const status = await this.gamesModel.getStatus(game.id)
    await updateMessage(game.access_token, { message_id: status.current_question_message_id }, formatQuestionAnsweredContent(question, participant))
  }

  public async updateQuestionTimedout(game: Game, question: Question): Promise<void> {
    const status = await this.gamesModel.getStatus(game.id)
    await updateMessage(game.access_token, { message_id: status.current_question_message_id }, formatQuestionTimedoutContent(question))
  }

  public async sendEndOfGameMessage(game: Game, leaderBoard: LeaderBoardEntry[]): Promise<void> {
    if (leaderBoard.length > 0) {
      const afterWinnerRankings: string = formatAfterWinnerRankingText(leaderBoard)
      await sendMessage(game.access_token, formatEndOfGameMessage(game, leaderBoard[0].participant, afterWinnerRankings))
    } else {
      await sendMessage(game.access_token, formatEndOfGameNoAnswersMessage(game))
    }
  }
}
