import Database from 'better-sqlite3'
import { Game, GameStatus } from '../interfaces/games.interface'

export class GamesDbService {
  private db: Database.Database

  public async init(clear = false) {
    this.db = new Database('game.db', {})

    if (clear) {
      await this.db.exec(`DROP TABLE IF EXISTS participant_answer;`)
      await this.db.exec(`DROP TABLE IF EXISTS game_status;`)
      await this.db.exec(`DROP TABLE IF EXISTS game;`)
    }

    await this.db.exec(
      `CREATE TABLE IF NOT EXISTS game (id text primary key, channel_id integer, access_token text, name text, questions text, inserted_at DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP);`,
    )
    await this.db.exec(
      `CREATE TABLE IF NOT EXISTS game_status (game_id text REFERENCES game(id), message_id text, current_question integer, current_question_message_id text, participant_answers text, inserted_at DEFAULT CURRENT_TIMESTAMP, updated_at DEFAULT CURRENT_TIMESTAMP);`,
    )
  }

  public async saveGame(game: Game) {
    await this.db
      .prepare(`insert into game (id, channel_id, access_token, name, questions) values (?, ?, ?, ?, ?);`)
      .run(game.id, game.channel_id, game.access_token, game.name, JSON.stringify(game.questions))
  }

  public getGameById(id: string) {
    const game = this.db.prepare(`select * from game where id = ?`).get(id)

    if (game !== undefined) {
      game.questions = JSON.parse(game.questions as string)
      delete game.inserted_at
      delete game.updated_at
    }

    return game
  }

  public async deleteGameById(id: string) {
    await this.db.prepare(`DELETE from game where id = ?`).run(id)
  }

  public getGamesForChannel(channel_id: string) {
    return this.db.prepare(`select * from game where channel_id = ?`).all(channel_id) as Game[]
  }

  public async saveGameStatus(gameStatus: GameStatus) {
    if (this.getGameStatus(gameStatus.game_id) === undefined) {
      await this.db
        .prepare(
          `insert into game_status (game_id, message_id, current_question, current_question_message_id, participant_answers) values (?, ?, ?, ?, ?);`,
        )
        .run(
          gameStatus.game_id,
          gameStatus.message_id,
          gameStatus.current_question,
          gameStatus.current_question_message_id,
          JSON.stringify(gameStatus.participant_answers),
        )
    } else {
      await this.db
        .prepare(
          `UPDATE game_status SET message_id = ?, current_question = ?, current_question_message_id = ?, participant_answers = ? WHERE game_id = ?;`,
        )
        .run(
          gameStatus.message_id,
          gameStatus.current_question,
          gameStatus.current_question_message_id,
          JSON.stringify(gameStatus.participant_answers),
          gameStatus.game_id,
        )
    }
  }

  public getGameStatus(game_id: string) {
    const status = this.db.prepare(`select * from game_status where game_id = ?`).get(game_id)

    if (status !== undefined) {
      status.participant_answers = JSON.parse(status.participant_answers)
      delete status.inserted_at
      delete status.updated_at
    }

    return status
  }
}
