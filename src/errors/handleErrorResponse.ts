import { ErrorPlainResponse, ErrorResponse } from '../types'
import { ApiError, PlainApiError, TooManyRequestsError } from './apiErrors'

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

    throw new ApiError(json, response)
  }

  if (isPlainErrorResponse(json)) {
    if (response.status === 429) {
      throw TooManyRequestsError.fromPlainError(json, response)
    }

    throw new PlainApiError(json, response)
  }

  throw ApiError.unknown(response)
}
