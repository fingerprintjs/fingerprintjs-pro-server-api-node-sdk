import { Region } from "./types";

export class FingerprintJsServerApiConfig {
    public readonly region: Region;
    public readonly authToken: string;
  
    constructor(region: Region, apiToken: string) {
      if (!region) {
        throw Error(`Region is not set`);
      }
  
      if (!apiToken) {
        throw Error(`Api token is not set`);
      }
  
      this.region = region;
      this.authToken = apiToken;
    }
  }
  