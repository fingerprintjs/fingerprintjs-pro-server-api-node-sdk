import { components, operations, paths } from './generatedApiTypes'

export enum Region {
  EU = 'EU',
  AP = 'AP',
  Global = 'Global',
}

export enum AuthenticationMode {
  AuthHeader = 'AuthHeader',
  QueryParameter = 'QueryParameter',
}

/**
 * Options for FingerprintJS server API client
 */
export interface Options {
  /**
   * Secret API key
   */
  apiKey: string
  /**
   * Region of the FingerprintJS service server
   */
  region?: Region
  /**
   * Authentication mode
   * Optional, default value is AuthHeader
   */
  authenticationMode?: AuthenticationMode

  /**
   * Optional fetch implementation
   * */
  fetch?: typeof fetch
}

/**
 * More info: https://dev.fingerprintjs.com/docs/server-api#query-parameters
 */
export type VisitorHistoryFilter = paths['/visitors/{visitor_id}']['get']['parameters']['query']

export type TooManyRequestsError = {
  status: 429
  /**
   * How many seconds to wait before retrying
   */
  retryAfter: number
}

/**
 * More info: https://dev.fingerprintjs.com/docs/server-api#response
 */
export type VisitorsResponse = paths['/visitors/{visitor_id}']['get']['responses']['200']['content']['application/json']
export type VisitorsResponse403 =
  paths['/visitors/{visitor_id}']['get']['responses']['403']['content']['application/json'] & {
    status: 403
  }
export type VisitorsResponse429 =
  paths['/visitors/{visitor_id}']['get']['responses']['429']['content']['application/json']
export type VisitorsResponse400 = components['schemas']['ErrorVisitor400Response']
export type VisitorsResponse404 = components['schemas']['ErrorVisitor404Response']

export type DeleteVisit404Response =
  paths['/visitors/{visitor_id}']['delete']['responses']['404']['content']['application/json']

export type DeleteVisit403Response =
  paths['/visitors/{visitor_id}']['delete']['responses']['403']['content']['application/json']

export type DeleteVisit400Response =
  paths['/visitors/{visitor_id}']['delete']['responses']['400']['content']['application/json'] & {
    status: 400
  }

export type CommonResponse429 = components['schemas']['ErrorCommon429Response']
export type CommonResponse403 = components['schemas']['ErrorCommon403Response']

export type VisitorsError = WithResponse<VisitorsResponse403 | VisitorsResponse429>

export type EventResponse = paths['/events/{request_id}']['get']['responses']['200']['content']['application/json']
export type EventResponse403 = paths['/events/{request_id}']['get']['responses']['403']['content']['application/json']
export type EventResponse404 = paths['/events/{request_id}']['get']['responses']['404']['content']['application/json']

export type UpdateEventResponse400 =
  paths['/events/{request_id}']['put']['responses']['400']['content']['application/json']
export type UpdateEventResponse403 =
  paths['/events/{request_id}']['put']['responses']['403']['content']['application/json']
export type UpdateEventResponse404 =
  paths['/events/{request_id}']['put']['responses']['404']['content']['application/json']
export type UpdateEventResponse409 =
  paths['/events/{request_id}']['put']['responses']['409']['content']['application/json']

export type RelatedVisitorsResponse =
  paths['/related-visitors']['get']['responses']['200']['content']['application/json']
export type RelatedVisitorsFilter = paths['/related-visitors']['get']['parameters']['query']

type WithResponse<T> = T & {
  response: Response
}

/**
 * More info: https://dev.fingerprintjs.com/docs/webhooks#identification-webhook-object-format
 */
export type VisitWebhook = components['schemas']['WebhookVisit']

export type EventUpdateRequest = components['schemas']['EventUpdateRequest']

// Extract just the `path` parameters as a tuple of strings
type ExtractPathParamStrings<Path> = Path extends { parameters: { path: infer P } }
  ? P extends Record<string, any>
    ? [P[keyof P]] // We extract the path parameter values as a tuple of strings
    : []
  : []

// Utility type to extract query parameters from an operation and differentiate required/optional
export type ExtractQueryParams<Path> = Path extends { parameters: { query?: infer Q } }
  ? undefined extends Q // Check if Q can be undefined (meaning it's optional)
    ? Q | undefined // If so, it's optional
    : Q // Otherwise, it's required
  : never // If no query parameters, return never

// Utility type to extract request body from an operation (for POST, PUT, etc.)
type ExtractRequestBody<Path> = Path extends { requestBody: { content: { 'application/json': infer B } } } ? B : never

// Utility type to extract the response type for 200 status code
type ExtractResponse<Path> = Path extends { responses: { 200: { content: { 'application/json': infer R } } } }
  ? R
  : never

// Extracts args to given API method
type ApiMethodArgs<Path extends keyof operations> = [
  // If method has body, extract it as first parameter
  ...(ExtractRequestBody<operations[Path]> extends never ? [] : [body: ExtractRequestBody<operations[Path]>]),
  // Next are path params, e.g. for path "/events/{request_id}" it will be one string parameter,
  ...ExtractPathParamStrings<operations[Path]>,
  // Last parameter will be the query params, if any
  ...(ExtractQueryParams<operations[Path]> extends never ? [] : [params: ExtractQueryParams<operations[Path]>]),
]

type ApiMethod<Path extends keyof operations> = (
  ...args: ApiMethodArgs<Path>
) => Promise<ExtractResponse<operations[Path]>>

export type FingerprintApi = {
  [Path in keyof operations]: ApiMethod<Path>
}
