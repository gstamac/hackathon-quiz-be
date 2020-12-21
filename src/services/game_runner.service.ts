import { HttpException } from '../exceptions/HttpException'
import { Game, ParticipantAnswer } from '../interfaces/games.interface'
import { gameModel } from '../models/games.model'
import { MessangerService } from './messanger.service'

export class GameRunnerService {
  constructor(private messangerService: MessangerService) {}

  public async startGame(game: Game) {
    gameModel.createStatus(game.id)

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
    const status = gameModel.getStatus(game.id)
    if (status.participantAnswers.some(p => p.question_id === answer.question_id && p.is_correct)) {
      throw new HttpException(400, 'Question already answered')
    }

    if (status.participantAnswers.some(p => p.question_id === answer.question_id && p.participant === answer.participant)) {
      throw new HttpException(400, 'You already answered this question')
    }

    status.participantAnswers.push(answer)

    if (status.participantAnswers.some(p => p.question_id === answer.question_id && p.is_correct)) {
      await this.sendNextQuestion(game, answer)
    }
  }

  private async sendNextQuestion(game: Game, answer?: ParticipantAnswer) {
    const status = gameModel.getStatus(game.id)

    if (answer !== undefined) {
      await this.messangerService.updateQuestionAnswered(game, game.questions[status.current_question], answer.participant)
    }

    status.current_question++

    if (game.questions.length > status.current_question) {
      await this.messangerService.sendQuestionMessage(game, game.questions[status.current_question])
    } else {
      const leaderboard = status.participantAnswers
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

      await this.messangerService.sendEndOfGameMessage(game, leaderboard[0].participant)
    }
  }

  // private async findGameAndExecute<T>(game_id: string, task: (game: Game) => Promise<T>): Promise<T> {
  //   const game: Game | undefined = gameModel.findGame(game_id)
  //   if (game === undefined) {
  //     return
  //   }

  //   return await task(game)
  // }
}
