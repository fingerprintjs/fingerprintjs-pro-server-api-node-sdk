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
  <a href="https://fingerprintjs.github.io/fingerprintjs-pro-server-api-node-sdk/coverage"><img src="https://fingerprintjs.github.io/fingerprintjs-pro-server-api-node-sdk/coverage/badges.svg" alt="coverage"></a>
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

Initialize the client instance and use it to make API requests. You need to specify your Fingerprint [Secret API key](https://dev.fingerprint.com/docs/quick-start-guide#server-api-and-smart-signals) and the region of your Fingerprint application.

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

See the [Examples](./example) folder for more detailed examples.

### Error handling

The Server API methods like `getEvent` and `getVisitorHistory` can throw `EventError` and `VisitorsError`.
You can use the provided `isVisitorsError` and `isEventError` type guards to narrow down error types:

```typescript
import {
  isVisitorsError,
  isEventError,
  FingerprintJsServerApiClient,
} from '@fingerprintjs/fingerprintjs-pro-server-api'

const client = new FingerprintJsServerApiClient({
  apiKey: '<SECRET_API_KEY>',
  region: Region.Global,
})

// Handling getEvent errors
try {
  const event = await client.getEvent(requestId)
  console.log(JSON.stringify(event, null, 2))
} catch (error) {
  if (isEventError(error)) {
    console.log(error.responseBody) // Access parsed response body
    console.log(error.response) // You can also access the raw response
    console.log(`error ${error.statusCode}: `, error.message)
  } else {
    console.log('unknown error: ', error)
  }
}

// Handling getVisitorHistory errors
try {
  const visitorHistory = await client.getVisitorHistory(visitorId, {
    limit: 10,
  })
  console.log(JSON.stringify(visitorHistory, null, 2))
} catch (error) {
  if (isVisitorsError(error)) {
    console.log(error.status, error.error)
    if (error.status === 429) {
      retryLater(error.retryAfter) // Needs to be implemented on your side
    }
  } else {
    console.error('unknown error: ', error)
  }

  // You can also check for specific error instance
  // if(error instanceof VisitorsError403) {
  //    Handle 403 error...
  // }
}
```

You can also check for specific error instance:

```typescript
import {
  isVisitorsError,
  isEventError,
  FingerprintJsServerApiClient,
  VisitorsError429,
} from '@fingerprintjs/fingerprintjs-pro-server-api'

const client = new FingerprintJsServerApiClient({
  apiKey: '<SECRET_API_KEY>',
  region: Region.Global,
})

// Handling getEvent errors
try {
  const event = await client.getEvent(requestId)
  console.log(JSON.stringify(event, null, 2))
} catch (error) {
  if (isEventError(error)) {
    console.log(error.responseBody) // Access parsed response body
    console.log(error.response) // You can also access the raw response
    console.log(`error ${error.statusCode}: `, error.message)
  } else {
    console.log('unknown error: ', error)
  }
}

try {
  const visitorHistory = await client.getVisitorHistory(visitorId, {
    limit: 10,
  })
  console.log(JSON.stringify(visitorHistory, null, 2))
} catch (error) {
  if (error instanceof VisitorsError429) {
    retryLater(error.retryAfter) // Needs to be implemented on your side
  }

  throw error
}
```

### Webhooks

#### Webhook types

When handling [Webhooks](https://dev.fingerprint.com/docs/webhooks) coming from Fingerprint, you can cast the payload as the built-in `VisitWebhook` type:

```ts
import { VisitWebhook } from '@fingerprintjs/fingerprintjs-pro-server-api'

const visit = visitWebhookBody as unknown as VisitWebhook
```

#### Webhook signature validation

Customers on the Enterprise plan can enable [Webhook signatures](https://dev.fingerprint.com/docs/webhooks-security) to cryptographically verify the authenticity of incoming webhooks.
This SDK provides a utility method for verifying the HMAC signature of the incoming webhook request.

To learn more, see [example/validateWebhookSignature.mjs](example/validateWebhookSignature.mjs) or read the [API Reference](https://fingerprintjs.github.io/fingerprintjs-pro-server-api-node-sdk/functions/isValidWebhookSignature.html).

### Sealed results

Customers on the Enterprise plan can enable [Sealed results](https://dev.fingerprint.com/docs/sealed-client-results) to receive the full device intelligence result on the client and unseal it on the server. This SDK provides utility methods for decoding sealed results.

To learn more, see [example/unsealResult.mjs](./example/unsealResult.mjs) or the [API Reference](https://fingerprintjs.github.io/fingerprintjs-pro-server-api-node-sdk/functions/unsealEventsResponse.html).

### Deleting visitor data

Customers on the Enterprise plan can [Delete all data associated with a specific visitor](https://dev.fingerprint.com/reference/deletevisitordata) to comply with privacy regulations. See [example/deleteVisitor.mjs](./example/deleteVisitor.mjs) or the [API Reference](https://fingerprintjs.github.io/fingerprintjs-pro-server-api-node-sdk/classes/FingerprintJsServerApiClient.html#deleteVisitorData).

## API Reference

See the full [API reference](https://fingerprintjs.github.io/fingerprintjs-pro-server-api-node-sdk/).

## Support and feedback

To report problems, ask questions, or provide feedback, please use [Issues](https://github.com/fingerprintjs/fingerprintjs-pro-server-api-node-sdk/issues). If you need private support, you can email us at [oss-support@fingerprint.com](mailto:oss-support@fingerprint.com).

## License

This project is licensed under the [MIT license](./LICENSE).
