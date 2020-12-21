import { GameRunnerService } from '../../services/game_runner.service'
import { Game } from '../../interfaces/games.interface'
import { MessangerService } from '../../services/messanger.service'
import { delay } from '../../utils/util'
import { gameModel } from '../../models/games.model'

afterAll(async () => {
  await delay(500)
})

describe('Testing Game Runners', () => {
  let messanger: MessangerService

  let gameRunner: GameRunnerService

  const game: Game = {
    id: 'test-game-id',
    name: 'test-game',
    questions: [
      {
        id: 'test-game-q1',
        question: 'Q1',
        answers: [
          { id: 'test-game-q1-a1', answer: 'Q1A1', is_correct: false },
          { id: 'test-game-q1-a2', answer: 'Q1A2', is_correct: false },
          { id: 'test-game-q1-a3', answer: 'Q1A3', is_correct: true },
        ],
      },
      {
        id: 'test-game-q2',
        question: 'Q2',
        answers: [
          { id: 'test-game-q2-a1', answer: 'Q2A1', is_correct: false },
          { id: 'test-game-q2-a2', answer: 'Q2A2', is_correct: true },
          { id: 'test-game-q2-a3', answer: 'Q2A3', is_correct: false },
        ],
      },
      {
        id: 'test-game-q3',
        question: 'Q3',
        answers: [
          { id: 'test-game-q3-a1', answer: 'Q3A1', is_correct: false },
          { id: 'test-game-q3-a2', answer: 'Q3A2', is_correct: true },
        ],
      },
    ],
  }

  beforeEach(() => {
    messanger = {
      sendStartGameInMessage: jest.fn(),
      sendStartGameMessage: jest.fn(),
      sendQuestionMessage: jest.fn(),
      updateQuestionAnswer: jest.fn(),
      sendEndOfGameMessage: jest.fn(),
    }

    gameRunner = new GameRunnerService(messanger)

    gameModel.clear()
  })

  describe('startGame', () => {
    it('should start a game and send start game message 5 times', async () => {
      await gameRunner.startGame(game)

      await delay(10)

      // expect(messanger.sendStartGameInMessage).toBeCalledWith(game, 5)
      // expect(messanger.sendStartGameInMessage).toBeCalledWith(game, 4)
      // expect(messanger.sendStartGameInMessage).toBeCalledWith(game, 3)
      // expect(messanger.sendStartGameInMessage).toBeCalledWith(game, 2)
      // expect(messanger.sendStartGameInMessage).toBeCalledWith(game, 1)
      expect(messanger.sendStartGameMessage).toBeCalledWith(game)
      expect(messanger.sendQuestionMessage).toBeCalledWith(game.questions[0])
    })
  })

  describe('acceptAnswer', () => {
    it('should accept correct answer and send next question', async () => {
      await gameRunner.startGame(game)
      await gameRunner.acceptAnswer(game, {
        participant: 'participant1',
        question_id: game.questions[0].id,
        answer_id: game.questions[0].answers[2].id,
        is_correct: true,
      })

      await delay(10)

      expect(messanger.sendQuestionMessage).toBeCalledWith(game.questions[0])
      expect(messanger.updateQuestionAnswer).toBeCalledWith(game.questions[0], 'participant1')
      expect(messanger.sendQuestionMessage).toBeCalledWith(game.questions[1])
    })

    it('should accept incorrect answer and not send next question', async () => {
      await gameRunner.startGame(game)
      await gameRunner.acceptAnswer(game, {
        participant: 'participant1',
        question_id: game.questions[0].id,
        answer_id: game.questions[0].answers[0].id,
        is_correct: false,
      })

      await delay(10)

      expect(messanger.sendQuestionMessage).toBeCalledWith(game.questions[0])
      expect(messanger.sendQuestionMessage).not.toBeCalledWith(game.questions[1])
      expect(messanger.updateQuestionAnswer).not.toBeCalled()
    })

    it('should accept all correct answer and send end of game', async () => {
      await gameRunner.startGame(game)
      await gameRunner.acceptAnswer(game, {
        participant: 'participant1',
        question_id: game.questions[0].id,
        answer_id: game.questions[0].answers[2].id,
        is_correct: true,
      })
      await gameRunner.acceptAnswer(game, {
        participant: 'participant1',
        question_id: game.questions[1].id,
        answer_id: game.questions[1].answers[1].id,
        is_correct: true,
      })
      await gameRunner.acceptAnswer(game, {
        participant: 'participant1',
        question_id: game.questions[2].id,
        answer_id: game.questions[2].answers[1].id,
        is_correct: true,
      })

      await delay(10)

      expect(messanger.sendQuestionMessage).toBeCalledWith(game.questions[0])
      expect(messanger.updateQuestionAnswer).toBeCalledWith(game.questions[0], 'participant1')
      expect(messanger.sendQuestionMessage).toBeCalledWith(game.questions[1])
      expect(messanger.updateQuestionAnswer).toBeCalledWith(game.questions[1], 'participant1')
      expect(messanger.sendQuestionMessage).toBeCalledWith(game.questions[2])
      expect(messanger.updateQuestionAnswer).toBeCalledWith(game.questions[2], 'participant1')
      expect(messanger.sendEndOfGameMessage).toBeCalledWith(game)
    })
  })
})
