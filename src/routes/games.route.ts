import { Router } from 'express'
import { GamesController } from '../controllers/games.controller'
import { CreateGameDto } from '../dtos/games.dto'
import { Route } from '../interfaces/routes.interface'
import { validationMiddleware } from '../middlewares/validation.middleware'

export class GamesRoute implements Route {
  public path = '/games'
  public router = Router()

  constructor(private gamesController: GamesController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.gamesController.getGame)
    this.router.post(`${this.path}`, validationMiddleware(CreateGameDto, 'body'), this.gamesController.createGame)
    this.router.delete(`${this.path}/:id`, this.gamesController.deleteGame)
  }
}
