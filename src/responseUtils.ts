import { SdkError } from './errors/apiErrors'
import { toError } from './utils'

export async function copyResponseJson(response: Response) {
  try {
    return await response.clone().json()
  } catch (e) {
    throw new SdkError('Failed to parse JSON response', response, toError(e))
  }
}
