import type fetchFn from 'node-fetch';
import { components, paths } from './generatedApiTypes';

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
  apiKey: string;
  /**
   * Region of the FingerprintJS service server
   */
  region: Region;
  /**
   * Authentication mode
   * Optional, default value is AuthHeader
   */
  authenticationMode?: AuthenticationMode;

  /**
   * Optional fetch implementation
   * */
  fetch?: typeof fetchFn;
}

/**
 * More info: https://dev.fingerprintjs.com/docs/server-api#query-parameters
 */
export type VisitorHistoryFilter = paths['/visitors/{visitor_id}']['get']['parameters']['query'];

/**
 * More info: https://dev.fingerprintjs.com/docs/server-api#response
 */
export type VisitorsResponse =
  paths['/visitors/{visitor_id}']['get']['responses']['200']['content']['application/json'];
export type VisitorsError403 =
  paths['/visitors/{visitor_id}']['get']['responses']['403']['content']['application/json'] & {
    status: 403;
  };
export type VisitorsError429 =
  paths['/visitors/{visitor_id}']['get']['responses']['429']['content']['application/json'] & {
    status: 429;
    retryAfter: number;
  };

export type VisitorsError = VisitorsError403 | VisitorsError429;

export function isVisitorsError403(response: VisitorsError): response is VisitorsError403 {
  return response.status === 403;
}

export function isVisitorsError429(response: VisitorsError): response is VisitorsError429 {
  return response.status === 429;
}

export type EventResponse =
  paths['/events/{request_id}']['get']['responses']['200']['content']['application/json'];
export type EventError403 =
  paths['/events/{request_id}']['get']['responses']['403']['content']['application/json'];
export type EventError404 =
  paths['/events/{request_id}']['get']['responses']['404']['content']['application/json'];

type GenericEventError = EventError403 | EventError404;

type EventErrorCode<T extends GenericEventError> = T extends EventError403 ? 403 : 404;

export type EventError<T extends GenericEventError = GenericEventError> = T & {
  status: EventErrorCode<T>;
};

export function isEventError403(response: EventError): response is EventError<EventError403> {
  return response.status === 403;
}

export function isEventError404(response: EventError): response is EventError<EventError404> {
  return response.status === 404;
}

/**
 * More info: https://dev.fingerprintjs.com/docs/webhooks#identification-webhook-object-format
 */
export type VisitWebhook = components['schemas']['WebhookVisit'];
