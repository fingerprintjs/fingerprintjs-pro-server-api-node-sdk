import fetchFn from 'node-fetch';
import { getEventUrl, getVisitorsUrl } from './urlUtils';
import {
  VisitorHistoryFilter,
  VisitorsResponse,
  Region,
  Options,
  AuthenticationMode,
  EventResponse,
  EventError,
  isEventError,
  VisitorsError,
  isVisitorsError,
} from './types';

export class FingerprintJsServerApiClient {
  public readonly region: Region;

  public readonly apiKey: string;

  public readonly authenticationMode: AuthenticationMode;

  protected readonly fetch: typeof fetchFn;

  /**
   * FingerprintJS server API client used to fetch data from FingerprintJS
   * @constructor
   * @param {Options} options - Options for FingerprintJS server API client
   */
  constructor(options: Readonly<Options>) {
    if (!options.region) {
      throw Error('Region is not set');
    }

    if (!options.apiKey) {
      throw Error('Api key is not set');
    }

    this.region = options.region;
    this.apiKey = options.apiKey;
    this.authenticationMode = options.authenticationMode ?? AuthenticationMode.AuthHeader; // Default auth mode is AuthHeader
    this.fetch = options.fetch ?? fetchFn;
  }

  public async getEvent(requestId: string) {
    if (!requestId) {
      throw new TypeError('requestId is not set');
    }

    const url =
      this.authenticationMode === AuthenticationMode.QueryParameter
        ? getEventUrl(requestId, this.region, this.apiKey)
        : getEventUrl(requestId, this.region);

    const headers = this.getHeaders();

    return this.fetch(url, {
      method: 'GET',
      headers,
    })
      .then(async (response) => {
        const jsonResponse = await response.json();
        if (response.status !== 200) {
          jsonResponse.status = response.status;
          throw jsonResponse as EventError;
        }
        return jsonResponse as EventResponse;
      })
      .catch((err) => {
        if (isEventError(err)) {
          throw err;
        }
        const error = err instanceof Error ? err.toString() : JSON.stringify(err);
        throw {
          status: 0,
          error: error,
        };
      });
  }

  /**
   * Gets history for the given visitor
   * @param {string} visitorId - Identifier of the visitor
   * @param {VisitorHistoryFilter} filter - Visitor history filter
   */
  public async getVisitorHistory(
    visitorId: string,
    filter?: VisitorHistoryFilter
  ): Promise<VisitorsResponse> {
    if (!visitorId) {
      throw TypeError('VisitorId is not set');
    }

    const url =
      this.authenticationMode === AuthenticationMode.QueryParameter
        ? getVisitorsUrl(this.region, visitorId, filter, this.apiKey)
        : getVisitorsUrl(this.region, visitorId, filter);
    const headers = this.getHeaders();

    return this.fetch(url, {
      method: 'GET',
      headers,
    })
      .then(async (response) => {
        const jsonResponse = await response.json();
        if (response.status === 200) {
          return jsonResponse as VisitorsResponse;
        }
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after') || '';
          jsonResponse.retryAfter = retryAfter === '' ? 1 : parseInt(retryAfter);
        }
        jsonResponse.status = response.status;
        throw jsonResponse as VisitorsError;
      })
      .catch((err) => {
        if (isVisitorsError(err)) {
          throw err;
        }
        throw {
          status: 0,
          error: new Error(err.toString()),
        };
      });
  }

  private getHeaders() {
    return this.authenticationMode === AuthenticationMode.AuthHeader
      ? { 'Auth-API-Key': this.apiKey }
      : undefined;
  }
}
