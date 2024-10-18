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
