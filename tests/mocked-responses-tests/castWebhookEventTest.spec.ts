import { describe, expect, it } from 'vitest'
import { hydrateEvent } from '../../src'
import eventWebhookBody from './mocked-responses-data/webhook/webhook_event.json'

describe('[Mocked body] Cast webhook event', () => {
  it('with sample request body', () => {
    const event = hydrateEvent(eventWebhookBody)

    expect(event.source).toBe('device')
  })
})
