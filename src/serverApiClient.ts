import { getDeleteVisitorDataUrl, getEventUrl, getVisitorsUrl } from './urlUtils'
import { AuthenticationMode, EventResponse, Options, Region, VisitorHistoryFilter, VisitorsResponse } from './types'
import { copyResponseJson } from './responseUtils'
import {
  ApiError,
  CommonError429,
  DeleteVisit400Error,
  DeleteVisit403Error,
  DeleteVisit404Error,
  EventError403,
  EventError404,
  VisitorsError403,
  VisitorsError429,
} from './errors/apiErrors'

export class FingerprintJsServerApiClient {
  public readonly region: Region

  public readonly apiKey: string

  public readonly authenticationMode: AuthenticationMode

  protected readonly fetch: typeof fetch

  protected static readonly DEFAULT_RETRY_AFTER = 1

  /**
   * FingerprintJS server API client used to fetch data from FingerprintJS
   * @constructor
   * @param {Options} options - Options for FingerprintJS server API client
   */
  constructor(options: Readonly<Options>) {
    if (!options.apiKey) {
      throw Error('Api key is not set')
    }

    this.region = options.region ?? Region.Global
    this.apiKey = options.apiKey
    this.authenticationMode = options.authenticationMode ?? AuthenticationMode.AuthHeader // Default auth mode is AuthHeader
    this.fetch = options.fetch ?? fetch
  }

  /**
   * Retrieves a specific identification event with the information from each activated product — Identification and all active [Smart signals](https://dev.fingerprint.com/docs/smart-signals-overview).
   *
   * @param requestId - identifier of the event
   *
   * @returns {Promise<EventResponse>} - promise with event response. For more information, see the [Server API documentation](https://dev.fingerprint.com/reference/getevent).
   *
   * @example
   * ```javascript
   * client
   *  .getEvent('<requestId>')
   *  .then((result) => console.log(result))
   *  .catch((err) => {
   *    if (isEventError(err)) {
   *      // You can also access the raw response
   *      console.log(err.response)
   *      console.log(`error ${err.statusCode}: `, err.message)
   *    } else {
   *      console.log('unknown error: ', err)
   *    }
   *  })
   * ```
   * */
  public async getEvent(requestId: string): Promise<EventResponse> {
    if (!requestId) {
      throw new TypeError('requestId is not set')
    }

    const url =
      this.authenticationMode === AuthenticationMode.QueryParameter
        ? getEventUrl(requestId, this.region, this.apiKey)
        : getEventUrl(requestId, this.region)

    const headers = this.getHeaders()

    const response = await this.fetch(url, {
      method: 'GET',
      headers,
    })

    const jsonResponse = await copyResponseJson(response)

    if (response.status === 200) {
      return jsonResponse as EventResponse
    }

    switch (response.status) {
      case 403:
        throw new EventError403(jsonResponse, response)

      case 404:
        throw new EventError404(jsonResponse, response)

      default:
        throw ApiError.unknown(response)
    }
  }

  /**
   * Delete data by visitor ID
   * Request deleting all data associated with the specified visitor ID. This API is useful for compliance with privacy regulations. All delete requests are queued:
   * Recent data (10 days or newer) belonging to the specified visitor will be deleted within 24 hours. * Data from older (11 days or more) identification events  will be deleted after 90 days.
   * If you are interested in using this API, please [contact our support team](https://fingerprint.com/support/) to activate it for you. Otherwise, you will receive a 403.
   *
   * @param visitorId The [visitor ID](https://dev.fingerprint.com/docs/js-agent#visitorid) you want to delete.*
   *
   * @return {Promise<void>} Promise that resolves when the deletion request is successfully queued
   *
   * @example
   * ```javascript
   * client
   *   .deleteVisitorData('<visitorId>')
   *   .then(() => {
   *     // Data deletion request was successfully queued
   *   })
   *   .catch((error) => {
   *     if (isDeleteVisitorError(error)) {
   *       console.log(error.statusCode, error.message)
   *     }
   *   })
   * ```
   */
  public async deleteVisitorData(visitorId: string): Promise<void> {
    if (!visitorId) {
      throw TypeError('VisitorId is not set')
    }

    const url =
      this.authenticationMode === AuthenticationMode.QueryParameter
        ? getDeleteVisitorDataUrl(this.region, visitorId, this.apiKey)
        : getDeleteVisitorDataUrl(this.region, visitorId)

    const headers = this.getHeaders()

    const response = await this.fetch(url, {
      method: 'DELETE',
      headers,
    })

    if (response.status === 200) {
      return
    }

    const jsonResponse = await copyResponseJson(response)

    switch (response.status) {
      case 429:
        throw new CommonError429(jsonResponse, response)

      case 404:
        throw new DeleteVisit404Error(jsonResponse, response)

      case 403:
        throw new DeleteVisit403Error(jsonResponse, response)

      case 400:
        throw new DeleteVisit400Error(jsonResponse, response)

      default:
        throw ApiError.unknown(response)
    }
  }

  /**
   * Retrieves event history for the specific visitor using the given filter, returns a promise with visitor history response.
   *
   * @param {string} visitorId - Identifier of the visitor
   * @param {VisitorHistoryFilter} filter - Visitor history filter
   * @param {string} filter.limit - limit scanned results
   * @param {string} filter.request_id - filter visits by `requestId`.
   * @param {string} filter.linked_id - filter visits by your custom identifier.
   * @param {string} filter.paginationKey - use `paginationKey` to get the next page of results.   When more results are available (e.g., you requested 200 results using `limit` parameter, but a total of 600 results are available), the `paginationKey` top-level attribute is added to the response. The key corresponds to the `requestId` of the last returned event. In the following request, use that value in the `paginationKey` parameter to get the next page of results:
   *
   *   1. First request, returning most recent 200 events: `GET api-base-url/visitors/:visitorId?limit=200`
   *   2. Use `response.paginationKey` to get the next page of results: `GET api-base-url/visitors/:visitorId?limit=200&paginationKey=1683900801733.Ogvu1j`
   *
   *   Pagination happens during scanning and before filtering, so you can get less visits than the `limit` you specified with more available on the next page. When there are no more results available for scanning, the `paginationKey` attribute is not returned.
   * @example
   * ```javascript
   * client
   *   .getVisitorHistory('<visitorId>', { limit: 1 })
   *   .then((visitorHistory) => {
   *     console.log(visitorHistory)
   *   })
   *   .catch((error) => {
   *     if (isVisitorsError(error)) {
   *       console.log(error.statusCode, error.message)
   *       if (error.status === 429) {
   *         retryLater(error.retryAfter) // Needs to be implemented on your side
   *       }
   *     }
   *   })
   * ```
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

    const response = await this.fetch(url, {
      method: 'GET',
      headers,
    })

    const jsonResponse = await copyResponseJson(response)

    if (response.status === 200) {
      return jsonResponse as VisitorsResponse
    }

    switch (response.status) {
      case 403:
        throw new VisitorsError403(jsonResponse, response)

      case 429:
        throw new VisitorsError429(jsonResponse, response)

      default:
        throw ApiError.unknown(response)
    }
  }

  private getHeaders() {
    return this.authenticationMode === AuthenticationMode.AuthHeader ? { 'Auth-API-Key': this.apiKey } : undefined
  }
}
