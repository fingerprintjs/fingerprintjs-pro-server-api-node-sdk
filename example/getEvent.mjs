import { FingerprintJsServerApiClient, Region, isEventError } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { config } from 'dotenv'
config()

const apiKey = process.env.API_KEY || 'API key not defined'
const requestId = process.env.REQUEST_ID || 'Request ID not defined'
const envRegion = process.env.REGION

let region = Region.Global
if (envRegion === 'eu') {
  region = Region.EU
} else if (envRegion === 'ap') {
  region = Region.AP
}

if (!requestId) {
  console.error('Visitor ID not defined')
  process.exit(1)
}

if (!apiKey) {
  console.error('API key not defined')
  process.exit(1)
}

const client = new FingerprintJsServerApiClient({ region, apiKey })

try {
  const event = await client.getEvent(requestId)
  console.log(JSON.stringify(event, null, 2))
} catch (error) {
  if (isEventError(error)) {
    // You can also access the raw response
    console.log(error.response)
    console.log(`error ${error.status}: `, error.error?.message)
  } else {
    console.log('unknown error: ', error)
  }
  process.exit(1)
}
