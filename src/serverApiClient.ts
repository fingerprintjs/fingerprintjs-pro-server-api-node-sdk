import fetch from 'node-fetch';
import { getVisitorsUrl } from './urlUtils';
import { FingerprintJsServerApiConfig } from './serverApiConfig';
import { VisitorHistoryFilter, VisitorsResponse } from './types';

export class FingerprintJsServerApiClient {
  private readonly clientConfig: FingerprintJsServerApiConfig;

  /**
  * FingerprintJS server API client used to fetch data from FingerprintJS
  * @constructor
  * @param {FingerprintJsServerApiConfig} config - The client configuration
  */
  constructor(config: FingerprintJsServerApiConfig) {
    if (!config) {
      throw new Error(`Config is not set`);
    }

    this.clientConfig = config;
  }

  /**
  * Gets history for the given visitor
  * @param {string} visitorId - Identifier of the visitor
  * @param {VisitorHistoryFilter} filter - Visitor history filter
  */
  public async getVisitorHistory(visitorId: string, filter?: VisitorHistoryFilter): Promise<VisitorsResponse> {
    if (!visitorId) {
      throw Error(`VisitorId is not set`);
    }

    const url = getVisitorsUrl(this.clientConfig.region, visitorId, filter);

    return fetch(url, {
      method: 'GET',
      headers: { 'Auth-Token': this.clientConfig.apiToken },
    })
      .then((response) => {
        return response.json()
          .then(jsonData => {
            const visitorsResponse = jsonData as VisitorsResponse;
            return visitorsResponse;
          })
          .catch(err => {
            throw new Error(err.toString());
          })
      })
      .catch((err) => {
        throw new Error(err.toString());
      })
  }
}