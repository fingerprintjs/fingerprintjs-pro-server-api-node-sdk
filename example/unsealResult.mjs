import { unsealEventsResponse, DecryptionAlgorithm } from '@fingerprintjs/fingerprintjs-pro-server-api'
import { config } from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file from the same directory as this script
config({ path: join(__dirname, '.env') })

const sealedData = process.env.BASE64_SEALED_RESULT
const decryptionKey = process.env.BASE64_KEY

if (!sealedData || !decryptionKey) {
  console.error('Please set BASE64_KEY and BASE64_SEALED_RESULT environment variables')
  process.exit(1)
}

try {
  const unsealedData = await unsealEventsResponse(Buffer.from(sealedData, 'base64'), [
    {
      key: Buffer.from(decryptionKey, 'base64'),
      algorithm: DecryptionAlgorithm.Aes256Gcm,
    },
  ])
  console.log(JSON.stringify(unsealedData, null, 2))
} catch (e) {
  console.error(e)
  process.exit(1)
}
