import { v4 } from 'uuid'
import { BASE_URL } from '../config'
import { Game, Question } from '../interfaces/games.interface'
import { AddMessageBody, MessageCardElement, UpdateMessageContent } from './messaging_interfaces'
import { formatQuestionsCountText } from './questions_count_formatter'

export function formatMessage(game: Game, content: UpdateMessageContent): AddMessageBody {
  return {
    message: {
      uuid: v4(),
      ...content,
    },
    channels: [game.channel_id],
  }
}

export function formatStartGameContent(): UpdateMessageContent {
  const element: MessageCardElement = {
    icon: {
      type: 'HACKATON_ICON',
    },
    title_text: 'Quiz has started',
    primary_text: 'Quiz has started',
    secondary_text: '',
    additional_text: '',
  }

  return {
    type: 'CARD_VIEW',
    content: JSON.stringify({
      text: 'Quiz has started',
      elements: element,
      payload: {},
    }),
  }
}

export function formatStartGameInContent(time: number): UpdateMessageContent {
  const element: MessageCardElement = {
    icon: {
      type: 'HACKATON_ICON',
    },
    title_text: `Quiz will start in ${time} seconds`,
    primary_text: `Quiz will start in ${time} seconds`,
    secondary_text: '',
    additional_text: '',
  }

  return {
    type: 'CARD_VIEW',
    content: JSON.stringify({
      text: `Quiz will start in ${time} seconds`,
      elements: element,
      payload: {},
    }),
  }
}

export function formatEndOfGameMessage(game: Game, winner: string): AddMessageBody {
  const element: MessageCardElement = {
    icon: {
      type: 'HACKATON_ICON',
    },
    title_text: 'Quiz has ended',
    primary_text: 'Quiz has ended',
    secondary_text: `The winner is ${winner}`,
    additional_text: '',
  }

  return formatMessage(game, {
    type: 'CARD_VIEW',
    content: JSON.stringify({
      text: 'Quiz has ended',
      elements: element,
      payload: {},
    }),
  })
}

export function formatEndOfGameNoAnswersMessage(game: Game): AddMessageBody {
  const element: MessageCardElement = {
    icon: {
      type: 'HACKATON_ICON',
    },
    primary_text: 'Too hard?',
    secondary_text: `No answers from participants`,
    additional_text: '',
  }

  return {
    message: {
      uuid: v4(),
      type: 'CARD_VIEW',
      content: JSON.stringify({
        text: 'Quiz has ended',
        elements: element,
        payload: {},
      }),
    },
    channels: [game.channel_id],
  }
}

export function formatQuestionMessage(game: Game, question: Question): AddMessageBody {
  const element: MessageCardElement = {
    icon: {
      type: 'HACKATON_ICON',
    },
    title_text: `${formatQuestionsCountText(question, game.questions)}`,
    primary_text: question.question,
    secondary_text: '',
    additional_text: '',
    buttons: question.answers.map(a => ({
      title: a.answer,
      type: 'OUTLINED',
      cta_type: 'DEEPLINK',
      cta_link: `${BASE_URL}/games/${game.id}/answers?question_id=${question.id}&answer_id=${a.id}&participant=`,
      mode: 'PRIMARY',
    })),
  }

  return formatMessage(game, {
    type: 'CARD_VIEW',
    content: JSON.stringify({
      text: `Question: ${question.question}`,
      elements: element,
      payload: {},
    }),
  })
}

export function formatQuestionAnsweredContent(question: Question, participant: string): UpdateMessageContent {
  const element: MessageCardElement = {
    icon: {
      type: 'HACKATON_ICON',
    },
    title_text: `Question: ${question.question}`,
    primary_text: `Question: ${question.question}`,
    secondary_text: `Answered correctly by ${participant}`,
    additional_text: '',
  }

  return {
    type: 'CARD_VIEW',
    content: JSON.stringify({
      text: `Question: ${question.question}`,
      elements: element,
      payload: {},
    }),
  }
}
