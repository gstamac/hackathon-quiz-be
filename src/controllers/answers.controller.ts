import { NextFunction, Request, Response } from 'express'
import { CreateParticipantAnswerDto } from '../dtos/games.dto'
import { gamesService } from '../services/games.service'
import { ParticipantAnswer } from '../services/game_runner.service'

export class AnswersController {
  public createAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const answerData: CreateParticipantAnswerDto = {
        question_id: req.query['question_id'] as string,
        answer_id: req.query['answer_id'] as string,
        participant: req.query['participant'] as string,
      }
      const participantAnswer: ParticipantAnswer = await gamesService.createParticipantAnswer(req.params.game_id, answerData)
      res.status(201).json({ data: participantAnswer, message: 'created' })
    } catch (error) {
      next(error)
    }
  }
}
