import {
  DeleteVisit400Response,
  DeleteVisit403Response,
  DeleteVisit404Response,
  VisitorsResponse400,
  VisitorsResponse404,
  VisitorsResponse403,
  VisitorsResponse429,
} from '../types'
import { ApiError } from './apiErrors'
import { getRetryAfter } from './getRetryAfter'
import { CommonError429 } from './commonErrors'

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

export class VisitorsError404 extends ApiError<404, VisitorsResponse404> {
  constructor(body: VisitorsResponse404, response: Response) {
    super(body.error?.message ?? 'Visitor not found', body, 404, body.error?.code ?? 'VisitorNotFound', response)
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

export class VisitorsError400 extends ApiError<400, VisitorsResponse400> {
  constructor(body: VisitorsResponse400, response: Response) {
    super(body.error?.message ?? 'Request cannot be parsed', body, 400, 'RequestCannotBeParsed', response)
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

export const RELATED_VISITORS_ERRORS = [VisitorsError400, VisitorsError403, VisitorsError404, VisitorsError429] as const
export function isRelatedVisitorsError(error: unknown): error is (typeof RELATED_VISITORS_ERRORS)[number]['prototype'] {
  return RELATED_VISITORS_ERRORS.some((errorConstructor) => error instanceof errorConstructor)
}
