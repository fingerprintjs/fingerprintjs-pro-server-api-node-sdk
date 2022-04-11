import type fetchFn from 'node-fetch';

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
export type VisitorHistoryFilter = {
  request_id?: string;
  linked_id?: string;
  limit?: number;
  before?: number;
};

/**
 * More info: https://dev.fingerprintjs.com/docs/server-api#response
 */
export interface VisitorsResponse {
  visitorId: string;
  visits: Visit[];
  lastTimestamp?: number;
}

export interface Visit {
  requestId: string;
  incognito: string;
  linkedId: string;
  time: Date;
  timestamp: number;
  url: string;
  ip: string;
  ipLocation: IpLocation;
  browserDetails: BrowserDetails;
  confidence: Confidence;
  visitorFound: boolean;
  firstSeenAt: SeenAt;
  lastSeenAt: SeenAt;
}

export interface IpLocation {
  accuracyRadius: number;
  latitude: number;
  longitude: number;
  postalCode: string;
  timezone: string;
  city: City;
  continent: Continent;
  country: Country;
  subdivisions: Subdivision[];
}

export interface City {
  name: string;
}

export interface Continent {
  code: string;
  name: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface Subdivision {
  isoCode: string;
  name: string;
}

export interface BrowserDetails {
  browserName: string;
  browserMajorVersion: string;
  browserFullVersion: string;
  os: string;
  osVersion: string;
  device: string;
  userAgents: string;
}

export interface Confidence {
  score: number;
}

export interface SeenAt {
  global: Date | null;
  subscription: Date | null;
}

/**
 * More info: https://dev.fingerprintjs.com/docs/webhooks#identification-webhook-object-format
 */
export interface VisitWebhook {
  requestId: string;
  tag: any | null;
  linkedId: string | null;
  visitorId: string;
  visitorFound: boolean | null;
  timestamp: number;
  time: Date;
  incognito: boolean;
  url: string;
  clientReferrer: string | null;
  ip: string;
  ipLocation: {
    accuracyRadius: number | null;
    city: {
      name: string | null;
    } | null;
    continent: {
      code: string | null;
      name: string | null;
    } | null;
    country: {
      code: string | null;
      name: string | null;
    } | null;
    latitude: number | null;
    longitude: number | null;
    postalCode: string | null;
    subdivisions:
      | {
          isoCode: string | null;
          name: string | null;
        }[]
      | null;
    timezone: string | null;
  };
  browserDetails: {
    browserName: string | null;
    browserFullVersion: string | null;
    browserMajorVersion: string | null;
    os: string | null;
    osVersion: string | null;
    device: string | null;
    userAgent: string | null;
  };
  confidence: Confidence | null;
  firstSeenAt: SeenAt;
  lastSeenAt: SeenAt;
}
