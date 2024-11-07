import { ErrorPlainResponse, ErrorResponse } from '../types'
import { RequestError, TooManyRequestsError } from './apiErrors'

function isErrorResponse(value: unknown): value is ErrorResponse {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'error' in value &&
      typeof value.error === 'object' &&
      value.error &&
      'code' in value.error &&
      'message' in value.error
  )
}

function isPlainErrorResponse(value: unknown): value is ErrorPlainResponse {
  return Boolean(value && typeof value === 'object' && 'error' in value && typeof value.error === 'string')
}

export function handleErrorResponse(json: any, response: Response): never {
  if (isErrorResponse(json)) {
    if (response.status === 429) {
      throw new TooManyRequestsError(json, response)
    }

    throw RequestError.fromErrorResponse(json, response)
  }

  if (isPlainErrorResponse(json)) {
    if (response.status === 429) {
      throw TooManyRequestsError.fromPlain(json, response)
    }

    throw RequestError.fromPlainError(json, response)
  }

  throw RequestError.unknown(response)
}
