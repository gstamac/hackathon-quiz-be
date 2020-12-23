import { Router } from 'express'
import { HighscoresController } from '../controllers/highscores.controller'
import { Route } from '../interfaces/routes.interface'

export class HighscoresRoute implements Route {
  public path = '/highscores/:channel_id'
  public router = Router()

  constructor(private highscoresController: HighscoresController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.highscoresController.generateHighscores)
  }
}
