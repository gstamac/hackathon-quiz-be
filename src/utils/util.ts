import { QUESTION_TIMEOUT, START_GAME_DELAY } from '../config'

export const isEmpty = (value: any): boolean => {
  if (value === null) {
    return true
  } else if (typeof value !== 'number' && value === '') {
    return true
  } else if (value === 'undefined' || value === undefined) {
    return true
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true
  } else {
    return false
  }
}

export async function delay(timeout: number): Promise<void> {
  await new Promise<void>(resolve => setTimeout(() => resolve(), timeout))
}

export interface Delayer {
  delayStartGame(): Promise<void>
  delayQuestionCountdown(): Promise<void>
}

export const delayer: Delayer = {
  delayStartGame: async () => await delay(START_GAME_DELAY * 1000 + 500),
  delayQuestionCountdown: async () => await delay(QUESTION_TIMEOUT * 1000 + 500),
}
