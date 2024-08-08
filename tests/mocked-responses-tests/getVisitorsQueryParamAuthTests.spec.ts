import { AuthenticationMode, VisitorHistoryFilter, Region } from '../../src/types'
import { FingerprintJsServerApiClient } from '../../src/serverApiClient'
import visitorsWithoutFilterResponse from './mocked-responses-data/visitors-without-filter-response.json'
import visitorsResponseWithRequestId from './mocked-responses-data/visitors-with-request-id.json'
import visitorsResponseWithRequestIdLinkedId from './mocked-responses-data/visitors-with-request-id-linked-id.json'
import visitorsResponseWithLinkedIdLimit from './mocked-responses-data/visitors-with-linked-id-limit.json'
import visitorsWithLimitBefore from './mocked-responses-data/visitors-with-limit-before.json'
import { SdkError } from '../../src/errors/apiErrors'

jest.spyOn(global, 'fetch')

describe('[Mocked response] Get Visitors', () => {
  const apiKey = 'dummy_api_key'
  const existingVisitorId = 'TaDnMBz9XCpZNuSzFUqP'
  const existingRequestId = '1626550679751.cVc5Pm'
  const existingLinkedId = 'makma'

  const client = new FingerprintJsServerApiClient({
    region: Region.EU,
    apiKey: apiKey,
    authenticationMode: AuthenticationMode.QueryParameter,
  })

  const mockFetch = fetch as unknown as jest.Mock

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

  test('not json from broken server', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response('500 Internal Server Error')))

    await expect(client.getVisitorHistory(existingVisitorId)).rejects.toMatchObject(
      new SdkError(
        'Failed to parse JSON response',
        new Response('500 Internal Server Error'),
        new SyntaxError('Unexpected end of JSON input')
      )
    )
  })
})
