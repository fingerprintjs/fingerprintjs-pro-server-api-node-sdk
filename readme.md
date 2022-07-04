<p align="center">
  <a href="https://fingerprintjs.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="resources/logo_light.svg" />
      <source media="(prefers-color-scheme: light)" srcset="resources/logo_dark.svg" />
      <img src="resources/logo_dark.svg" alt="Fingerprint logo" width="312px" />
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/actions/workflows/build.yml">
    <img src="https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/actions/workflows/build.yml/badge.svg" alt="Build status">
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-server-api">
    <img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs-pro-server-api.svg" alt="Current NPM version">
  </a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-server-api">
    <img src="https://img.shields.io/npm/dm/@fingerprintjs/fingerprintjs-pro-server-api.svg" alt="Monthly downloads from NPM">
  </a>
  <a href="https://discord.gg/39EpE2neBg">
    <img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server">
  </a>
</p>

# FingerprintJS Server API Node.js SDK
Node.js wrapper for [FingerprintJS Server API](https://dev.fingerprintjs.com/docs/server-api)

## Usage

Install package using npm
``` sh
npm i @fingerprintjs/fingerprintjs-pro-server-api
```

Or install package using yarn
``` sh
yarn add @fingerprintjs/fingerprintjs-pro-server-api
```

### Usage of the Server API
```ts
import { FingerprintJsServerApiClient, Region } from '@fingerprintjs/fingerprintjs-pro-server-api';

// Init client with the given region and the secret api_key
const client = new FingerprintJsServerApiClient({region: Region.Global, apiKey: "<api_key>"});

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

#### `FingerprintJsServerApiClient({region: Region, apiKey: string})` constructor
Creates an instance of the client.
##### Usage
```js
const client = new FingerprintJsServerApiClient({region: Region.EU, apiKey: "<api_key>"});
```
##### Params
- `region: Region` - a region of the server, possible value `Region.EU` or `Region.Global`
- `apiKey: string` - secret API key from the [FingerprintJS dashboard](https://dashboard.fingerprintjs.com/)
- `fetch?: typeof fetch` - optional implementation of `fetch` function (defaults to `node-fetch`)
---

#### `client.getVisitorHistory(visitorId: string, filter?: VisitorHistoryFilter): Promise<VisitorsResponse>`
Gets history for the given visitor and given filter, returns a promise with visitor history response.
##### Usage
```js
client.getVisitorHistory("<visitorId>", filter).then(visitorHistory => {
    console.log(visitorHistory);
});
```
##### Params
- `visitorId: string` - identifier of the visitor
- `filter?: VisitorHistoryFilter` - visitor history filter, more info in [the API documentation](https://dev.fingerprintjs.com/docs/server-api#query-parameters)
##### Returns
- `Promise<VisitorsResponse>` - promise with visitor history response
---
#### `VisitorHistoryFilter`
Filter for querying API - see [query parameters](https://dev.fingerprintjs.com/docs/server-api#query-parameters).
##### Usage
```js
const filter = {
    request_id: "<request_id>",
    linked_id: "<linked_id>",
    limit: 5,
    before: "<timeStamp>"
};
```
##### Properties
- `request_id: string` - filter events by requestId
- `linked_id: string` - filter events by custom identifier
- `limit: number` - limit scanned results
- `before: number` - used to paginate results
---
#### Server `VisitorsResponse` response
Find more info in [the API documentation](https://dev.fingerprintjs.com/docs/server-api#response)
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
      },
      "confidence": {
        "score": 0.97
      },
      "visitorFound": true,
      "firstSeenAt": {
        "global": "2022-03-16T11:26:45.362Z",
        "subscription": "2022-03-16T11:31:01.101Z"
      },
      "lastSeenAt": {
        "global": "2022-03-16T11:28:34.023Z",
        "subscription": null
      }
    }
  ],
  // optional, if more results are available for pagination.
  "lastTimestamp": 1582299576512
}
```
---
## Release new version

- Create a new branch
- Run `yarn release:(major|minor|patch)` depending on the version you need
- Make a pull request
- After merging the pull request into the main branch and after successful tests, GitHub Action will publish a new version to the npm
