import { FingerprintJsServerApiClient, Region, isDeleteVisitorError } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { config } from 'dotenv'
config()

const apiKey = process.env.API_KEY
const visitorId = process.env.VISITOR_ID
const envRegion = process.env.REGION

if (!visitorId) {
  console.error('Visitor ID not defined')
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
  await client.deleteVisitorData(visitorId)
  console.log(`All data associated with visitor ${visitorId} is scheduled to be deleted.`)
} catch (error) {
  if (isDeleteVisitorError(error)) {
    console.log(error.statusCode, error.message)
  } else {
    console.error('unknown error: ', error)
  }
  process.exit(1)
}
