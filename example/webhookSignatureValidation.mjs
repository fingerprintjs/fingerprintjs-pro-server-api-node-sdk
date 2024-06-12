import { isValidWebhookSignature } from '@fingerprintjs/fingerprintjs-pro-server-api'

const header = 'v1=1b2c16b75bd2a870c114153ccda5bcfca63314bc722fa160d690de133ccbb9db'
const secret = 'secret'
const data = Buffer.from('data')

const isValid = isValidWebhookSignature({
  header,
  data,
  secret,
})

if (isValid) {
  console.log('Signature is valid!')
} else {
  console.log('Invalid signature')
}
