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
  region: Region
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

/**
 * More info: https://dev.fingerprintjs.com/docs/server-api#response
 */
export type VisitorsResponse = paths['/visitors/{visitor_id}']['get']['responses']['200']['content']['application/json']
export type VisitorsError403 =
  paths['/visitors/{visitor_id}']['get']['responses']['403']['content']['application/json'] & {
    status: 403
  }
export type VisitorsError429 =
  paths['/visitors/{visitor_id}']['get']['responses']['429']['content']['application/json'] & {
    status: 429
    retryAfter: number
  }

export type DeleteVisitError404 =
  paths['/visitors/{visitor_id}']['delete']['responses']['404']['content']['application/json'] & {
    status: 404
  }

export type DeleteVisitError403 =
  paths['/visitors/{visitor_id}']['delete']['responses']['403']['content']['application/json'] & {
    status: 403
  }

export type VisitorsError = WithResponse<VisitorsError403 | VisitorsError429>

export type DeleteVisitorError = WithResponse<DeleteVisitError404 | DeleteVisitError403>

export function isVisitorsError(response: any): response is EventError {
  return (
    (response?.hasOwnProperty('status') &&
      (response.status === 403 || response.status === 429) &&
      response?.hasOwnProperty('error') &&
      typeof response.error === 'string') ||
    false
  )
}

export function isDeleteVisitorError(response: any): response is DeleteVisitorError {
  return (
    (response?.hasOwnProperty('status') &&
      (response.status === 403 || response.status === 404) &&
      response.error?.hasOwnProperty('message') &&
      typeof response.error.message === 'string' &&
      response.error?.hasOwnProperty('code') &&
      typeof response.error.code === 'string') ||
    false
  )
}

export type EventResponse = paths['/events/{request_id}']['get']['responses']['200']['content']['application/json']
export type EventError403 = paths['/events/{request_id}']['get']['responses']['403']['content']['application/json']
export type EventError404 = paths['/events/{request_id}']['get']['responses']['404']['content']['application/json']

type WithResponse<T> = T & {
  response: Response
}

type GenericEventError = WithResponse<EventError403 | EventError404>

type EventErrorCode<T extends GenericEventError> = T extends EventError403 ? 403 : 404

export type EventError<T extends GenericEventError = GenericEventError> = WithResponse<
  T & {
    status: EventErrorCode<T>
  }
>
export function isEventError(response: any): response is EventError {
  return (
    (response?.hasOwnProperty('status') &&
      (response.status === 403 || response.status === 404) &&
      response?.hasOwnProperty('error') &&
      response.error?.hasOwnProperty('message') &&
      typeof response.error.message === 'string' &&
      response.error?.hasOwnProperty('code') &&
      typeof response.error.code === 'string') ||
    false
  )
}

/**
 * More info: https://dev.fingerprintjs.com/docs/webhooks#identification-webhook-object-format
 */
export type VisitWebhook = components['schemas']['WebhookVisit']
