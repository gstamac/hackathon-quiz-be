import { Game, GameStatus } from '../interfaces/games.interface'

class GameModel {
  private games: Game[] = []
  private gameStatuses: GameStatus[] = []

  public addGame(game: Game) {
    this.games.push(game)
  }

  public clear() {
    this.games = []
    this.gameStatuses = []
  }

  public findGame(game_id: string): Game | undefined {
    return this.games.find(g => g.id === game_id)
  }

  public createStatus(game_id: string): GameStatus {
    const status = {
      game_id,
      current_question: -1,
      participantAnswers: [],
    }

    this.gameStatuses.push(status)

    return status
  }

  public getStatus(game_id: string): GameStatus {
    const status = this.gameStatuses.find(s => s.game_id === game_id)

    if (status === undefined) {
      return this, this.createStatus(game_id)
    }

    return status
  }
}

export const gameModel: GameModel = new GameModel()
