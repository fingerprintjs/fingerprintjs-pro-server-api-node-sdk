import { ErrorResponse, FingerprintJsServerApiClient, getIntegrationInfo, RequestError } from '../../src'
import getEventsSearch from './mocked-responses-data/get_event_search_200.json'

jest.spyOn(global, 'fetch')

const mockFetch = fetch as unknown as jest.Mock

describe('[Mocked response] Search Events', () => {
  const apiKey = 'dummy_api_key'
  const client = new FingerprintJsServerApiClient({ apiKey })

  test('without filter', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(getEventsSearch))))

    const response = await client.searchEvents({
      limit: 10,
    })
    expect(response).toMatchSnapshot()
    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.fpjs.io/events/search?limit=10&ii=${encodeURIComponent(getIntegrationInfo())}`,
      {
        headers: { 'Auth-API-Key': apiKey },
        method: 'GET',
      }
    )
  })

  test('with filter params passed as undefined', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(getEventsSearch))))

    const response = await client.searchEvents({
      limit: 10,
      ip_address: undefined,
      visitor_id: undefined,
    })
    expect(response).toMatchSnapshot()
    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.fpjs.io/events/search?limit=10&ii=${encodeURIComponent(getIntegrationInfo())}`,
      {
        headers: { 'Auth-API-Key': apiKey },
        method: 'GET',
      }
    )
  })

  test('with partial filter', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(getEventsSearch))))

    const response = await client.searchEvents({
      limit: 10,
      bot: 'good',
      visitor_id: 'visitor_id',
    })
    expect(response).toMatchSnapshot()
    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.fpjs.io/events/search?limit=10&bot=good&visitor_id=visitor_id&ii=${encodeURIComponent(getIntegrationInfo())}`,
      {
        headers: { 'Auth-API-Key': apiKey },
        method: 'GET',
      }
    )
  })

  test('with all possible filters', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(getEventsSearch))))

    const response = await client.searchEvents({
      limit: 10,
      bot: 'all',
      visitor_id: 'visitor_id',
      ip_address: '192.168.0.1/32',
      linked_id: 'linked_id',
      start: 1620000000000,
      end: 1630000000000,
      reverse: true,
      suspect: false,
    })

    expect(response).toMatchSnapshot()

    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.fpjs.io/events/search?limit=10&bot=all&visitor_id=visitor_id&ip_address=${encodeURIComponent(
        '192.168.0.1/32'
      )}&linked_id=linked_id&start=1620000000000&end=1630000000000&reverse=true&suspect=false&ii=${encodeURIComponent(
        getIntegrationInfo()
      )}`,
      {
        headers: { 'Auth-API-Key': apiKey },
        method: 'GET',
      }
    )
  })

  test('400 error', async () => {
    const error = {
      error: {
        message: 'Forbidden',
        code: 'RequestCannotBeParsed',
      },
    } satisfies ErrorResponse
    const mockResponse = new Response(JSON.stringify(error), {
      status: 400,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(
      client.searchEvents({
        limit: 10,
      })
    ).rejects.toThrow(RequestError.fromErrorResponse(error, mockResponse))
  })

  test('403 error', async () => {
    const error = {
      error: {
        message: 'secret key is required',
        code: 'TokenRequired',
      },
    } satisfies ErrorResponse
    const mockResponse = new Response(JSON.stringify(error), {
      status: 403,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(
      client.searchEvents({
        limit: 10,
      })
    ).rejects.toThrow(RequestError.fromErrorResponse(error, mockResponse))
  })
})
