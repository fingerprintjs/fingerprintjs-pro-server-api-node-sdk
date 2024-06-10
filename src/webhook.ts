import crypto from 'crypto'

function checkWebhookSignature(signature: string, data: Buffer, secret: string) {
  return signature === crypto.createHmac('sha256', secret).update(data).digest('hex')
}

/**
 * Verifies the HMAC signature extracted from the "fpjs-event-signature" header of the incoming request. This is a part of the webhook signing process, which is available only for enterprise customers.
 * If you wish to enable it, please contact our support: https://fingerprint.com/support
 *
 * @param header The value of the "fpjs-event-signature" header.
 * @param data The raw data of the incoming request.
 * @param secret The secret key used to sign the request.
 *
 * @return {boolean} true if the signature is valid, false otherwise.
 */
export function isValidHmacSignature(header: string, data: Buffer, secret: string): boolean {
  const signatures = header.split(',')
  for (const signature of signatures) {
    const [version, hash] = signature.split('=')
    if (version === 'v1') {
      if (checkWebhookSignature(hash, data, secret)) {
        return true
      }
    }
  }
  return false
}
