import fetch from 'node-fetch';
import { getVisitorsUrl } from './urlUtils';
import { VisitorHistoryFilter, VisitorsResponse, Region, Options } from './types';

export class FingerprintJsServerApiClient {
  public readonly region: Region;
  public readonly apiToken: string;

  /**
  * FingerprintJS server API client used to fetch data from FingerprintJS
  * @constructor
  * @param {Options} options - Options for FingerprintJS server API client
  */
  constructor(options: Readonly<Options>) {
    if (!options.region) {
      throw Error(`Region is not set`);
    }

    if (!options.apiToken) {
      throw Error(`Api token is not set`);
    }

    this.region = options.region;
    this.apiToken = options.apiToken;
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

    const url = getVisitorsUrl(this.region, visitorId, filter);

    return fetch(url, {
      method: 'GET',
      headers: { 'Auth-Token': this.apiToken },
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