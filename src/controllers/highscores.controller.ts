import { NextFunction, Request, Response } from 'express'
import { logger } from '../utils/logger'
import { HighscoreService } from '../services/highscore.service'
import { AddMessageBody } from '../services/messaging_interfaces'
import { sendMessage } from '../services/messaging_service'

export class HighscoresController {
  constructor(private highscoresService: HighscoreService) {}

  public generateHighscores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const channelId: string = req.params.channel_id
      const stats: Map<string, number>[] = await this.highscoresService.fetchStats(channelId)
      const builtMessage: AddMessageBody = this.highscoresService.buildStatsMessage(stats, channelId)

      await sendMessage(req.body.access_token, builtMessage)

      res.status(201)
    } catch (error) {
      logger.error(error)
      next(error)
    }
  }
}
