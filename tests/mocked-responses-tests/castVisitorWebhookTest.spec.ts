import { Webhook } from '../../src/types'
import visitWebhookBody from './mocked-responses-data/webhook.json'

describe('[Mocked body] Cast visitor webhook', () => {
  test('with sample request body', async () => {
    const visit = visitWebhookBody as Webhook

    // Assertion just to use the `visit` variable. The goal of this test is to assume that Typescript won't throw an error here.
    expect(visit).toBeTruthy()
  })
})
