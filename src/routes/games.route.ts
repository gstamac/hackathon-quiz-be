import { Router } from 'express'
import { GamesController } from '../controllers/games.controller'
import { CreateGameDto } from '../dtos/games.dto'
import { Route } from '../interfaces/routes.interface'
import { validationMiddleware } from '../middlewares/validation.middleware'

export class GamesRoute implements Route {
  public path = '/games'
  public router = Router()
  public gamesController = new GamesController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.gamesController.getGame)
    this.router.post(`${this.path}`, validationMiddleware(CreateGameDto, 'body'), this.gamesController.createGame)
    // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateGameDto, 'body', true), this.gamesController.updateUser)
    // this.router.delete(`${this.path}/:id(\\d+)`, this.gamesController.deleteUser)
  }
}
