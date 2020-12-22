import { HttpException } from '../exceptions/HttpException'
import { Game, ParticipantAnswer } from '../interfaces/games.interface'
import { GamesModel } from '../models/games.model'
import { MessangerService } from './messanger.service'

export class GameRunnerService {
  constructor(private gamesModel: GamesModel, private messangerService: MessangerService) {}

  public async startGame(game: Game) {
    this.gamesModel.createStatus(game.id)

    // for (let i = 5; i > 0; i++) {
    //   await this.findGameAndExecute(game_id, async game => {
    //     await this.messangerService.sendStartGameInMessage(game, i)
    //     await delay(second)
    //   })
    // }
    // await this.findGameAndExecute(game_id, async game => {
    await this.messangerService.sendStartGameMessage(game)
    // })

    await this.sendNextQuestion(game)
  }

  public async acceptAnswer(game: Game, answer: ParticipantAnswer) {
    const status = this.gamesModel.getStatus(game.id)
    if (status.participant_answers.some(p => p.question_id === answer.question_id && p.is_correct)) {
      throw new HttpException(400, 'Question already answered')
    }

    if (status.participant_answers.some(p => p.question_id === answer.question_id && p.participant === answer.participant)) {
      throw new HttpException(400, 'You already answered this question')
    }

    this.gamesModel.addAnswer(status, answer)

    if (status.participant_answers.some(p => p.question_id === answer.question_id && p.is_correct)) {
      await this.sendNextQuestion(game, answer)
    }
  }

  private async sendNextQuestion(game: Game, answer?: ParticipantAnswer) {
    const status = this.gamesModel.getStatus(game.id)

    if (answer !== undefined && status.current_question >= 0) {
      await this.messangerService.updateQuestionAnswered(game, game.questions[status.current_question], answer.participant)
    }

    this.gamesModel.nextQuestion(status)

    if (game.questions.length > status.current_question) {
      await this.messangerService.sendQuestionMessage(game, game.questions[status.current_question])
    } else {
      const leaderboard = status.participant_answers
        .filter(a => a.is_correct)
        .reduce((board, a) => {
          const r = board.find(p => p.participant === a.participant)
          if (r !== undefined) {
            r.correct++
          } else {
            board.push({
              participant: a.participant,
              correct: 1,
            })
          }

          return board
        }, [])
        .sort((b1, b2) => b2.correct - b1.correct)

      await this.messangerService.sendEndOfGameMessage(game, leaderboard)
    }
  }

  // private async findGameAndExecute<T>(game_id: string, task: (game: Game) => Promise<T>): Promise<T> {
  //   const game: Game | undefined = gamesModel.findGame(game_id)
  //   if (game === undefined) {
  //     return
  //   }

  //   return await task(game)
  // }
}
