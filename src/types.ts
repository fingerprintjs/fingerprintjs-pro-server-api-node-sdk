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

export type EventResponse =
  paths['/events/{request_id}']['get']['responses']['200']['content']['application/json'];

/**
 * More info: https://dev.fingerprintjs.com/docs/webhooks#identification-webhook-object-format
 */
export type VisitWebhook = components['schemas']['WebhookVisit'];
