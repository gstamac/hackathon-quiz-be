import { Game, Question } from '../interfaces/games.interface'

export class MessangerService {
  public async sendStartGameInMessage(game: Game, time: number): Promise<void> {
    // send to messaging service
  }
  public async sendStartGameMessage(game: Game): Promise<void> {
    // send to messaging service
  }
  public async sendQuestionMessage(question: Question): Promise<void> {
    // send to messaging service
  }
  public async updateQuestionAnswer(question: Question, participant: string): Promise<void> {
    // send to messaging service
  }
  public async sendEndOfGameMessage(game: Game): Promise<void> {
    // send to messaging service
  }
}
