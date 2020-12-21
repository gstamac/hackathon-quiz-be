// tslint:disable: no-commented-code
// tslint:disable: no-duplicate-string
// tslint:disable: max-line-length
// tslint:disable: no-unused
// tslint:disable: max-union-size
// tslint:disable: no-unsafe-any

import { default as axios } from 'axios'

import { UpdateMessageParams, UpdateMessageContent, Message, AddMessageBody } from './messaging_interfaces'

let svcUrl: string = <string>process.env.MESSAGING_SERVICE_URL

export function init(serviceUrl: string): void {
  svcUrl = serviceUrl
}

export async function sendMessage(access_token: string, body: AddMessageBody): Promise<Message[]> {
  return (
    await axios.request<Message[]>({
      url: `${svcUrl}/v1/messages`,
      method: 'post',
      data: body,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).data
}

export async function updateMessage(access_token: string, params: UpdateMessageParams, body: UpdateMessageContent): Promise<Message> {
  return (
    await axios.request<Message>({
      url: `${svcUrl}/v1/message-cards/${params.message_id}`,
      method: 'put',
      data: body,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).data
}
