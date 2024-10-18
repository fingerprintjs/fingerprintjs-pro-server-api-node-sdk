import { CommonResponse429 } from '../types'
import { getRetryAfter } from './getRetryAfter'
import { ApiError } from './apiErrors'

export class CommonError429 extends ApiError<429, CommonResponse429> {
  readonly retryAfter: number = 0

  constructor(body: CommonResponse429, response: Response) {
    super(body.error?.message ?? 'Too many requests', body, 429, body.error?.code ?? 'TooManyRequests', response)

    this.retryAfter = getRetryAfter(response)
  }
}
