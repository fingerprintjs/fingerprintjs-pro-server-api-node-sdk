import { getRequestPath } from './urlUtils'
import {
  AuthenticationMode,
  EventsGetResponse,
  EventsUpdateRequest,
  FingerprintApi,
  Options,
  Region,
  RelatedVisitorsFilter,
  RelatedVisitorsResponse,
  SearchEventsFilter,
  SearchEventsResponse,
  VisitorHistoryFilter,
  VisitorsResponse,
} from './types'
import { copyResponseJson } from './responseUtils'
import { handleErrorResponse } from './errors/handleErrorResponse'

export class FingerprintJsServerApiClient implements FingerprintApi {
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
   * @returns {Promise<EventsGetResponse>} - promise with event response. For more information, see the [Server API documentation](https://dev.fingerprint.com/reference/getevent).
   *
   * @example
   * ```javascript
   * client
   *  .getEvent('<requestId>')
   *  .then((result) => console.log(result))
   *  .catch((error) => {
   *    if (error instanceof RequestError) {
   *       console.log(error.statusCode, error.message)
   *       // Access raw response in error
   *       console.log(error.response)
   *     }
   *   })
   * ```
   * */
  public async getEvent(requestId: string): Promise<EventsGetResponse> {
    if (!requestId) {
      throw new TypeError('requestId is not set')
    }

    const url = getRequestPath({
      path: '/events/{request_id}',
      region: this.region,
      apiKey: this.getQueryApiKey(),
      pathParams: [requestId],
      method: 'get',
    })

    const headers = this.getHeaders()

    const response = await this.fetch(url, {
      method: 'GET',
      headers,
    })

    const jsonResponse = await copyResponseJson(response)

    if (response.status === 200) {
      return jsonResponse as EventsGetResponse
    }

    handleErrorResponse(jsonResponse, response)
  }

  /**
   * Update an event with a given request ID
   * @description Change information in existing events specified by `requestId` or *flag suspicious events*.
   *
   * When an event is created, it is assigned `linkedId` and `tag` submitted through the JS agent parameters. This information might not be available on the client so the Server API allows for updating the attributes after the fact.
   *
   * **Warning** It's not possible to update events older than 10 days.
   *
   * @param body - Data to update the event with.
   * @param requestId The unique event [identifier](https://dev.fingerprint.com/docs/js-agent#requestid).
   *
   * @return {Promise<void>}
   *
   * @example
   * ```javascript
   * const body = {
   *  linkedId: 'linked_id',
   *  suspect: false,
   * }
   *
   * client
   *   .updateEvent(body, '<requestId>')
   *   .then(() => {
   *     // Event was successfully updated
   *   })
   *  .catch((error) => {
   *    if (error instanceof RequestError) {
   *       console.log(error.statusCode, error.message)
   *       // Access raw response in error
   *       console.log(error.response)
   *
   *       if(error.statusCode === 409) {
   *          // Event is not mutable yet, wait a couple of seconds and retry the update.
   *       }
   *     }
   *   })
   * ```
   */
  public async updateEvent(body: EventsUpdateRequest, requestId: string): Promise<void> {
    if (!body) {
      throw new TypeError('body is not set')
    }

    if (!requestId) {
      throw new TypeError('requestId is not set')
    }

    const url = getRequestPath({
      path: '/events/{request_id}',
      region: this.region,
      apiKey: this.getQueryApiKey(),
      pathParams: [requestId],
      method: 'put',
    })
    const headers = this.getHeaders()

    const response = await this.fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })

    if (response.status === 200) {
      return
    }

    const jsonResponse = await copyResponseJson(response)

    handleErrorResponse(jsonResponse, response)
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
   *  .catch((error) => {
   *    if (error instanceof RequestError) {
   *       console.log(error.statusCode, error.message)
   *       // Access raw response in error
   *       console.log(error.response)
   *
   *       if(error instanceof TooManyRequestsError) {
   *          retryLater(error.retryAfter) // Needs to be implemented on your side
   *       }
   *     }
   *   })
   * ```
   */
  public async deleteVisitorData(visitorId: string): Promise<void> {
    if (!visitorId) {
      throw TypeError('VisitorId is not set')
    }

    const url = getRequestPath({
      path: '/visitors/{visitor_id}',
      region: this.region,
      apiKey: this.getQueryApiKey(),
      pathParams: [visitorId],
      method: 'delete',
    })

    const headers = this.getHeaders()

    const response = await this.fetch(url, {
      method: 'DELETE',
      headers,
    })

    if (response.status === 200) {
      return
    }

    const jsonResponse = await copyResponseJson(response)

    handleErrorResponse(jsonResponse, response)
  }

  /**
   * @deprecated Please use {@link FingerprintJsServerApiClient.getVisits} instead
   * */
  public async getVisitorHistory(visitorId: string, filter?: VisitorHistoryFilter): Promise<VisitorsResponse> {
    return this.getVisits(visitorId, filter)
  }

  /**
   * Search for identification events, including Smart Signals, using
   * multiple filtering criteria. If you don't provide `start` or `end`
   * parameters, the default search range is the last 7 days.
   *
   * Please note that events include mobile signals (e.g. `rootApps`) even if
   * the request originated from a non-mobile platform. We recommend you
   * **ignore** mobile signals for such requests.
   *
   * @param {SearchEventsFilter} filter - Events filter
   * @param {number} filter.limit - Limit the number of events returned. Must be greater than 0.
   * @param {string|undefined} filter.visitorId - Unique [visitor identifier](https://dev.fingerprint.com/reference/get-function#visitorid) issued by Fingerprint Pro. Filter for events matching this `visitor_id`.
   * @param {string|undefined} filter.bot -             Filter events by the bot detection result, specifically:
   *               - events where any kind of bot was detected.
   *               - events where a good bot was detected.
   *               - events where a bad bot was detected.
   *               - events where no bot was detected.
   *
   *                Allowed values: `all`, `good`, `bad`, `none`.
   * @param {string|undefined} filter.ip_address - Filter events by IP address range. The range can be as specific as a
   *             single IP (/32 for IPv4 or /128 for IPv6).
   *             All ip_address filters must use CIDR notation, for example,
   *             10.0.0.0/24, 192.168.0.1/32
   * @param {string|undefined} filter.linked_id -             Filter events by your custom identifier.
   *
   *
   *             You can use [linked IDs](https://dev.fingerprint.com/reference/get-function#linkedid) to
   *             associate identification requests with your own identifier, for
   *             example, session ID, purchase ID, or transaction ID. You can then
   *             use this `linked_id` parameter to retrieve all events associated
   *             with your custom identifier.
   * @param {number|undefined} filter.start - Filter events with a timestamp greater than the start time, in Unix time (milliseconds).
   * @param {number|undefined} filter.end - Filter events with a timestamp smaller than the end time, in Unix time (milliseconds).
   * @param {boolean|undefined} filter.reverse - Sort events in reverse timestamp order.
   * @param {boolean|undefined} filter.suspect - Filter events previously tagged as suspicious via the [Update API](https://dev.fingerprint.com/reference/updateevent).
   * */
  async searchEvents(filter: SearchEventsFilter): Promise<SearchEventsResponse> {
    const url = getRequestPath({
      path: '/events/search',
      region: this.region,
      apiKey: this.getQueryApiKey(),
      method: 'get',
      queryParams: filter,
    })
    const headers = this.getHeaders()
    const response = await this.fetch(url, {
      method: 'GET',
      headers,
    })

    const jsonResponse = await copyResponseJson(response)

    if (response.status === 200) {
      return jsonResponse as SearchEventsResponse
    }

    handleErrorResponse(jsonResponse, response)
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
   *   .getVisits('<visitorId>', { limit: 1 })
   *   .then((visitorHistory) => {
   *     console.log(visitorHistory)
   *   })
   *   .catch((error) => {
   *    if (error instanceof RequestError) {
   *       console.log(error.statusCode, error.message)
   *       // Access raw response in error
   *       console.log(error.response)
   *
   *       if(error instanceof TooManyRequestsError) {
   *          retryLater(error.retryAfter) // Needs to be implemented on your side
   *       }
   *     }
   *   })
   * ```
   */
  public async getVisits(visitorId: string, filter?: VisitorHistoryFilter): Promise<VisitorsResponse> {
    if (!visitorId) {
      throw TypeError('VisitorId is not set')
    }

    const url = getRequestPath({
      path: '/visitors/{visitor_id}',
      region: this.region,
      apiKey: this.getQueryApiKey(),
      pathParams: [visitorId],
      method: 'get',
      queryParams: filter,
    })
    const headers = this.getHeaders()

    const response = await this.fetch(url, {
      method: 'GET',
      headers,
    })

    const jsonResponse = await copyResponseJson(response)

    if (response.status === 200) {
      return jsonResponse as VisitorsResponse
    }

    handleErrorResponse(jsonResponse, response)
  }

  /**
   * Related visitors API lets you link web visits and in-app browser visits that originated from the same mobile device.
   * It searches the past 6 months of identification events to find the visitor IDs that belong to the same mobile device as the given visitor ID.
   * ⚠️ Please note that this API is not enabled by default and is billable separately. ⚠️
   * If you would like to use Related visitors API, please contact our [support team](https://fingerprint.com/support).
   * To learn more, see [Related visitors API reference](https://dev.fingerprint.com/reference/related-visitors-api).
   *
   * @param {RelatedVisitorsFilter} filter - Related visitors filter
   * @param {string} filter.visitorId - The [visitor ID](https://dev.fingerprint.com/docs/js-agent#visitorid) for which you want to find the other visitor IDs that originated from the same mobile device.
   *
   * @example
   * ```javascript
   * client
   *   .getRelatedVisitors({ visitor_id: '<visitorId>' })
   *   .then((relatedVisits) => {
   *     console.log(relatedVisits)
   *   })
   *  .catch((error) => {
   *    if (error instanceof RequestError) {
   *       console.log(error.statusCode, error.message)
   *       // Access raw response in error
   *       console.log(error.response)
   *
   *       if(error instanceof TooManyRequestsError) {
   *          retryLater(error.retryAfter) // Needs to be implemented on your side
   *       }
   *     }
   *   })
   * ```
   */
  async getRelatedVisitors(filter: RelatedVisitorsFilter): Promise<RelatedVisitorsResponse> {
    const url = getRequestPath({
      path: '/related-visitors',
      region: this.region,
      apiKey: this.getQueryApiKey(),
      method: 'get',
      queryParams: filter,
    })
    const headers = this.getHeaders()

    const response = await this.fetch(url, {
      method: 'GET',
      headers,
    })

    const jsonResponse = await copyResponseJson(response)

    if (response.status === 200) {
      return jsonResponse as RelatedVisitorsResponse
    }

    handleErrorResponse(jsonResponse, response)
  }

  private getHeaders() {
    return this.authenticationMode === AuthenticationMode.AuthHeader ? { 'Auth-API-Key': this.apiKey } : undefined
  }

  private getQueryApiKey() {
    return this.authenticationMode === AuthenticationMode.QueryParameter ? this.apiKey : undefined
  }
}
