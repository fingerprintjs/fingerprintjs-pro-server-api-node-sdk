import { ErrorResponse, FingerprintJsServerApiClient, getIntegrationInfo, Region, RequestError } from '../../src'
import Error404 from './mocked-responses-data/errors/404_request_not_found.json'
import Error403 from './mocked-responses-data/errors/403_feature_not_enabled.json'
import Error400 from './mocked-responses-data/errors/400_request_body_invalid.json'
import Error409 from './mocked-responses-data/errors/409_state_not_ready.json'
import { SdkError } from '../../src/errors/apiErrors'

jest.spyOn(global, 'fetch')

const mockFetch = fetch as unknown as jest.Mock

describe('[Mocked response] Update event', () => {
  const apiKey = 'dummy_api_key'

  const existingVisitorId = 'TaDnMBz9XCpZNuSzFUqP'

  const client = new FingerprintJsServerApiClient({ region: Region.EU, apiKey })

  test('with visitorId', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response()))

    const body = {
      linkedId: 'linked_id',
      suspect: true,
    }
    const response = await client.updateEvent(body, existingVisitorId)

    expect(response).toBeUndefined()

    const call = mockFetch.mock.calls[0]
    const bodyFromCall = call[1]?.body
    expect(JSON.parse(bodyFromCall)).toEqual(body)

    expect(mockFetch).toHaveBeenCalledWith(
      `https://eu.api.fpjs.io/events/${existingVisitorId}?ii=${encodeURIComponent(getIntegrationInfo())}`,
      {
        headers: { 'Auth-API-Key': 'dummy_api_key' },
        method: 'PUT',
        body: JSON.stringify(body),
      }
    )
  })

  test('404 error', async () => {
    const mockResponse = new Response(JSON.stringify(Error404), {
      status: 404,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    const body = {
      linkedId: 'linked_id',
      suspect: true,
    }
    await expect(client.updateEvent(body, existingVisitorId)).rejects.toThrow(
      RequestError.fromErrorResponse(Error404 as ErrorResponse, mockResponse)
    )
  })

  test('403 error', async () => {
    const mockResponse = new Response(JSON.stringify(Error403), {
      status: 403,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    const body = {
      linkedId: 'linked_id',
      suspect: true,
    }
    await expect(client.updateEvent(body, existingVisitorId)).rejects.toThrow(
      RequestError.fromErrorResponse(Error403 as ErrorResponse, mockResponse)
    )
  })

  test('400 error', async () => {
    const mockResponse = new Response(JSON.stringify(Error400), {
      status: 400,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    const body = {
      linkedId: 'linked_id',
      suspect: true,
    }
    await expect(client.updateEvent(body, existingVisitorId)).rejects.toThrow(
      RequestError.fromErrorResponse(Error400 as ErrorResponse, mockResponse)
    )
  })

  test('409 error', async () => {
    const mockResponse = new Response(JSON.stringify(Error409), {
      status: 409,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    const body = {
      linkedId: 'linked_id',
      suspect: true,
    }
    await expect(client.updateEvent(body, existingVisitorId)).rejects.toThrow(
      RequestError.fromErrorResponse(Error409 as ErrorResponse, mockResponse)
    )
  })

  test('Error with bad JSON', async () => {
    const mockResponse = new Response('(Some bad JSON)', {
      status: 404,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    const body = {
      linkedId: 'linked_id',
      suspect: true,
    }
    await expect(client.updateEvent(body, existingVisitorId)).rejects.toMatchObject(
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

    const body = {
      linkedId: 'linked_id',
      suspect: true,
    }
    await expect(client.updateEvent(body, existingVisitorId)).rejects.toThrow(RequestError)
    await expect(client.updateEvent(body, existingVisitorId)).rejects.toThrow('Some text instead of shaped object')
  })
})
