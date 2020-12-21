export interface Answer {
  id: string
  answer: string
  is_correct: boolean
}

export interface Question {
  id: string
  question: string
  answers: Answer[]
}

export interface Game {
  id: string
  name: string
  questions: Question[]
}

export interface ParticipantAnswer {
  participant: string
  question_id: string
  answer_id: string
  is_correct: boolean
}

export interface GameStatus {
  game_id: string
  current_question: number
  participantAnswers: ParticipantAnswer[]
}
