import {
  CommonResponse429,
  DeleteVisit400Response,
  DeleteVisit403Response,
  DeleteVisit404Response,
  FingerprintJsServerApiClient,
  getIntegrationInfo,
  Region,
} from '../../src'
import Error404 from './mocked-responses-data/shared/404_error_visitor_not_found.json'
import Error403 from './mocked-responses-data/shared/403_error_feature_not_enabled.json'
import Error400 from './mocked-responses-data/shared/400_error_incorrect_visitor_id.json'
import Error429 from './mocked-responses-data/shared/429_error_too_many_requests.json'
import {
  CommonError429,
  DeleteVisit400Error,
  DeleteVisit403Error,
  DeleteVisit404Error,
  SdkError,
} from '../../src/errors/apiErrors'

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
      new DeleteVisit404Error(Error404 as DeleteVisit404Response, mockResponse)
    )
  })

  test('403 error', async () => {
    const mockResponse = new Response(JSON.stringify(Error403), {
      status: 403,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toThrow(
      new DeleteVisit403Error(Error403 as DeleteVisit403Response, mockResponse)
    )
  })

  test('400 error', async () => {
    const mockResponse = new Response(JSON.stringify(Error400), {
      status: 400,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toThrow(
      new DeleteVisit400Error(Error400 as DeleteVisit400Response, mockResponse)
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

    const expectedError = new CommonError429(Error429 as CommonResponse429, mockResponse)
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
        error: errorInfo,
      }),
      {
        status: 404,
      }
    )

    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toThrow(DeleteVisit404Error)
    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toThrow('Visit not found')
  })
})
