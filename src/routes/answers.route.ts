import { Router } from 'express'
import { AnswersController } from '../controllers/answers.controller'
import { Route } from '../interfaces/routes.interface'

export class AnswersRoute implements Route {
  public path = '/games/:game_id/answers'
  public router = Router()
  public answersController = new AnswersController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.answersController.createAnswer)
  }
}
