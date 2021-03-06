import supertest from 'supertest'
import { CreateGameDto } from '../dtos/games.dto'
import { delay } from '../utils/util'
import { Game } from '../interfaces/games.interface'
import { initTestApp } from './helpers'
import { GamesModel, GamesModelInDb } from '../models/games.model'
import { v4 } from 'uuid'

afterAll(async () => {
  await delay(500)
})

describe('Testing Games', () => {
  let gamesModel: GamesModel
  let request: supertest.SuperTest<supertest.Test>

  beforeEach(async () => {
    gamesModel = new GamesModelInDb()
    await gamesModel.init()
    request = initTestApp(gamesModel)
  })

  describe('[POST] /games', () => {
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
    const game: Game = {
      id: v4(),
      access_token: 'access_token',
      channel_id: 'channel_id',
      name: 'test-game',
      questions: [],
    }

    beforeEach(async () => {
      await gamesModel.addGame(game)

      await delay(500)
    })

    it('response statusCode 200', async () => {
      await request.get(`/games/${game.id}`).expect(200, game)
    })
  })

  describe('[DELETE] /games/:game_id', () => {
    const game: Game = {
      id: v4(),
      access_token: 'access_token',
      channel_id: 'channel_id',
      name: 'test-game',
      questions: [],
    }

    beforeEach(async () => {
      await gamesModel.addGame(game)

      await delay(500)
    })

    it('response statusCode 204', async () => {
      await request.delete(`/games/${game.id}`).expect(204)

      expect(await gamesModel.findGame(game.id)).toBeUndefined()
    })
  })
})
