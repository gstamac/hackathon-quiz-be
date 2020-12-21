import request from 'supertest'
import { App } from '../app'
import { IndexRoute } from '../routes/index.route'
import { delay } from '../utils/util'

afterAll(async () => {
  await delay(500)
})

describe('Testing Index', () => {
  describe('[GET] /', () => {
    it('response statusCode 200', async () => {
      const indexRoute = new IndexRoute()
      const app = new App([indexRoute])

      await request(app.getServer()).get(`${indexRoute.path}`).expect(200)
    })
  })
})
