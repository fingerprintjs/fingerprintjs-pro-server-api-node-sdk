export enum Region {
    EU = "EU",
    Global = "Global",
  }
  
  export type VisitorHistoryFilter = {
    request_id?: string;
    linked_id?: string;
    limit?: number;
    before?: number;
  }
  
  export interface VisitorsResponse {
    lastTimestamp?: string;
    visitorId: string;
    visits: Visit[];
  }
  
  export interface Visit {
    requestId: string;
    incognito: string;
    linkedId: "string";
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
    subdivisions: [Subdivision]
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