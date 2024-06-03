import { getDeleteVisitorDataUrl, getEventUrl, getVisitorsUrl } from './urlUtils'
import {
  AuthenticationMode,
  DeleteVisitorError,
  EventError,
  EventResponse,
  isDeleteVisitorError,
  isEventError,
  isVisitorsError,
  Options,
  Region,
  VisitorHistoryFilter,
  VisitorsError,
  VisitorsError429,
  VisitorsResponse,
} from './types'

export class FingerprintJsServerApiClient {
  public readonly region: Region

  public readonly apiKey: string

  public readonly authenticationMode: AuthenticationMode

  protected readonly fetch: typeof fetch

  /**
   * FingerprintJS server API client used to fetch data from FingerprintJS
   * @constructor
   * @param {Options} options - Options for FingerprintJS server API client
   */
  constructor(options: Readonly<Options>) {
    if (!options.region) {
      throw Error('Region is not set')
    }

    if (!options.apiKey) {
      throw Error('Api key is not set')
    }

    this.region = options.region
    this.apiKey = options.apiKey
    this.authenticationMode = options.authenticationMode ?? AuthenticationMode.AuthHeader // Default auth mode is AuthHeader
    this.fetch = options.fetch ?? fetch
  }

  public async getEvent(requestId: string) {
    if (!requestId) {
      throw new TypeError('requestId is not set')
    }

    const url =
      this.authenticationMode === AuthenticationMode.QueryParameter
        ? getEventUrl(requestId, this.region, this.apiKey)
        : getEventUrl(requestId, this.region)

    const headers = this.getHeaders()

    return this.fetch(url, {
      method: 'GET',
      headers,
    })
      .then(async (response) => {
        const jsonResponse = await response.json()
        if (response.status !== 200) {
          throw { ...jsonResponse, response, status: response.status } as EventError
        }
        return jsonResponse as EventResponse
      })
      .catch((err: Error) => {
        if (isEventError(err)) {
          throw err
        }

        throw {
          status: 0,
          error: err,
        }
      })
  }

  /**
   * Delete data by visitor ID
   * Request deleting all data associated with the specified visitor ID. This API is useful for compliance with privacy regulations. All delete requests are queued:
   * Recent data (10 days or newer) belonging to the specified visitor will be deleted within 24 hours. * Data from older (11 days or more) identification events  will be deleted after 90 days.
   * If you are interested in using this API, please [contact our support team](https://fingerprint.com/support/) to activate it for you. Otherwise, you will receive a 403.
   *
   * @param visitorId The [visitor ID](https://dev.fingerprint.com/docs/js-agent#visitorid) you want to delete.*
   */
  public async deleteVisitorData(visitorId: string) {
    if (!visitorId) {
      throw TypeError('VisitorId is not set')
    }

    const url =
      this.authenticationMode === AuthenticationMode.QueryParameter
        ? getDeleteVisitorDataUrl(this.region, visitorId, this.apiKey)
        : getDeleteVisitorDataUrl(this.region, visitorId)

    const headers = this.getHeaders()

    await this.fetch(url, {
      method: 'DELETE',
      headers,
    })
      .then(async (response) => {
        if (response.status === 200) {
          return
        }

        const jsonResponse = await response.json()

        throw { ...(jsonResponse as DeleteVisitorError), response, status: response.status } as DeleteVisitorError
      })
      .catch((err) => {
        if (isDeleteVisitorError(err)) {
          throw err
        }

        throw {
          status: 0,
          error: err,
        }
      })
  }

  /**
   * Gets history for the given visitor
   * @param {string} visitorId - Identifier of the visitor
   * @param {VisitorHistoryFilter} filter - Visitor history filter
   */
  public async getVisitorHistory(visitorId: string, filter?: VisitorHistoryFilter): Promise<VisitorsResponse> {
    if (!visitorId) {
      throw TypeError('VisitorId is not set')
    }

    const url =
      this.authenticationMode === AuthenticationMode.QueryParameter
        ? getVisitorsUrl(this.region, visitorId, filter, this.apiKey)
        : getVisitorsUrl(this.region, visitorId, filter)
    const headers = this.getHeaders()

    return this.fetch(url, {
      method: 'GET',
      headers,
    })
      .then(async (response) => {
        const jsonResponse = await response.json()
        if (response.status === 200) {
          return jsonResponse as VisitorsResponse
        }
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after') || ''
          ;(jsonResponse as VisitorsError429).retryAfter = retryAfter === '' ? 1 : parseInt(retryAfter)
        }
        throw { ...(jsonResponse as VisitorsError), response, status: response.status } as VisitorsError
      })
      .catch((err) => {
        if (isVisitorsError(err)) {
          throw err
        }
        throw {
          status: 0,
          error: err,
        }
      })
  }

  private getHeaders() {
    return this.authenticationMode === AuthenticationMode.AuthHeader ? { 'Auth-API-Key': this.apiKey } : undefined
  }
}
