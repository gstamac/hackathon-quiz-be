import { GameRunnerService } from '../../services/game_runner.service'
import { Game } from '../../interfaces/games.interface'
import { MessangerService } from '../../services/messanger.service'
import { delay } from '../../utils/util'
import { GamesModelInMemory } from '../../models/games.model'
import { v4 } from 'uuid'

afterAll(async () => {
  await delay(500)
})

describe('Testing Game Runners', () => {
  let messanger: MessangerService

  let gameRunner: GameRunnerService

  const game: Game = {
    id: v4(),
    access_token: 'access_token',
    channel_id: 'channel_id',
    name: 'test-game',
    questions: [
      {
        id: v4(),
        question: 'Q1',
        answers: [
          { id: v4(), answer: 'Q1A1', is_correct: false },
          { id: v4(), answer: 'Q1A2', is_correct: false },
          { id: v4(), answer: 'Q1A3', is_correct: true },
        ],
      },
      {
        id: v4(),
        question: 'Q2',
        answers: [
          { id: v4(), answer: 'Q2A1', is_correct: false },
          { id: v4(), answer: 'Q2A2', is_correct: true },
          { id: v4(), answer: 'Q2A3', is_correct: false },
        ],
      },
      {
        id: v4(),
        question: 'Q3',
        answers: [
          { id: v4(), answer: 'Q3A1', is_correct: false },
          { id: v4(), answer: 'Q3A2', is_correct: true },
        ],
      },
    ],
  }

  beforeEach(() => {
    messanger = ({
      sendStartGameInMessage: jest.fn(),
      sendStartGameMessage: jest.fn(),
      sendQuestionMessage: jest.fn(),
      updateQuestionAnswered: jest.fn(),
      updateQuestionTimedout: jest.fn(),
      sendEndOfGameMessage: jest.fn(),
    } as unknown) as MessangerService

    const delayer = {
      delayStartGame: async () => await delay(1),
      delayQuestionCountdown: async () => await delay(200),
    }

    gameRunner = new GameRunnerService(new GamesModelInMemory(), messanger, delayer)
  })

  describe('startGame', () => {
    it('should start a game and send start game message 5 times', async () => {
      await gameRunner.startGame(game)

      await delay(50)

      expect(messanger.sendStartGameInMessage).toBeCalledWith(game)
      expect(messanger.sendStartGameMessage).toBeCalledWith(game)
      expect(messanger.sendQuestionMessage).toBeCalledWith(game, game.questions[0])
    })
  })

  describe('timeoutQuestion', () => {
    it('should timeout a question after coundown finishes', async () => {
      await gameRunner.startGame(game)

      await delay(500)

      expect(messanger.sendQuestionMessage).toBeCalledWith(game, game.questions[0])
      expect(messanger.updateQuestionTimedout).toBeCalledWith(game, game.questions[0])
      expect(messanger.sendQuestionMessage).toBeCalledWith(game, game.questions[1])
    })
  })

  describe('acceptAnswer', () => {
    it('should accept correct answer and send next question', async () => {
      await gameRunner.startGame(game)
      await delay(50)

      await gameRunner.acceptAnswer(game, {
        participant: 'participant1',
        question_id: game.questions[0].id,
        answer_id: game.questions[0].answers[2].id,
        is_correct: true,
      })

      expect(messanger.sendQuestionMessage).toBeCalledWith(game, game.questions[0])
      expect(messanger.updateQuestionAnswered).toBeCalledWith(game, game.questions[0], 'participant1')
      expect(messanger.updateQuestionTimedout).not.toBeCalled()

      await delay(400)

      expect(messanger.updateQuestionTimedout).not.toBeCalledWith(game, game.questions[0])
      expect(messanger.sendQuestionMessage).toBeCalledWith(game, game.questions[1])
    })

    it('should accept incorrect answer and not send next question', async () => {
      await gameRunner.startGame(game)
      await delay(50)

      await gameRunner.acceptAnswer(game, {
        participant: 'participant1',
        question_id: game.questions[0].id,
        answer_id: game.questions[0].answers[0].id,
        is_correct: false,
      })

      expect(messanger.sendQuestionMessage).toBeCalledWith(game, game.questions[0])
      expect(messanger.sendQuestionMessage).not.toBeCalledWith(game, game.questions[1])
      expect(messanger.updateQuestionAnswered).not.toBeCalled()
    })

    it('should accept all correct answer and send end of game', async () => {
      await gameRunner.startGame(game)
      await delay(50)

      await gameRunner.acceptAnswer(game, {
        participant: 'participant1',
        question_id: game.questions[0].id,
        answer_id: game.questions[0].answers[2].id,
        is_correct: true,
      })
      await gameRunner.acceptAnswer(game, {
        participant: 'participant2',
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

      expect(messanger.sendQuestionMessage).toBeCalledWith(game, game.questions[0])
      expect(messanger.updateQuestionAnswered).toBeCalledWith(game, game.questions[0], 'participant1')
      expect(messanger.sendQuestionMessage).toBeCalledWith(game, game.questions[1])
      expect(messanger.updateQuestionAnswered).toBeCalledWith(game, game.questions[1], 'participant2')
      expect(messanger.sendQuestionMessage).toBeCalledWith(game, game.questions[2])
      expect(messanger.updateQuestionAnswered).toBeCalledWith(game, game.questions[2], 'participant1')
      expect(messanger.sendEndOfGameMessage).toBeCalledWith(game, [
        { participant: 'participant1', correct: 2 },
        { participant: 'participant2', correct: 1 },
      ])
    })
  })
})
