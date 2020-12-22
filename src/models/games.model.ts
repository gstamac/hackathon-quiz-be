import { GamesDbService } from '../dao/db'
import { Game, GameStatus, ParticipantAnswer } from '../interfaces/games.interface'

export interface GamesModel {
  addGame(game: Game)
  findGame(game_id: string): Game | undefined
  deleteGame(game_id: string): void
  createStatus(game_id: string): GameStatus
  getStatus(game_id: string): GameStatus
  addAnswer(status: GameStatus, answer: ParticipantAnswer)
  nextQuestion(status: GameStatus)
  setWinner(status: GameStatus, winner: string)
  setMessageId(game_id: string, messages_id: string)
  setCurrentQuestionMessageId(game_id: string, messages_id: string)
}

export class GamesModelInMemory implements GamesModel {
  private games: Game[] = []
  private gameStatuses: GameStatus[] = []

  public addGame(game: Game) {
    this.games.push(game)
  }

  public findGame(game_id: string): Game | undefined {
    return this.games.find(g => g.id === game_id)
  }

  public deleteGame(game_id: string): void {
    const index = this.games.findIndex(g => g.id === game_id)

    if (index >= 0) {
      this.games.splice(index, 1)
    }
  }

  public createStatus(game_id: string): GameStatus {
    const status = {
      game_id,
      current_question: -1,
      participant_answers: [],
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

  public addAnswer(status: GameStatus, answer: ParticipantAnswer) {
    status.participant_answers.push(answer)
  }

  public nextQuestion(status: GameStatus) {
    status.current_question++
  }

  public setWinner(status: GameStatus, winner: string) {
    status.winner = winner
  }

  public setMessageId(game_id: string, messages_id: string) {
    const status = this.getStatus(game_id)
    status.message_id = messages_id
  }

  public setCurrentQuestionMessageId(game_id: string, messages_id: string) {
    const status = this.getStatus(game_id)
    status.current_question_message_id = messages_id
  }
}

export class GamesModelInDb implements GamesModel {
  private dbService: GamesDbService

  constructor(clear = false) {
    this.dbService = new GamesDbService()
    this.dbService.init(clear).then()
  }

  public addGame(game: Game) {
    this.dbService.saveGame(game).then()
  }

  public findGame(game_id: string): Game | undefined {
    return this.dbService.getGameById(game_id)
  }

  public deleteGame(game_id: string): void {
    this.dbService.deleteGameById(game_id).then()
  }

  public createStatus(game_id: string): GameStatus {
    const status = {
      game_id,
      current_question: -1,
      participant_answers: [],
    }

    this.dbService.saveGameStatus(status).then()

    return status
  }

  public getStatus(game_id: string): GameStatus {
    const status = this.dbService.getGameStatus(game_id)

    if (status === undefined) {
      return this, this.createStatus(game_id)
    }

    return status
  }

  public addAnswer(status: GameStatus, answer: ParticipantAnswer) {
    status.participant_answers.push(answer)
    this.dbService.saveGameStatus(status).then()
  }

  public nextQuestion(status: GameStatus) {
    status.current_question++
    this.dbService.saveGameStatus(status).then()
  }

  public setWinner(status: GameStatus, winner: string) {
    status.winner = winner
    this.dbService.saveGameStatus(status).then()
  }

  public setMessageId(game_id: string, messages_id: string) {
    const status = this.getStatus(game_id)
    status.message_id = messages_id
    this.dbService.saveGameStatus(status).then()
  }

  public setCurrentQuestionMessageId(game_id: string, messages_id: string) {
    const status = this.getStatus(game_id)
    status.current_question_message_id = messages_id
    this.dbService.saveGameStatus(status).then()
  }
}
