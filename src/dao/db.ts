import Database from 'better-sqlite3'
import { Game, GameStatus, ParticipantAnswer } from '../interfaces/games.interface'

export class GamesService {
  private db: Database.Database

  public async init() {
    this.db = new Database('game.db', {})

    await this.db.exec(
      `CREATE TABLE IF NOT EXISTS game (id text primary key, channel_id integer, access_token text, name text, questions text, inserted_at DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP);`,
    )
    await this.db.exec(
      `CREATE TABLE IF NOT EXISTS game_status (game_id text REFERENCES game(id), message_id text, current_question integer, current_question_message_id text, inserted_at DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP);`,
    )
    await this.db.exec(
      `CREATE TABLE IF NOT EXISTS participant_answer (participant text, question_id text, anwser_id text, is_correct integer, inserted_at DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP);`,
    )
  }

  public async saveGame(game: Game) {
    await this.db
      .prepare(`insert into game (id, channel_id, access_token, name, questions) values (?, ?, ?, ?, ?);`)
      .run(game.id, game.channel_id, game.access_token, game.name, JSON.stringify(game.questions))
  }

  public async saveGameStatus(gameStatus: GameStatus) {
    await this.db
      .prepare(`insert into game_status (game_id, message_id, current_question, current_question_message_id) values (?, ?, ?, ?);`)
      .run(gameStatus.game_id, gameStatus.message_id, gameStatus.current_question, gameStatus.current_question_message_id)
  }

  public async saveParticipantAnswer(answer: ParticipantAnswer) {
    await this.db
      .prepare(`insert into participant_answer (participant, question_id, answer_id, is_correct) values (?, ?, ?, ?);`)
      .run(answer.participant, answer.question_id, answer.answer_id, answer.is_correct ? 1 : 0)
  }

  public getGameById(id: string) {
    return this.db.prepare(`select * from game where id = ?`).get(id) as Game
  }

  public getGamesForChannel(channel_id: string) {
    return this.db.prepare(`select * from game where channel_id = ?`).all(channel_id) as Game[]
  }

  public getGameStatus(game_id: string) {
    return this.db.prepare(`select * from gameStatus where channel_id = ?`).get(game_id) as GameStatus
  }

  public getParticipantAnswer(participant: string, question: string) {
    return this.db.prepare(`select * from participant_answer where participant = ? and question = ?`).get(participant, question) as ParticipantAnswer
  }
}
