import { NextFunction, Request, Response } from 'express'
import { logger } from '../utils/logger'

export class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.sendStatus(200)
    } catch (error) {
      logger.error(error)
      next(error)
    }
  }
}
