import {
  CommonResponse429,
  DeleteVisit400Response,
  DeleteVisit403Response,
  DeleteVisit404Response,
  EventResponse403,
  EventResponse404,
  VisitorsResponse403,
  VisitorsResponse429,
} from '../types'

export class SdkError extends Error {
  constructor(
    message: string,
    readonly response?: Response,
    cause?: Error
  ) {
    super(message, { cause })
    this.name = this.constructor.name
  }
}

export class ApiError<Code extends number = number, Body = unknown> extends SdkError {
  // HTTP Status code
  readonly statusCode: Code

  // API error code
  readonly errorCode: string

  // API error response
  readonly responseBody: Body

  // Raw HTTP response
  override readonly response: Response

  constructor(message: string, body: Body, statusCode: Code, errorCode: string, response: Response) {
    super(message, response)
    this.responseBody = body
    this.response = response
    this.errorCode = errorCode
    this.statusCode = statusCode
  }

  static unknown(response: Response) {
    return new ApiError('Unknown error', undefined, response.status, response.statusText, response)
  }
}

export class DeleteVisit404Error extends ApiError<404, DeleteVisit404Response> {
  constructor(body: DeleteVisit404Response, response: Response) {
    super(body.error?.message ?? 'Visit not found', body, 404, body.error?.code ?? 'VisitorNotFound', response)
  }
}

export class DeleteVisit403Error extends ApiError<403, DeleteVisit403Response> {
  constructor(body: DeleteVisit403Response, response: Response) {
    super(body.error?.message ?? 'Forbidden', body, 403, body.error?.code ?? 'Forbidden', response)
  }
}

export class DeleteVisit400Error extends ApiError<400, DeleteVisit400Response> {
  constructor(body: DeleteVisit400Response, response: Response) {
    super(body.error?.message ?? 'Visit not found', body, 400, body.error?.code ?? 'RequestCannotBeParsed', response)
  }
}

export class CommonError429 extends ApiError<429, CommonResponse429> {
  readonly retryAfter: number = 0

  constructor(body: CommonResponse429, response: Response) {
    super(body.error?.message ?? 'Too many requests', body, 429, body.error?.code ?? 'TooManyRequests', response)

    this.retryAfter = getRetryAfter(response)
  }
}

export class VisitorsError429 extends ApiError<429, VisitorsResponse429> {
  readonly retryAfter: number = 0

  constructor(body: VisitorsResponse429, response: Response) {
    super(body.error, body, 429, 'TooManyRequests', response)
    this.retryAfter = getRetryAfter(response)
  }
}

export class VisitorsError403 extends ApiError<403, VisitorsResponse403> {
  constructor(body: VisitorsResponse403, response: Response) {
    super(body.error, body, 403, 'Forbidden', response)
  }
}

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

export const DELETE_VISITS_ERRORS = [
  DeleteVisit404Error,
  DeleteVisit403Error,
  DeleteVisit400Error,
  CommonError429,
] as const
export function isDeleteVisitorsError(error: unknown): error is (typeof DELETE_VISITS_ERRORS)[number]['prototype'] {
  return DELETE_VISITS_ERRORS.some((errorConstructor) => error instanceof errorConstructor)
}

export const VISITOR_ERRORS = [VisitorsError403, VisitorsError429] as const
export function isVisitorsError(error: unknown): error is (typeof VISITOR_ERRORS)[number]['prototype'] {
  return VISITOR_ERRORS.some((errorConstructor) => error instanceof errorConstructor)
}

export const EVENT_ERRORS = [EventError403, EventError404] as const
export function isEventError(error: unknown): error is (typeof EVENT_ERRORS)[number]['prototype'] {
  return EVENT_ERRORS.some((errorConstructor) => error instanceof errorConstructor)
}

function getRetryAfter(response: Response) {
  const retryAfter = parseInt(response.headers.get('retry-after') ?? '')
  return Number.isNaN(retryAfter) ? 0 : retryAfter
}
