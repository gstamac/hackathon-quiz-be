import supertest from 'supertest'
import { Game } from '../interfaces/games.interface'
import { GamesModel, GamesModelInMemory } from '../models/games.model'
import { delay } from '../utils/util'
import { initTestApp } from './helpers'

afterAll(async () => {
  await delay(500)
})

describe('Testing Answers', () => {
  let gamesModel: GamesModel
  let request: supertest.SuperTest<supertest.Test>

  beforeEach(() => {
    gamesModel = new GamesModelInMemory()
    request = initTestApp(gamesModel)
  })

  describe('[POST] /games/:game_id/answers?question_id=<question_id>&answer_id=<answer_id>&participant=<participant>', () => {
    beforeEach(() => {
      const game: Game = {
        id: 'test-game-id',
        access_token: 'access_token',
        channel_id: 'channel_id',
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

      gamesModel.addGame(game)
    })

    it('response statusCode 201 / created', async () => {
      await request.post(`/games/test-game-id/answers?question_id=test-game-q2&answer_id=test-game-q2-a2&participant=participant1`).send().expect(201)
    })

    it('response statusCode 400 when game was not found', async () => {
      await request
        .post(`/games/wrong-game/answers?question_id=test-game-q2&answer_id=test-game-q2-a2&participant=participant1`)
        .send()
        .expect(400)
        .expect({ message: 'Game not found' })
    })

    it('response statusCode 400 when question was not found', async () => {
      await request
        .post(`/games/test-game-id/answers?question_id=wrong-question&answer_id=test-game-q2-a2&participant=participant1`)
        .send()
        .expect(400)
        .expect({ message: 'Question not found' })
    })

    it('response statusCode 400 when answer was not found', async () => {
      await request
        .post(`/games/test-game-id/answers?question_id=test-game-q2&answer_id=wrong-answer&participant=participant1`)
        .send()
        .expect(400)
        .expect({ message: 'Answer not found' })
    })

    it('response statusCode 400 when question was already answered correctly', async () => {
      await request.post(`/games/test-game-id/answers?question_id=test-game-q1&answer_id=test-game-q1-a3&participant=participant2`)
      await request
        .post(`/games/test-game-id/answers?question_id=test-game-q1&answer_id=test-game-q1-a2&participant=participant1`)
        .send()
        .expect(400)
        .expect({ message: 'Question already answered' })
    })

    it('response statusCode 400 when question was already answered by me', async () => {
      await request.post(`/games/test-game-id/answers?question_id=test-game-q2&answer_id=test-game-q2-a1&participant=participant2`)
      await request
        .post(`/games/test-game-id/answers?question_id=test-game-q2&answer_id=test-game-q2-a2&participant=participant2`)
        .send()
        .expect(400)
        .expect({ message: 'You already answered this question' })
    })
  })
})
