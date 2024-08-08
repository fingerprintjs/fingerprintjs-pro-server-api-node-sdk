import { VisitorHistoryFilter, Region, VisitorsResponse403, VisitorsResponse429 } from '../../src/types'
import { FingerprintJsServerApiClient } from '../../src/serverApiClient'
import visitorsWithoutFilterResponse from './mocked-responses-data/visitors-without-filter-response.json'
import visitorsResponseWithRequestId from './mocked-responses-data/visitors-with-request-id.json'
import visitorsResponseWithRequestIdLinkedId from './mocked-responses-data/visitors-with-request-id-linked-id.json'
import visitorsResponseWithLinkedIdLimit from './mocked-responses-data/visitors-with-linked-id-limit.json'
import visitorsWithLimitBefore from './mocked-responses-data/visitors-with-limit-before.json'
import { SdkError, VisitorsError403, VisitorsError429 } from '../../src/errors/apiErrors'

jest.spyOn(global, 'fetch')

const mockFetch = fetch as unknown as jest.Mock

describe('[Mocked response] Get Visitors', () => {
  const apiKey = 'dummy_api_key'
  const existingVisitorId = 'TaDnMBz9XCpZNuSzFUqP'
  const existingRequestId = '1626550679751.cVc5Pm'
  const existingLinkedId = 'makma'

  const client = new FingerprintJsServerApiClient({ region: Region.EU, apiKey: apiKey })

  test('without filter', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(visitorsWithoutFilterResponse))))

    const response = await client.getVisitorHistory(existingVisitorId)
    expect(response).toMatchSnapshot()
  })

  test('with request_id filter', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(visitorsResponseWithRequestId))))

    const filter: VisitorHistoryFilter = { request_id: existingRequestId }
    const response = await client.getVisitorHistory(existingVisitorId, filter)
    expect(response).toMatchSnapshot()
  })

  test('with request_id and linked_id filter', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(visitorsResponseWithRequestIdLinkedId))))

    const filter: VisitorHistoryFilter = {
      request_id: existingRequestId,
      linked_id: existingLinkedId,
    }
    const response = await client.getVisitorHistory(existingVisitorId, filter)
    expect(response).toMatchSnapshot()
  })

  test('with linked_id and limit filter', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(visitorsResponseWithLinkedIdLimit))))

    const filter: VisitorHistoryFilter = { linked_id: existingLinkedId, limit: 5 }
    const response = await client.getVisitorHistory(existingVisitorId, filter)
    expect(response).toMatchSnapshot()
  })

  test('with limit and before', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(visitorsWithLimitBefore))))

    const filter: VisitorHistoryFilter = { limit: 4, before: 1626538505244 }
    const response = await client.getVisitorHistory(existingVisitorId, filter)
    expect(response).toMatchSnapshot()
  })

  test('403 error', async () => {
    const error = {
      error: 'Forbidden',
    }
    const mockResponse = new Response(JSON.stringify(error), {
      status: 403,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(client.getVisitorHistory(existingVisitorId)).rejects.toThrow(
      new VisitorsError403(error as VisitorsResponse403, mockResponse)
    )
  })

  test('429 error', async () => {
    const error = {
      error: 'Too Many Requests',
    }
    const mockResponse = new Response(JSON.stringify(error), {
      status: 429,
      headers: { 'Retry-after': '10' },
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    const expectedError = new VisitorsError429(error as VisitorsResponse429, mockResponse)
    await expect(client.getVisitorHistory(existingVisitorId)).rejects.toThrow(expectedError)
    expect(expectedError.retryAfter).toEqual(10)
  })

  test('429 error with empty retry-after header', async () => {
    const error = {
      error: 'Too Many Requests',
    }
    const mockResponse = new Response(JSON.stringify(error), {
      status: 429,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    const expectedError = new VisitorsError429(error as VisitorsResponse429, mockResponse)
    await expect(client.getVisitorHistory(existingVisitorId)).rejects.toThrow(expectedError)
    expect(expectedError.retryAfter).toEqual(0)
  })

  test('Error with bad JSON', async () => {
    const mockResponse = new Response('(Some bad JSON)', {
      status: 404,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(client.getVisitorHistory(existingVisitorId)).rejects.toMatchObject(
      new SdkError(
        'Failed to parse JSON response',
        mockResponse,
        new SyntaxError('Unexpected token \'(\', "(Some bad JSON)" is not valid JSON')
      )
    )
  })
})
