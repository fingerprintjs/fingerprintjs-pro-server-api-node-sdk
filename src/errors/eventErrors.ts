import {
  EventResponse403,
  EventResponse404,
  UpdateEventResponse400,
  UpdateEventResponse403,
  UpdateEventResponse404,
  UpdateEventResponse409,
} from '../types'
import { ApiError } from './apiErrors'

export class EventError403 extends ApiError<403, EventResponse403> {
  constructor(body: EventResponse403, response: Response) {
    super(body.error?.message ?? 'Forbidden', body, 403, body.error?.code ?? 'Forbidden', response)
  }
}

export class EventError404 extends ApiError<404, EventResponse404> {
  constructor(body: EventResponse404, response: Response) {
    super(body.error?.message ?? 'request id is not found', body, 404, body.error?.code ?? 'RequestNotFound', response)
  }
}

export class UpdateEventError400 extends ApiError<400, UpdateEventResponse400> {
  constructor(body: UpdateEventResponse400, response: Response) {
    super(body.error?.message ?? 'Bad request', body, 400, body.error?.code ?? 'BadRequest', response)
  }
}

export class UpdateEventError403 extends ApiError<403, UpdateEventResponse403> {
  constructor(body: UpdateEventResponse403, response: Response) {
    super(body.error?.message ?? 'Forbidden', body, 403, body.error?.code ?? 'Forbidden', response)
  }
}

export class UpdateEventError404 extends ApiError<404, UpdateEventResponse404> {
  constructor(body: UpdateEventResponse404, response: Response) {
    super(body.error?.message ?? 'Request id is not found', body, 404, body.error?.code ?? 'RequestNotFound', response)
  }
}

export class UpdateEventError409 extends ApiError<409, UpdateEventResponse409> {
  constructor(body: UpdateEventResponse409, response: Response) {
    super(body.error?.message ?? 'Conflict', body, 409, body.error?.code ?? 'Conflict', response)
  }
}

export const EVENT_ERRORS = [EventError403, EventError404] as const

export function isEventError(error: unknown): error is (typeof EVENT_ERRORS)[number]['prototype'] {
  return EVENT_ERRORS.some((errorConstructor) => error instanceof errorConstructor)
}

export const UPDATE_EVENT_ERRORS = [UpdateEventError400, UpdateEventError403, UpdateEventError404, UpdateEventError409]

export function isUpdateEventError(error: unknown): error is (typeof UPDATE_EVENT_ERRORS)[number]['prototype'] {
  return UPDATE_EVENT_ERRORS.some((errorConstructor) => error instanceof errorConstructor)
}
