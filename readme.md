<p align="center">
  <a href="https://fingerprintjs.com">
    <img src="https://user-images.githubusercontent.com/10922372/126062498-31921b6c-c7fd-47cb-bf85-9e172e08b664.png" alt="FingerprintJS" width="312px" />
  </a>
<p align="center">
<a href="https://www.npmjs.com/package/fingerprintjs-server-api">
  <img src="https://img.shields.io/npm/v/fingerprintjs-server-api.svg" alt="Current NPM version">
</a>
<a href="https://www.npmjs.com/package/fingerprintjs-server-api">
  <img src="https://img.shields.io/npm/dm/fingerprintjs-server-api.svg" alt="Monthly downloads from NPM">
</a>
  <a href="https://discord.gg/39EpE2neBg">
    <img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server">
  </a>
    
# [Beta WIP] FingerprintJS Server API Node.js SDK
Node.js wrapper for [FingerprintJS Sever API](https://dev.fingerprintjs.com/docs/server-api)

## Usage

Install package
```sh
npm i fingerprintjs-server-api
```

After moving under FingerprintJS organization
``` sh
npm i @fingerprintjs/fingerprintjs-pro-server-api
```

### Usage of the Server API
```ts
import { FingerprintJsServerApiClient, Region } from 'fingerprintjs-server-api';

// Init client with the give region and api_token
const client = new FingerprintJsServerApiClient({region: Region.Global, apiToken: "<api_token>"});

// Get visitor history
client.getVisitorHistory("<visitorId>").then(visitorHistory => {
    console.log(visitorHistory);
});

```

### Usage of the built-in webhook visit type
```ts
const visit = visitWebhookBody as unknown as VisitWebhook;
```

## API
---
### `FingerprintJsServerApiClient({region: Region, apiToken: string})` constructor
Creates an instance of the client.
#### Usage
```js
const client = new FingerprintJsServerApiClient({Region.EU, "<api_token>"});
```
#### Params
- `region: Region` - a region of the server, possible value `Region.EU` or `Region.Global`
- `apiToken: string` - API token from the [FingerprintJS dashboard](https://dashboard.fingerprintjs.com/)
---

### `client.getVisitorHistory(visitorId: string, filter?: VisitorHistoryFilter): Promise<VisitorsResponse>`
Gets history for the given visitor and given filter, returns a promise with visitor history response.
#### Usage
```js
client.getVisitorHistory("<visitorId>", filter).then(visitorHistory => {
    console.log(visitorHistory);
});
```
#### Params
- `visitorId: string` - identifier of the visitor
- `filter?: VisitorHistoryFilter` - visitor history filter, more info in [the API documentation](https://dev.fingerprintjs.com/docs/server-api#query-parameters)
#### Returns
- `Promise<VisitorsResponse>` - promise with visitor history response
---
### `VisitorHistoryFilter`
Filter for querying API - see [query parameters](VisitorHistoryFilter).
### Usage
```js
const filter = {
    request_id: "<request_id>",
    linked_id: "<linked_id>",
    limit: 5,
    before: "<timeStamp>"
};
```
#### Properties
- `request_id: string` - filter events by requestId
- `linked_id: string` - filter events by custom identifier
- `limit: number` - limit scanned results
- `before: number` - used to paginate results
---
### Server `VisitorsResponse` response
```json
{
  "visitorId": "Ibk1527CUFmcnjLwIs4A9",
  "visits": [
    {
      "requestId": "0KSh65EnVoB85JBmloQK",
      "incognito": true,
      "linkedId": "somelinkedId",
      "time": "2019-05-21T16:40:13Z",
      // timestamp of the event with millisecond precision
      "timestamp": 1582299576512,
      "url": "https://www.example.com/login",
      "ip": "61.127.217.15",
      "ipLocation": {
        "accuracyRadius": 10,
        "latitude": 49.982,
        "longitude": 36.2566,
        "postalCode": "61202",
        "timezone": "Europe/Dusseldorf",
        "city": {
          "name": "Dusseldorf"
        },
        "continent": {
          "code": "EU",
          "name": "Europe"
        },
        "country": {
          "code": "DE",
          "name": "Germany"
        },
        "subdivisions": [
          {
            "isoCode": "63",
            "name": "North Rhine-Westphalia"
          }
        ],
      },
      "browserDetails": {
        "browserName": "Chrome",
        "browserMajorVersion": "74",
        "browserFullVersion": "74.0.3729",
        "os": "Windows",
        "osVersion": "7",
        "device": "Other",
        "userAgent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) ....",
      }
    }
  ],
  // optional, if more results are available for pagination.
  "lastTimestamp": 1582299576512
}
```
---
## Release new version
Change version in package.json to 1.2.3 and push a commit with the message Release 1.2.3, the npm-publish action will create a new tag v1.2.3 and publish the package to the npm registry.
