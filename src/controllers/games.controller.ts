import { NextFunction, Request, Response } from 'express'
import { CreateGameDto } from '../dtos/games.dto'
import { Game } from '../interfaces/games.interface'
import { gamesService } from '../services/games.service'

export class GamesController {
  public createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const gameData: CreateGameDto = req.body
      const createGameData: Game = await gamesService.createGame(gameData)
      res.status(201).json({ data: createGameData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }

  public getGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json(await gamesService.getGame(req.params.id))
    } catch (error) {
      next(error)
    }
  }
}
