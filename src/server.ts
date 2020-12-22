import 'dotenv/config'
import { App } from './app'
import { IndexRoute } from './routes/index.route'
import { GamesRoute } from './routes/games.route'
import { validateEnv } from './utils/validateEnv'
import { AnswersRoute } from './routes/answers.route'
import { MessangerService } from './services/messanger.service'
import { GamesService } from './services/games.service'
import { GameRunnerService } from './services/game_runner.service'
import { GamesModel, GamesModelInDb } from './models/games.model'
import { GamesController } from './controllers/games.controller'
import { AnswersController } from './controllers/answers.controller'
import { delayer } from './utils/util'

validateEnv()

const gamesModel: GamesModel = new GamesModelInDb()
const messangerService = new MessangerService(gamesModel)
const gamesService = new GamesService(gamesModel, new GameRunnerService(gamesModel, messangerService, delayer))

const app = new App([new IndexRoute(), new GamesRoute(new GamesController(gamesService)), new AnswersRoute(new AnswersController(gamesService))])

app.listen()
