import { ErrorPlainResponse, ErrorResponse } from '../types'
import { RequestError, TooManyRequestsError } from './apiErrors'

function isErrorResponse(v: any): v is ErrorResponse {
  return Boolean(
    v &&
      typeof v === 'object' &&
      'error' in v &&
      typeof v.error === 'object' &&
      v.error &&
      'code' in v.error &&
      'message' in v.error
  )
}

function isPlainErrorResponse(v: any): v is ErrorPlainResponse {
  return Boolean(v && typeof v === 'object' && 'error' in v && typeof v.error === 'string')
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
