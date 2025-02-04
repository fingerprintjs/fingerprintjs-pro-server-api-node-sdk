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

export type ErrorPlainResponse = components['schemas']['ErrorPlainResponse']
export type ErrorResponse = components['schemas']['ErrorResponse']

export type SearchEventsFilter = paths['/events/search']['get']['parameters']['query']
export type SearchEventsResponse = paths['/events/search']['get']['responses']['200']['content']['application/json']

/**
 * More info: https://dev.fingerprintjs.com/docs/server-api#response
 */
export type VisitorsResponse = paths['/visitors/{visitor_id}']['get']['responses']['200']['content']['application/json']

export type EventsGetResponse = paths['/events/{request_id}']['get']['responses']['200']['content']['application/json']

export type RelatedVisitorsResponse =
  paths['/related-visitors']['get']['responses']['200']['content']['application/json']
export type RelatedVisitorsFilter = paths['/related-visitors']['get']['parameters']['query']

/**
 * More info: https://dev.fingerprintjs.com/docs/webhooks#identification-webhook-object-format
 */
export type Webhook = components['schemas']['Webhook']

export type EventsUpdateRequest = components['schemas']['EventsUpdateRequest']

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
  : void

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
