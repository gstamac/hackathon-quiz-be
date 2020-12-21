import 'dotenv/config'
import App from './app'
import IndexRoute from './routes/index.route'
import GamesRoute from './routes/games.route'
import validateEnv from './utils/validateEnv'

validateEnv()

const app = new App([new IndexRoute(), new GamesRoute()])

app.listen()
