import { Question } from '../../interfaces/games.interface'
import * as questionsCountFormatter from '../../services/questions_count_formatter'

describe('Question count formater', () => {
  it('format question count', async () => {
    const question1: Question = { id: 'id1', question: 'question 1', answers: [] }
    const question2: Question = { id: 'id2', question: 'question 2', answers: [] }
    const question3: Question = { id: 'id3', question: 'question 3', answers: [] }

    const questions: Question[] = [question1, question2, question3]

    expect(questionsCountFormatter.formatQuestionsCountText(question2, questions)).toEqual('2/3')
  })
})
