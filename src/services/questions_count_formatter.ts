import { Question } from '../interfaces/games.interface'

export function formatQuestionsCountText(currentQuestion: Question, gameQuestions: Question[]): string {
  return `${gameQuestions.indexOf(currentQuestion) + 1}/${gameQuestions.length}`
}
