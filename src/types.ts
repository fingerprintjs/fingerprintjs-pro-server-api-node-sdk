import { components, paths } from './generatedApiTypes'

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

export type DeleteVisit404Response =
  paths['/visitors/{visitor_id}']['delete']['responses']['404']['content']['application/json']

export type DeleteVisit403Response =
  paths['/visitors/{visitor_id}']['delete']['responses']['403']['content']['application/json']

export type DeleteVisit400Response =
  paths['/visitors/{visitor_id}']['delete']['responses']['400']['content']['application/json'] & {
    status: 400
  }

export type CommonResponse429 = components['schemas']['ErrorCommon429Response']

export type VisitorsError = WithResponse<VisitorsResponse403 | VisitorsResponse429>

export type EventResponse = paths['/events/{request_id}']['get']['responses']['200']['content']['application/json']
export type EventResponse403 = paths['/events/{request_id}']['get']['responses']['403']['content']['application/json']
export type EventResponse404 = paths['/events/{request_id}']['get']['responses']['404']['content']['application/json']

type WithResponse<T> = T & {
  response: Response
}

/**
 * More info: https://dev.fingerprintjs.com/docs/webhooks#identification-webhook-object-format
 */
export type VisitWebhook = components['schemas']['WebhookVisit']
