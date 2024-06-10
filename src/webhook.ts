import crypto from 'crypto'

function checkWebhookSignature(signature: string, data: Buffer, secret: string) {
  return signature === crypto.createHmac('sha256', secret).update(data).digest('hex')
}

export interface IsValidHmacSignatureParams {
  /**
   * The value of the "fpjs-event-signature" header.
   * */
  header: string
  /**
   * The raw data of the incoming request
   * */
  data: Buffer
  /**
   * The secret key used to sign the request.
   * */
  secret: string
}

/**
 * Verifies the HMAC signature extracted from the "fpjs-event-signature" header of the incoming request. This is a part of the webhook signing process, which is available only for enterprise customers.
 * If you wish to enable it, please contact our support: https://fingerprint.com/support
 *
 * @param {IsValidHmacSignatureParams} params
 * @param {string} params.signatureHeader - The value of the "fpjs-event-signature" header.
 * @param {Buffer} params.data - The raw data of the incoming request.
 * @param {string} params.secret - The secret key used to sign the request.
 *
 * @return {boolean} true if the signature is valid, false otherwise.
 *
 * @example
 * ```javascript
 * // Webhook endpoint handler
 * export async function POST(request: Request) {
 *   try {
 *     const secret = process.env.WEBHOOK_SIGNATURE_SECRET;
 *     const header = request.headers.get("fpjs-event-signature");
 *     const data = Buffer.from(await request.arrayBuffer());
 *
 *     if (!isValidWebhookSignature({ header, data, secret })) {
 *       return Response.json(
 *         { message: "Webhook signature is invalid." },
 *         { status: 403 },
 *       );
 *     }
 *
 *     return Response.json({ message: "Webhook received." });
 *   } catch (error) {
 *     return Response.json({ error: e }, { status: 500 });
 *   }
 * }
 * ```
 */
export function isValidHmacSignature(params: IsValidHmacSignatureParams): boolean {
  const { header, data, secret } = params

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
