import type { Event } from './types'

export function isEventPayload(data: unknown): data is Event {
  return typeof data === 'object' && data !== null && !Array.isArray(data) && 'event_id' in data && 'timestamp' in data
}

/**
 * Treat a missing `source` as `device`.
 *
 * Identification events stored before `source` existed omit the field. `Event`
 * is `EventDevice | EventEdge` discriminated by `source`, so a missing key
 * matches neither variant. Live GET, search, and new webhook payloads already
 * include `source`. Call this when replaying stored JSON.
 *
 * Never rewrites `edge` or an existing `device`.
 */
export function hydrateEvent(event: unknown): Event {
  if (!isEventPayload(event)) {
    throw new Error('event JSON must be an object')
  }

  if (Object.hasOwn(event, 'source')) {
    return event
  }

  return { ...event, source: 'device' }
}
