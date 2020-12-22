import { GamesDbService } from '../dao/db'
import { Game, GameStatus, ParticipantAnswer } from '../interfaces/games.interface'

export interface GamesModel {
  init(clear?: boolean): Promise<void>
  addGame(game: Game): Promise<void>
  findGame(game_id: string): Promise<Game | undefined>
  deleteGame(game_id: string): Promise<void>
  createStatus(game_id: string): Promise<GameStatus>
  getStatus(game_id: string): Promise<GameStatus>
  addAnswer(status: GameStatus, answer: ParticipantAnswer): Promise<void>
  nextQuestion(status: GameStatus): Promise<void>
  setWinner(status: GameStatus, winner: string): Promise<void>
  setMessageId(game_id: string, messages_id: string): Promise<void>
  setCurrentQuestionMessageId(game_id: string, messages_id: string): Promise<void>
}

export class GamesModelInMemory implements GamesModel {
  private games: Game[] = []
  private gameStatuses: GameStatus[] = []

  public async init(clear = false): Promise<void> {
    if (clear) {
      this.games = []
      this.gameStatuses = []
    }
  }

  public async addGame(game: Game): Promise<void> {
    this.games.push(game)
  }

  public async findGame(game_id: string): Promise<Game | undefined> {
    return this.games.find(g => g.id === game_id)
  }

  public async deleteGame(game_id: string): Promise<void> {
    const index = this.games.findIndex(g => g.id === game_id)

    if (index >= 0) {
      this.games.splice(index, 1)
    }
  }

  public async createStatus(game_id: string): Promise<GameStatus> {
    const status = {
      game_id,
      current_question: -1,
      participant_answers: [],
    }

    this.gameStatuses.push(status)

    return status
  }

  public async getStatus(game_id: string): Promise<GameStatus> {
    const status = this.gameStatuses.find(s => s.game_id === game_id)

    if (status === undefined) {
      return this, this.createStatus(game_id)
    }

    return status
  }

  public async addAnswer(status: GameStatus, answer: ParticipantAnswer): Promise<void> {
    status.participant_answers.push(answer)
  }

  public async nextQuestion(status: GameStatus): Promise<void> {
    status.current_question++
  }

  public async setWinner(status: GameStatus, winner: string): Promise<void> {
    status.winner = winner
  }

  public async setMessageId(game_id: string, messages_id: string): Promise<void> {
    const status = await this.getStatus(game_id)
    status.message_id = messages_id
  }

  public async setCurrentQuestionMessageId(game_id: string, messages_id: string): Promise<void> {
    const status = await this.getStatus(game_id)
    status.current_question_message_id = messages_id
  }
}

export class GamesModelInDb implements GamesModel {
  private dbService: GamesDbService

  constructor() {
    this.dbService = new GamesDbService()
  }

  public async init(clear = false): Promise<void> {
    await this.dbService.init(clear)
  }

  public async addGame(game: Game): Promise<void> {
    await this.dbService.saveGame(game)
  }

  public async findGame(game_id: string): Promise<Game | undefined> {
    return await this.dbService.getGameById(game_id)
  }

  public async deleteGame(game_id: string): Promise<void> {
    await this.dbService.deleteGameById(game_id)
  }

  public async createStatus(game_id: string): Promise<GameStatus> {
    const status = {
      game_id,
      current_question: -1,
      participant_answers: [],
    }

    await this.dbService.saveGameStatus(status)

    return status
  }

  public async getStatus(game_id: string): Promise<GameStatus> {
    const status = await this.dbService.getGameStatus(game_id)

    if (status === undefined) {
      return await this.createStatus(game_id)
    }

    return status
  }

  public async addAnswer(status: GameStatus, answer: ParticipantAnswer): Promise<void> {
    status.participant_answers.push(answer)
    await this.dbService.updateGameStatus(status)
  }

  public async nextQuestion(status: GameStatus): Promise<void> {
    status.current_question++
    await this.dbService.updateGameStatus(status)
  }

  public async setWinner(status: GameStatus, winner: string): Promise<void> {
    status.winner = winner
    await this.dbService.updateGameStatus(status)
  }

  public async setMessageId(game_id: string, messages_id: string): Promise<void> {
    const status = await this.getStatus(game_id)
    status.message_id = messages_id
    await this.dbService.updateGameStatus(status)
  }

  public async setCurrentQuestionMessageId(game_id: string, messages_id: string): Promise<void> {
    const status = await this.getStatus(game_id)
    status.current_question_message_id = messages_id
    await this.dbService.updateGameStatus(status)
  }
}
