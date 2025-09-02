import { FingerprintJsServerApiClient, RequestError, Region } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { config } from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file from the same directory as this script
config({ path: join(__dirname, '.env') })

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
  await client.updateEvent(
    {
      tag: {
        key: 'value',
      },
      linkedId: 'new_linked_id',
      suspect: false,
    },
    requestId
  )

  console.log('Event updated')
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
