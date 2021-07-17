# FingerprintJS Server API Node.js SDK
## Usage

Install package
```sh
npm i --save TODO
```

```ts
import TODO from "TODO";

// Create config object first
const config = new FingerprintJsServerApiConfig(Region.EU, "<authToken>");

// Init client with the give config
const client = new FingerprintJsServerApiClient(config);

// Get visitor history
const visitorHistory = await client.getVisitorHistory(existingVisitorId);
```

## API

### getVisitors
#### Params
- visitorId
- filter

### Client config
#### Params
- region
- authToken

## Response
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