import { FingerprintJsServerApiClient, Region, RequestError } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { config } from 'dotenv'
config()

const apiKey = process.env.API_KEY
const requestId = process.env.REQUEST_ID
const envRegion = process.env.REGION

if (!requestId) {
  console.error('Request ID not defined')
  process.exit(1)
}

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

const client = new FingerprintJsServerApiClient({ region, apiKey })

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
