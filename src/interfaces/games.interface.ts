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
  channel_id: string
  access_token: string
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
  message_id?: string
  current_question: number
  current_question_message_id?: string
  participantAnswers: ParticipantAnswer[]
}
