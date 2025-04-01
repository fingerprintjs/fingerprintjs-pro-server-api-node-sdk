import { FingerprintJsServerApiClient, Region, RequestError } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { config } from 'dotenv'
config()

const apiKey = process.env.API_KEY
const envRegion = process.env.REGION

if (!apiKey) {
  console.error('API key not defined')
  process.exit(1)
}

let region = Region.Global
if (envRegion === 'eu') {
  region = Region.EU
} else if (envRegion === 'ap') {
  region = Region.AP
}

const end = Date.now()
const start = end - 90 * 24 * 60 * 60 * 1000

const client = new FingerprintJsServerApiClient({ region, apiKey })
let visitorId, requestId

// test search events
try {
  const searchEventsResponse = await client.searchEvents({ limit: 2, start, end })
  if (searchEventsResponse.events.length === 0) {
    console.log('FingerprintJsServerApiClient.searchEvents: is empty')
    process.exit(1)
  }
  const firstEvent = searchEventsResponse.events[0]
  visitorId = firstEvent.products.identification.data.visitorId
  requestId = firstEvent.products.identification.data.requestId

  console.log(JSON.stringify(searchEventsResponse, null, 2))
  const searchEventsResponseSecondPage = await client.searchEvents({
    limit: 2,
    start,
    end,
    pagination_key: firstEvent.pagination_key,
  })
  if (searchEventsResponseSecondPage.events.length === 0) {
    console.log('Second page of FingerprintJsServerApiClient.searchEvents: is empty')
    process.exit(1)
  }
} catch (error) {
  if (error instanceof RequestError) {
    console.log(`error ${error.statusCode}: `, error.message)
    // You can also access the raw response
    console.log(error.response.statusText)
  } else {
    console.log('unknown error: ', error)
  }
  process.exit(1)
}

// Test getEvent
try {
  const event = await client.getEvent(requestId)
  console.log(JSON.stringify(event, null, 2))
} catch (error) {
  if (error instanceof RequestError) {
    console.log(`error ${error.statusCode}: `, error.message)
    // You can also access the raw response
    console.log(error.response.statusText)
  } else {
    console.log('unknown error: ', error)
  }
  process.exit(1)
}

// Test getVisits
try {
  const visitorHistory = await client.getVisits(visitorId, { limit: 10 })
  console.log(JSON.stringify(visitorHistory, null, 2))
} catch (error) {
  if (error instanceof RequestError) {
    console.log(error.statusCode, error.message)
    if (error instanceof TooManyRequestsError) {
      retryLater(error.retryAfter) // Needs to be implemented on your side
    }
  } else {
    console.error('unknown error: ', error)
  }
  process.exit(1)
}

// Check that old events are still match expected format
try {
  const searchEventsResponseOld = await client.searchEvents({ limit: 2, start, end, reverse: true })
  if (searchEventsResponseOld.events.length === 0) {
    console.log('FingerprintJsServerApiClient.searchEvents: is empty for old events')
    process.exit(1)
  }
  const oldEventIdentificationData = searchEventsResponseOld.events[0].products.identification.data
  const visitorIdOld = oldEventIdentificationData.visitorId
  const requestIdOld = oldEventIdentificationData.requestId

  if (visitorId === visitorIdOld || requestId === requestIdOld) {
    console.log('Old events are identical to new')
    process.exit(1)
  }
  await client.getEvent(requestIdOld)
  await client.getVisits(visitorIdOld)
  console.log('Old events are good')
} catch (error) {
  if (error instanceof RequestError) {
    console.log(`error ${error.statusCode}: `, error.message)
    // You can also access the raw response
    console.log(error.response.statusText)
  } else {
    console.log('unknown error: ', error)
  }
  process.exit(1)
}
