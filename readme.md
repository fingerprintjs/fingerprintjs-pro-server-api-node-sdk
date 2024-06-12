<p align="center">
  <a href="https://fingerprint.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://fingerprintjs.github.io/home/resources/logo_light.svg" />
      <source media="(prefers-color-scheme: light)" srcset="https://fingerprintjs.github.io/home/resources/logo_dark.svg" />
      <img src="https://fingerprintjs.github.io/home/resources/logo_dark.svg" alt="Fingerprint logo" width="312px" />
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/actions/workflows/build.yml"><img src="https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/actions/workflows/build.yml/badge.svg" alt="Build status"></a>
  <a href="https://fingerprintjs.github.io/fingerprintjs-pro-server-api-node-sdk/"><img src="https://fingerprintjs.github.io/fingerprintjs-pro-server-api-node-sdk/badges.svg" alt="coverage"></a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-server-api"><img src="https://img.shields.io/npm/v/@fingerprintjs/fingerprintjs-pro-server-api.svg" alt="Current NPM version"></a>
  <a href="https://www.npmjs.com/package/@fingerprintjs/fingerprintjs-pro-server-api"><img src="https://img.shields.io/npm/dm/@fingerprintjs/fingerprintjs-pro-server-api.svg" alt="Monthly downloads from NPM"></a>
  <a href="https://discord.gg/39EpE2neBg"><img src="https://img.shields.io/discord/852099967190433792?style=logo&label=Discord&logo=Discord&logoColor=white" alt="Discord server"></a>
</p>

# Fingerprint Server API Node.js SDK

[Fingerprint](https://fingerprint.com) is a device intelligence platform offering 99.5% accurate visitor identification.

The Fingerprint Server Node SDK is an easy way to interact with the Fingerprint [Server API](https://dev.fingerprint.com/reference/pro-server-api) from your Node application. You can retrieve visitor history or individual identification events.

## Requirements

TypeScript support:

- TypeScript 4.5.5 or higher

Supported runtimes:

- Node.js 18 LTS or higher (we support all [Node LTS releases before end-of-life](https://nodejs.dev/en/about/releases/)).
- Deno and Bun might work but are not actively tested.
- "Edge" runtimes might work with some modifications but are not actively tested. <details>
  <summary>See "edge" runtimes compatibility</summary>

  This SDK can be made compatible with JavaScript "edge" runtimes that do not support all Node APIs, for example, [Vercel Edge Runtime](https://edge-runtime.vercel.app/), or [Cloudflare Workers](https://developers.cloudflare.com/workers/).

  To make it work, replace the SDK's built-in `fetch` function (which relies on Node APIs) with the runtime's native `fetch` function. Pass the function into the constructor with proper binding:

  ```js
  const client = new FingerprintJsServerApiClient({
    region: Region.EU,
    apiKey: apiKey,
    fetch: fetch.bind(globalThis),
  })
  ```

</details>

## How to install

Install the package using your favorite package manager:

- NPM:

  ```sh
  npm i @fingerprintjs/fingerprintjs-pro-server-api
  ```

- Yarn:
  ```sh
  yarn add @fingerprintjs/fingerprintjs-pro-server-api
  ```
- pnpm:
  ```sh
  pnpm i @fingerprintjs/fingerprintjs-pro-server-api
  ```

## Getting started

Initialize the client instance and use it to make API requests. You need to specify your Fingerprint [Secret API key](https://dev.fingerprint.com/docs/quick-start-guide#server-api) and the region of your Fingerprint application.

```ts
import {
  FingerprintJsServerApiClient,
  Region,
} from '@fingerprintjs/fingerprintjs-pro-server-api'

const client = new FingerprintJsServerApiClient({
  apiKey: '<SECRET_API_KEY>',
  region: Region.Global,
})

// Get visit history of a specific visitor
client.getVisitorHistory('<visitorId>').then((visitorHistory) => {
  console.log(visitorHistory)
})

// Get a specific identification event
client.getEvent('<requestId>').then((event) => {
  console.log(event)
})
```

### Using with TypeScript

#### Webhook types

When handling [Webhooks](https://dev.fingerprint.com/docs/webhooks) coming from Fingerprint, you can cast the payload as the built-in `VisitWebhook` type:

```ts
const visit = visitWebhookBody as unknown as VisitWebhook
```

#### Narrowing error types

The `getEvent` and `getVisitorHistory` methods can throw `EventError` and `VisitorsError`.
You can use the provided `isVisitorsError` and `isEventError` type guards to narrow down error types:

```typescript
import {
  isVisitorsError,
  isEventError,
} from '@fingerprintjs/fingerprintjs-pro-server-api'

client
  .getVisitorHistory('<visitorId>', filter)
  .then((result) => console.log(result))
  .catch((err) => {
    if (isVisitorsError(err)) {
      if (err.status === 429) {
        // VisitorsError429 type

        // You can also access the raw response
        console.log(err.response)

        retryLater(err.retryAfter) // this function needs to be implemented on your side
      } else {
        console.log('error: ', err.error)
      }
    } else {
      console.log('unknown error: ', err)
    }
  })

client
  .getEvent('<requestId>')
  .then((result) => console.log(result))
  .catch((err) => {
    if (isEventError(err)) {
      // You can also access the raw response
      console.log(err.response)

      console.log(`error ${err.status}: `, err.error?.message)
    } else {
      console.log('unknown error: ', err)
    }
  })
```

## Sealed results

This SDK provides utility methods for decoding sealed results.
To learn more, see the example in [example/sealedResults.mjs](./example/sealedResults.mjs) or the [API Reference](https://fingerprintjs.github.io/fingerprintjs-pro-node-sdk/functions/unsealEventsResponse.html).

## Webhook signature validation

This SDK provides utility method for verifying the HMAC signature of the incoming webhook request.
To learn more, see the example in [example/webhookSignatureValidation.mjs](example/webhookSignatureValidation.mjs) or the [API Reference](https://fingerprintjs.github.io/fingerprintjs-pro-node-sdk/functions/isValidWebhookSignature.html).

## API Reference

See the full [API reference](https://fingerprintjs.github.io/fingerprintjs-pro-node-sdk/).

## Support and feedback

To report problems, ask questions or provide feedback, please use [Issues](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/issues). If you need private support, you can email us at [oss-support@fingerprint.com](mailto:oss-support@fingerprint.com).

## License

This project is licensed under the [MIT license](./LICENSE).
