import {
  Region,
  VisitorsResponse400,
  VisitorsResponse403,
  VisitorsResponse404,
  VisitorsResponse429,
} from '../../src/types'
import { FingerprintJsServerApiClient } from '../../src/serverApiClient'
import getRelatedVisitors from './mocked-responses-data/related-visitors/get_related_visitors_200.json'
import { SdkError } from '../../src/errors/apiErrors'
import { getIntegrationInfo } from '../../src'
import { VisitorsError400, VisitorsError403, VisitorsError404, VisitorsError429 } from '../../src/errors/visitErrors'

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
      },
    }
    const mockResponse = new Response(JSON.stringify(error), {
      status: 400,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(
      client.getRelatedVisitors({
        visitor_id: existingVisitorId,
      })
    ).rejects.toThrow(new VisitorsError400(error as VisitorsResponse400, mockResponse))
  })

  test('403 error', async () => {
    const error = {
      error: 'Forbidden',
    }
    const mockResponse = new Response(JSON.stringify(error), {
      status: 403,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(
      client.getRelatedVisitors({
        visitor_id: existingVisitorId,
      })
    ).rejects.toThrow(new VisitorsError403(error as VisitorsResponse403, mockResponse))
  })

  test('404 error', async () => {
    const error = {
      error: {
        message: 'Forbidden',
      },
    }
    const mockResponse = new Response(JSON.stringify(error), {
      status: 404,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(
      client.getRelatedVisitors({
        visitor_id: existingVisitorId,
      })
    ).rejects.toThrow(new VisitorsError404(error as VisitorsResponse404, mockResponse))
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
    await expect(
      client.getRelatedVisitors({
        visitor_id: existingVisitorId,
      })
    ).rejects.toThrow(expectedError)
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
