import type { Event } from './types'

const EVENT_SOURCES = new Set(['device', 'edge'])

export function isEventPayload(data: unknown): data is Event {
  return typeof data === 'object' && data !== null && !Array.isArray(data) && 'event_id' in data && 'timestamp' in data
}

function readSource(event: object): unknown {
  if (!Object.hasOwn(event, 'source')) {
    return undefined
  }

  return Reflect.get(event, 'source')
}

/**
 * Treat a missing, null, or empty `source` as `device`.
 *
 * Identification events stored before `source` existed omit the field. `Event`
 * is `EventDevice | EventEdge` discriminated by `source`, so a missing key
 * matches neither variant. Live GET, search, and new webhook payloads already
 * include `source`. Call this when replaying stored JSON.
 *
 * Never rewrites `edge` or an existing `device`. Unknown non-empty values fail.
 */
export function hydrateEvent(event: unknown): Event {
  if (!isEventPayload(event)) {
    throw new Error('event JSON must be an object')
  }

  const source = readSource(event)

  if (source === undefined || source === null || source === '') {
    return { ...event, source: 'device' }
  }

  if (typeof source !== 'string' || !EVENT_SOURCES.has(source)) {
    throw new Error(`unknown Event source: ${JSON.stringify(source)}`)
  }

  return event
}
