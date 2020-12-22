import supertest from 'supertest'
import nock from 'nock'
import { App } from '../app'
import { GamesController } from '../controllers/games.controller'
import { GamesModel } from '../models/games.model'
import { AnswersRoute } from '../routes/answers.route'
import { GamesRoute } from '../routes/games.route'
import { GamesService } from '../services/games.service'
import { MESSAGING_URL } from '../config'
import { GameRunnerService } from '../services/game_runner.service'
import { MessangerService } from '../services/messanger.service'
import { AnswersController } from '../controllers/answers.controller'

export function initTestApp(gamesModel: GamesModel): supertest.SuperTest<supertest.Test> {
  const messangerService = new MessangerService(gamesModel)
  const gamesService = new GamesService(
    gamesModel,
    new GameRunnerService(gamesModel, messangerService, { delay: jest.fn().mockResolvedValue(undefined) }),
  )

  const app = new App([new GamesRoute(new GamesController(gamesService)), new AnswersRoute(new AnswersController(gamesService))])
  const request = supertest(app.getServer())

  nock(`${MESSAGING_URL}`)
    .post('/v1/messages')
    .reply(200, [{ id: 'message-id' }])
    .persist()
  nock(`${MESSAGING_URL}`)
    .put('/v1/message-cards/message-id')
    .reply(200, [{ id: 'message-id' }])
    .persist()

  return request
}
