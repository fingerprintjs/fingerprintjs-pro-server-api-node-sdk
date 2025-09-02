import { FingerprintJsServerApiClient, Region, RequestError } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { config } from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file from the same directory as this script
config({ path: join(__dirname, '.env') })

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
  if (error instanceof RequestError) {
    console.log(error.statusCode, error.message)
  } else {
    console.error('unknown error: ', error)
  }
  process.exit(1)
}
