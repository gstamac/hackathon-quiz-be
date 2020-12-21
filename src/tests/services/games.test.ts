import { GameRunnerService } from '../../services/game_runner.service'
import { MessangerService } from '../../services/messanger.service'
import { delay } from '../../utils/util'
import { GamesService } from '../../services/games.service'
import { CreateGameDto } from '../../dtos/games.dto'

afterAll(async () => {
  await delay(500)
})

describe('Testing Game Runners', () => {
  let gameRunner: GameRunnerService

  let messanger: MessangerService

  let gamesService: GamesService

  const gameDto: CreateGameDto = {
    name: 'test-game',
    questions: [
      {
        question: 'Q1',
        answers: [
          { answer: 'Q1A1', is_correct: false },
          { answer: 'Q1A2', is_correct: false },
          { answer: 'Q1A3', is_correct: true },
        ],
      },
      {
        question: 'Q2',
        answers: [
          { answer: 'Q2A1', is_correct: false },
          { answer: 'Q2A2', is_correct: true },
          { answer: 'Q2A3', is_correct: false },
        ],
      },
      {
        question: 'Q3',
        answers: [
          { answer: 'Q3A1', is_correct: false },
          { answer: 'Q3A2', is_correct: true },
        ],
      },
    ],
  }

  beforeEach(() => {
    gameRunner = ({
      startGame: jest.fn(),
      acceptAnswer: jest.fn(),
    } as unknown) as GameRunnerService

    messanger = {
      sendStartGameInMessage: jest.fn(),
      sendStartGameMessage: jest.fn(),
      sendQuestionMessage: jest.fn(),
      updateQuestionAnswer: jest.fn(),
      sendEndOfGameMessage: jest.fn(),
    }

    gamesService = new GamesService(gameRunner, messanger)
  })

  describe('createGame', () => {
    it('should create a game and start it', async () => {
      const game = await gamesService.createGame(gameDto)

      expect(gameRunner.startGame).toBeCalledWith(game)
    })
  })

  describe('createParticipantAnswer', () => {
    it('should create a game and start it', async () => {
      const game = await gamesService.createGame(gameDto)
      const answer = await gamesService.createParticipantAnswer(game.id, {
        question_id: game.questions[1].id,
        answer_id: game.questions[1].answers[1].id,
        participant: 'participant1',
      })

      expect(gameRunner.acceptAnswer).toBeCalledWith(game, answer)
    })
  })
})
