import supertest from 'supertest'
import nock from 'nock'
import { App } from '../app'
import { GamesRoute } from '../routes/games.route'
import { CreateGameDto } from '../dtos/games.dto'
import { delay } from '../utils/util'
import { AnswersRoute } from '../routes/answers.route'
import { MESSAGING_URL } from '../config'
import { Game } from '../interfaces/games.interface'
import { gameModel } from '../models/games.model'

afterAll(async () => {
  await delay(500)
})

describe('Testing Games', () => {
  describe('[POST] /games', () => {
    let request: supertest.SuperTest<supertest.Test>

    beforeEach(() => {
      const app = new App([new GamesRoute(), new AnswersRoute()])
      request = supertest(app.getServer())
      nock(`${MESSAGING_URL}`)
        .post('/v1/messages')
        .reply(200, [{ id: 'message-id' }])
        .persist()
      nock(`${MESSAGING_URL}`)
        .put('/v1/message-cards')
        .reply(200, [{ id: 'message-id' }])
        .persist()
    })

    it('response statusCode 201 / created', async () => {
      const gameData: CreateGameDto = {
        name: 'test-game',
        access_token: 'access_token',
        channel_id: 'channel_id',
        questions: [
          {
            question: 'Q1',
            answers: [{ answer: 'Q1A1' }, { answer: 'Q1A2' }, { answer: 'Q1A3', is_correct: true }],
          },
          {
            question: 'Q2',
            answers: [{ answer: 'Q2A1' }, { answer: 'Q2A2', is_correct: true }, { answer: 'Q1A3' }],
          },
          {
            question: 'Q3',
            answers: [{ answer: 'Q3A1' }, { answer: 'Q3A2', is_correct: true }],
          },
        ],
      }
      await request.post('/games').send(gameData).expect(201)
    })
  })

  describe('[GET] /games/:game_id', () => {
    let request: supertest.SuperTest<supertest.Test>

    const game: Game = {
      id: 'test-game-id',
      access_token: 'access_token',
      channel_id: 'channel_id',
      name: 'test-game',
      questions: [],
    }

    beforeEach(() => {
      const app = new App([new GamesRoute(), new AnswersRoute()])
      request = supertest(app.getServer())
      nock(`${MESSAGING_URL}`)
        .post('/v1/messages')
        .reply(200, [{ id: 'message-id' }])
        .persist()
      nock(`${MESSAGING_URL}`)
        .put('/v1/message-cards')
        .reply(200, [{ id: 'message-id' }])
        .persist()

      gameModel.clear()

      gameModel.addGame(game)
    })

    it('response statusCode 200', async () => {
      await request.get('/games/test-game-id').expect(200, game)
    })
  })

  describe('[DELETE] /games/:game_id', () => {
    let request: supertest.SuperTest<supertest.Test>

    const game: Game = {
      id: 'test-game-id',
      access_token: 'access_token',
      channel_id: 'channel_id',
      name: 'test-game',
      questions: [],
    }

    beforeEach(() => {
      const app = new App([new GamesRoute(), new AnswersRoute()])
      request = supertest(app.getServer())
      nock(`${MESSAGING_URL}`)
        .post('/v1/messages')
        .reply(200, [{ id: 'message-id' }])
        .persist()
      nock(`${MESSAGING_URL}`)
        .put('/v1/message-cards')
        .reply(200, [{ id: 'message-id' }])
        .persist()

      gameModel.clear()

      gameModel.addGame(game)
    })

    it('response statusCode 204', async () => {
      await request.delete('/games/test-game-id').expect(204)

      expect(gameModel.findGame('test-game-id')).toBeUndefined()
    })
  })
})
