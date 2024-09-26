import { VisitWebhook } from '../../src/types'
import visitWebhookBody from './mocked-responses-data/webhook.json'

describe('[Mocked body] Cast visitor webhook', () => {
  test('with sample request body', async () => {
    const visit = visitWebhookBody as unknown as VisitWebhook

    expect(visit).toMatchSnapshot()
  })
})
