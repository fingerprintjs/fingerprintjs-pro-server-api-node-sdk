import { ErrorResponse, Region } from '../../src/types'
import { FingerprintJsServerApiClient } from '../../src/serverApiClient'
import getRelatedVisitors from './mocked-responses-data/related-visitors/get_related_visitors_200.json'
import { ApiError, SdkError, TooManyRequestsError } from '../../src/errors/apiErrors'
import { getIntegrationInfo } from '../../src'

jest.spyOn(global, 'fetch')

const mockFetch = fetch as unknown as jest.Mock

describe('[Mocked response] Get related Visitors', () => {
  const apiKey = 'dummy_api_key'
  const existingVisitorId = 'TaDnMBz9XCpZNuSzFUqP'

  const client = new FingerprintJsServerApiClient({ region: Region.EU, apiKey: apiKey })

  test('without filter', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(getRelatedVisitors))))

    const response = await client.getRelatedVisitors({
      visitor_id: existingVisitorId,
    })
    expect(response).toMatchSnapshot()
    expect(mockFetch).toHaveBeenCalledWith(
      `https://eu.api.fpjs.io/related-visitors?visitor_id=${existingVisitorId}&ii=${encodeURIComponent(getIntegrationInfo())}`,
      {
        headers: { 'Auth-API-Key': 'dummy_api_key' },
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
    } as ErrorResponse
    const mockResponse = new Response(JSON.stringify(error), {
      status: 400,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(
      client.getRelatedVisitors({
        visitor_id: existingVisitorId,
      })
    ).rejects.toThrow(new ApiError(error, mockResponse))
  })

  test('403 error', async () => {
    const error = {
      error: {
        message: 'secret key is required',
        code: 'TokenRequired',
      },
    } as ErrorResponse
    const mockResponse = new Response(JSON.stringify(error), {
      status: 403,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(
      client.getRelatedVisitors({
        visitor_id: existingVisitorId,
      })
    ).rejects.toThrow(new ApiError(error, mockResponse))
  })

  test('404 error', async () => {
    const error = {
      error: {
        message: 'request id is not found',
        code: 'RequestNotFound',
      },
    } as ErrorResponse
    const mockResponse = new Response(JSON.stringify(error), {
      status: 404,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(
      client.getRelatedVisitors({
        visitor_id: existingVisitorId,
      })
    ).rejects.toThrow(new ApiError(error, mockResponse))
  })

  test('429 error', async () => {
    const error = {
      error: {
        message: 'Too Many Requests',
        code: 'TooManyRequests',
      },
    } as ErrorResponse
    const mockResponse = new Response(JSON.stringify(error), {
      status: 429,
      headers: { 'Retry-after': '10' },
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    const expectedError = new TooManyRequestsError(error, mockResponse)
    await expect(
      client.getRelatedVisitors({
        visitor_id: existingVisitorId,
      })
    ).rejects.toThrow(expectedError)
    expect(expectedError.retryAfter).toEqual(10)
  })

  test('429 error with empty retry-after header', async () => {
    const error = {
      error: {
        message: 'Too Many Requests',
        code: 'TooManyRequests',
      },
    } as ErrorResponse
    const mockResponse = new Response(JSON.stringify(error), {
      status: 429,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    const expectedError = new TooManyRequestsError(error, mockResponse)
    await expect(
      client.getRelatedVisitors({
        visitor_id: existingVisitorId,
      })
    ).rejects.toThrow(expectedError)
    expect(expectedError.retryAfter).toEqual(0)
  })

  test('Error with bad JSON', async () => {
    const mockResponse = new Response('(Some bad JSON)', {
      status: 404,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(
      client.getRelatedVisitors({
        visitor_id: existingVisitorId,
      })
    ).rejects.toMatchObject(
      new SdkError(
        'Failed to parse JSON response',
        mockResponse,
        new SyntaxError('Unexpected token \'(\', "(Some bad JSON)" is not valid JSON')
      )
    )
  })
})
