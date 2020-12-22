import { NextFunction, Request, Response } from 'express'
import { CreateGameDto } from '../dtos/games.dto'
import { Game } from '../interfaces/games.interface'
import { GamesService } from '../services/games.service'

export class GamesController {
  constructor(private gamesService: GamesService) {}

  public createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const gameData: CreateGameDto = req.body
      const createGameData: Game = await this.gamesService.createGame(gameData)
      res.status(201).json({ data: createGameData, message: 'created' })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public getGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(await this.gamesService.getGame(req.params.id))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public deleteGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(204).json(await this.gamesService.deleteGame(req.params.id))
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
