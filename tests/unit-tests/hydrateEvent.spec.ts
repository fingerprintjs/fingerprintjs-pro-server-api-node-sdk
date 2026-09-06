import { describe, expect, it } from 'vitest'
import { hydrateEvent } from '../../src'

describe('hydrateEvent', () => {
  it('inserts device when source is absent', () => {
    const event = hydrateEvent({ event_id: '1708102555327.NLOjmg', timestamp: 1 })

    expect(event.source).toBe('device')
    expect(event.event_id).toBe('1708102555327.NLOjmg')
  })

  it('leaves device unchanged', () => {
    const event = hydrateEvent({ event_id: 'x', timestamp: 1, source: 'device' })

    expect(event.source).toBe('device')
  })

  it('never rewrites edge', () => {
    const event = hydrateEvent({ event_id: 'x', timestamp: 1, source: 'edge', ip_info: {} })

    expect(event.source).toBe('edge')
  })

  it('rejects non-object JSON', () => {
    expect(() => hydrateEvent(['not', 'an', 'event'])).toThrow('event JSON must be an object')
  })

  it('rejects null JSON', () => {
    expect(() => hydrateEvent(null)).toThrow('event JSON must be an object')
  })

  it('inserts device when source is empty', () => {
    expect(hydrateEvent({ event_id: 'x', timestamp: 1, source: '' }).source).toBe('device')
  })

  it('inserts device when source is null', () => {
    expect(hydrateEvent({ event_id: 'x', timestamp: 1, source: null }).source).toBe('device')
  })

  it('rejects an unknown non-empty source', () => {
    expect(() => hydrateEvent({ event_id: 'x', timestamp: 1, source: 'webhook' })).toThrow(
      'unknown Event source: "webhook"'
    )
  })
})
