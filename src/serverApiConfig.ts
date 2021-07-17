import { Region } from "./types";

export class FingerprintJsServerApiConfig {
  public readonly region: Region;
  public readonly apiToken: string;

  /**
  * FingerprintJS server api config
  * @constructor
  * @param {Region} region - Server API region
  * @param {string} apiToken - API token
  */
  constructor(region: Region, apiToken: string) {
    if (!region) {
      throw Error(`Region is not set`);
    }

    if (!apiToken) {
      throw Error(`Api token is not set`);
    }

    this.region = region;
    this.apiToken = apiToken;
  }
}
