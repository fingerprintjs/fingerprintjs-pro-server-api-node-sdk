import {
  ErrorResponse,
  FingerprintJsServerApiClient,
  getIntegrationInfo,
  Region,
  RequestError,
  SdkError,
  TooManyRequestsError,
} from '../../src'
import Error404 from './mocked-responses-data/errors/404_request_not_found.json'
import Error403 from './mocked-responses-data/errors/403_feature_not_enabled.json'
import Error400 from './mocked-responses-data/errors/400_visitor_id_invalid.json'
import Error429 from './mocked-responses-data/errors/429_too_many_requests.json'

jest.spyOn(global, 'fetch')

const mockFetch = fetch as unknown as jest.Mock

describe('[Mocked response] Delete visitor data', () => {
  const apiKey = 'dummy_api_key'

  const existingVisitorId = 'TaDnMBz9XCpZNuSzFUqP'

  const client = new FingerprintJsServerApiClient({ region: Region.EU, apiKey })

  test('with visitorId', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response()))

    const response = await client.deleteVisitorData(existingVisitorId)

    expect(response).toBeUndefined()
    expect(mockFetch).toHaveBeenCalledWith(
      `https://eu.api.fpjs.io/visitors/${existingVisitorId}?ii=${encodeURIComponent(getIntegrationInfo())}`,
      {
        headers: { 'Auth-API-Key': 'dummy_api_key' },
        method: 'DELETE',
      }
    )
  })

  test('404 error', async () => {
    const mockResponse = new Response(JSON.stringify(Error404), {
      status: 404,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toThrow(
      RequestError.fromErrorResponse(Error404 as ErrorResponse, mockResponse)
    )
  })

  test('403 error', async () => {
    const mockResponse = new Response(JSON.stringify(Error403), {
      status: 403,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toThrow(
      RequestError.fromErrorResponse(Error403 as ErrorResponse, mockResponse)
    )
  })

  test('400 error', async () => {
    const mockResponse = new Response(JSON.stringify(Error400), {
      status: 400,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toThrow(
      RequestError.fromErrorResponse(Error400 as ErrorResponse, mockResponse)
    )
  })

  test('429 error', async () => {
    const mockResponse = new Response(JSON.stringify(Error429), {
      status: 429,
      headers: {
        'retry-after': '5',
      },
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    const expectedError = new TooManyRequestsError(Error429 as ErrorResponse, mockResponse)
    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toThrow(expectedError)
    expect(expectedError.retryAfter).toEqual(5)
  })

  test('Error with bad JSON', async () => {
    const mockResponse = new Response('(Some bad JSON)', {
      status: 404,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toMatchObject(
      new SdkError(
        'Failed to parse JSON response',
        mockResponse,
        new SyntaxError('Unexpected token \'(\', "(Some bad JSON)" is not valid JSON')
      )
    )
  })

  test('Error with bad shape', async () => {
    const errorInfo = 'Some text instead of shaped object'
    const mockResponse = new Response(
      JSON.stringify({
        _error: errorInfo,
      }),
      {
        status: 404,
      }
    )

    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toThrow(RequestError as any)
    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toThrow('Unknown error')
  })
})
