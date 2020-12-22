import { NextFunction, Request, Response } from 'express'
import { CreateParticipantAnswerDto } from '../dtos/games.dto'
import { ParticipantAnswer } from '../interfaces/games.interface'
import { GamesService } from '../services/games.service'
import { logger } from '../utils/logger'

export class AnswersController {
  constructor(private gamesService: GamesService) {}

  public createAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const answerData: CreateParticipantAnswerDto = {
        question_id: req.query['question_id'] as string,
        answer_id: req.query['answer_id'] as string,
        participant: req.query['participant'] as string,
      }
      const participantAnswer: ParticipantAnswer = await this.gamesService.createParticipantAnswer(req.params.game_id, answerData)
      res.status(201).json({ data: participantAnswer, message: 'created' })
    } catch (error) {
      logger.error(error)
      next(error)
    }
  }
}
