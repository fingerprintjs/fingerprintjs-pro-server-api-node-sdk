import { FingerprintJsServerApiClient } from '@fingerprintjs/fingerprintjs-pro-server-api'

import { config } from 'dotenv'

config()

async function main() {
  const apiKey = process.env.API_KEY
  const visitorId = process.env.VISITOR_ID
  const region = process.env.REGION

  if (!visitorId) {
    console.error('Visitor ID not defined')

    process.exit(1)
  }

  if (!apiKey) {
    console.error('API key not defined')

    process.exit(1)
  }

  const client = new FingerprintJsServerApiClient({ region, apiKey: apiKey })

  try {
    await client.deleteVisitorData(visitorId)
    console.log(`Visitor ${visitorId} data deleted`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
