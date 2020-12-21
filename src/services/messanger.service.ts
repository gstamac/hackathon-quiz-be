import { MESSAGING_URL } from '../config'
import { Game, Question } from '../interfaces/games.interface'
import { init, sendMessage, updateMessage } from './messaging_service'
import { formatQuestionMessage, formatStartGameMessage, formatQuestionAnsweredMessage, formatEndOfGameMessage } from './message_formatter'
import { gameModel } from '../models/games.model'

export class MessangerService {
  constructor() {
    init(MESSAGING_URL)
  }
  public async sendStartGameInMessage(game: Game, time: number): Promise<void> {
    console.dir(game)
    console.dir(time)
  }
  public async sendStartGameMessage(game: Game): Promise<void> {
    const messages = await sendMessage(game.access_token, formatStartGameMessage(game))

    const status = gameModel.getStatus(game.id)
    status.message_id = messages[0].id
  }
  public async sendQuestionMessage(game: Game, question: Question): Promise<void> {
    const messages = await sendMessage(game.access_token, formatQuestionMessage(game, question))

    const status = gameModel.getStatus(game.id)
    status.current_question_message_id = messages[0].id
  }
  public async updateQuestionAnswered(game: Game, question: Question, participant: string): Promise<void> {
    const status = gameModel.getStatus(game.id)
    await updateMessage(game.access_token, { message_id: status.current_question_message_id }, formatQuestionAnsweredMessage(question, participant))
  }
  public async sendEndOfGameMessage(game: Game, winner: string): Promise<void> {
    await sendMessage(game.access_token, formatEndOfGameMessage(game, winner))
  }
}
