import { v4 } from 'uuid'
import { BASE_URL, QUESTION_TIMEOUT, START_GAME_DELAY } from '../config'
import { Game, Question } from '../interfaces/games.interface'
import { AddMessageBody, MessageCardElement, MessageTemplateButtonItem, UpdateMessageContent } from './messaging_interfaces'
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
    primary_text: 'Quiz has started',
    secondary_text: '',
    additional_text: '',
    disabled: true,
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
    primary_text: 'Quiz will start in',
    secondary_text: '',
    additional_text: '',
    countdown_seconds: START_GAME_DELAY,
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

export function formatEndOfGameMessage(game: Game, winner: string, afterWinnerRankings: string): AddMessageBody {
  const follwedByText: string = afterWinnerRankings ? `\n${afterWinnerRankings}` : 'no competition'

  const element: MessageCardElement = {
    icon: {
      type: 'HACKATON_ICON',
    },
    title_text: 'Congratulations',
    primary_text: `Winner: ${winner}`,
    secondary_text: `Followed by: ${follwedByText}`,
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
    disabled: true,
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
    title_text: `Question ${formatQuestionsCountText(question, game.questions)}`,
    primary_text: question.question,
    secondary_text: '',
    additional_text: '',
    countdown_seconds: QUESTION_TIMEOUT,
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

export function formatQuestionAnsweredContent(game: Game, question: Question, participant: string): UpdateMessageContent {
  const element: MessageCardElement = {
    icon: {
      type: 'HACKATON_ICON',
    },
    title_text: `Question ${formatQuestionsCountText(question, game.questions)}`,
    primary_text: question.question,
    secondary_text: `Answered correctly by ${participant}`,
    additional_text: '',
    disabled: true,
    buttons: getDisabledButtons(game, question),
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

export function formatQuestionTimedoutContent(game: Game, question: Question): UpdateMessageContent {
  const element: MessageCardElement = {
    icon: {
      type: 'HACKATON_ICON',
    },
    title_text: `Question ${formatQuestionsCountText(question, game.questions)}`,
    primary_text: question.question,
    secondary_text: `Nobody answered correctly in time`,
    additional_text: '',
    disabled: true,
    buttons: getDisabledButtons(game, question),
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

export function formatStatsMessage(secondaryText: string, channelId: string): AddMessageBody {
  const element: MessageCardElement = {
    icon: {
      type: 'HACKATON_ICON',
    },
    primary_text: `All time channel stats`,
    secondary_text: secondaryText,
    additional_text: '',
  }

  return {
    message: {
      uuid: v4(),
      type: 'CARD_VIEW',
      content: JSON.stringify({
        text: `All time channel stats`,
        elements: element,
        payload: {},
      }),
    },
    channels: [channelId],
  }
}

function getDisabledButtons(game: Game, question: Question): MessageTemplateButtonItem[] {
  return question.answers.map(a => ({
    title: a.answer,
    type: 'OUTLINED',
    cta_type: 'DEEPLINK',
    cta_link: `${BASE_URL}/games/${game.id}/answers?question_id=${question.id}&answer_id=${a.id}&participant=`,
    mode: a.is_correct ? 'PRIMARY' : 'SECONDARY',
  }))
}
