import { CreateGameDto, CreateParticipantAnswerDto } from '../dtos/games.dto'
import { HttpException } from '../exceptions/HttpException'
import { Answer, Game, ParticipantAnswer, Question } from '../interfaces/games.interface'
import { GamesModel } from '../models/games.model'
import { isEmpty } from '../utils/util'
import { v4 } from 'uuid'
import { GameRunnerService } from './game_runner.service'

export class GamesService {
  constructor(private gamesModel: GamesModel, private gameRunnerService: GameRunnerService) {}

  public async createGame(gameData: CreateGameDto): Promise<Game> {
    if (isEmpty(gameData)) throw new HttpException(400, 'Game data missing')

    const game: Game = {
      id: v4(),
      access_token: gameData.access_token,
      channel_id: gameData.channel_id,
      name: gameData.name,
      questions: gameData.questions.map(q => ({
        id: v4(),
        question: q.question,
        answers: q.answers.map(a => ({
          id: v4(),
          answer: a.answer,
          is_correct: a.is_correct ?? false,
        })),
        participantAnswers: [],
      })),
    }

    await this.gamesModel.addGame(game)

    await this.gameRunnerService.startGame(game)

    return game
  }

  public async getGame(game_id: string): Promise<Game> {
    const game: Game | undefined = await this.gamesModel.findGame(game_id)
    if (game === undefined) {
      throw new HttpException(400, 'Game not found')
    }

    return game
  }

  public async deleteGame(game_id: string): Promise<void> {
    await this.gamesModel.deleteGame(game_id)
  }

  public async createParticipantAnswer(game_id: string, answerData: CreateParticipantAnswerDto): Promise<ParticipantAnswer> {
    if (isEmpty(answerData)) {
      throw new HttpException(400, 'Answer data missing')
    }

    const game: Game | undefined = await this.gamesModel.findGame(game_id)
    if (game === undefined) {
      throw new HttpException(400, 'Game not found')
    }

    const question: Question | undefined = game.questions.find(q => q.id === answerData.question_id)
    if (question === undefined) {
      throw new HttpException(400, `Question not found`)
    }

    const answer: Answer | undefined = question.answers.find(a => a.id === answerData.answer_id)
    if (answer === undefined) {
      throw new HttpException(400, 'Answer not found')
    }

    const participantAnswer: ParticipantAnswer = {
      participant: answerData.participant,
      question_id: question.id,
      answer_id: answer.id,
      is_correct: answer.is_correct,
    }

    await this.gameRunnerService.acceptAnswer(game, participantAnswer)

    return participantAnswer
  }
}
