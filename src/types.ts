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
}

export type VisitorHistoryFilter = {
  request_id?: string;
  linked_id?: string;
  limit?: number;
  before?: number;
};

export interface VisitorsResponse {
  lastTimestamp?: string;
  visitorId: string;
  visits: Visit[];
}

export interface Visit {
  requestId: string;
  incognito: string;
  linkedId: 'string';
  time: Date;
  timestamp: number;
  url: string;
  ip: string;
  ipLocation: IpLocation;
  browserDetails: BrowserDetails;
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

export interface VisitWebhook {
  // Unique request identifier
  // nullable: false, maxLength: 20
  requestId: string;
  // customer-provided data, for example requestType and yourCustomId
  // both the tag and the information it contains are optional
  // and only for the customer's need.
  // nullable: true, maxLength: 4096
  tag: any | null;
  // user-provided scalar identifier
  // nullable: true, maxLength: 4096
  linkedId: string | null;
  // persistent visitor identifier
  // helpful to detect anonymous or private mode users
  // nullable: false, maxLength: 20
  visitorId: string;
  // timestamp in milliseconds (since unix epoch)
  // nullable: false
  timestamp: number;
  // if the page view was made in incognito or private mode
  // nullable: false
  incognito: boolean;
  // URL where the API was called in the browser
  // nullable: false, maxLength: 4096
  url: string;
  // The URL of a client-side referrer
  // nullable: true, maxLength: 4096
  clientReferrer: string | null;
  // nullable: false, maxLength: 40
  ip: string;
  // nullable: false
  ipLocation: {
    // miles
    // nullable: true
    accuracyRadius: number | null;
    // nullable: true
    city: {
      // nullable: true, maxLength: 4096
      name: string | null;
    } | null;
    // nullable: true
    continent: {
      // nullable: true, maxLength: 2
      code: string | null;
      // nullable: true, maxLength: 40
      name: string | null;
    } | null;
    // nullable: true
    country: {
      // nullable: true, maxLength: 2
      code: string | null;
      // nullable: true, maxLength: 250
      name: string | null;
    } | null;
    // nullable: true
    latitude: number | null;
    // nullable: true
    longitude: number | null;
    // nullable: true, maxLength: 40
    postalCode: string | null;
    // nullable: true
    subdivisions:
      | {
          // nullable: true, maxLength: 250
          isoCode: string | null;
          // nullable: true, maxLength: 250
          name: string | null;
        }[]
      | null;
    // nullable: true, maxLength: 250
    timezone: string | null;
  };
  // nullable: false
  browserDetails: {
    // nullable: true, maxLength: 250
    browserName: string | null;
    // nullable: true, maxLength: 250
    browserFullVersion: string | null;
    // nullable: true, maxLength: 250
    browserMajorVersion: string | null;
    // nullable: true, maxLength: 250
    os: string | null;
    // nullable: true, maxLength: 250
    osVersion: string | null;
    // nullable: true, maxLength: 250
    device: string | null;
    // nullable: true, maxLength: 4096
    userAgent: string | null;
  };
}
