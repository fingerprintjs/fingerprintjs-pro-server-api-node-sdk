import { ErrorResponse, Region } from '../../src/types'
import { FingerprintJsServerApiClient } from '../../src/serverApiClient'
import getEventResponse from './mocked-responses-data/get_event_200.json'
import getEventWithExtraFieldsResponse from './mocked-responses-data/get_event_200_extra_fields.json'
import getEventAllErrorsResponse from './mocked-responses-data/get_event_200_all_errors.json'
import { RequestError, SdkError } from '../../src/errors/apiErrors'
import { getIntegrationInfo } from '../../src'

jest.spyOn(global, 'fetch')

const mockFetch = fetch as unknown as jest.Mock
describe('[Mocked response] Get Event', () => {
  const apiKey = 'dummy_api_key'
  const existingRequestId = '1626550679751.cVc5Pm'

  const client = new FingerprintJsServerApiClient({ region: Region.EU, apiKey })

  test('with request_id', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(getEventResponse))))

    const response = await client.getEvent(existingRequestId)

    expect(mockFetch).toHaveBeenCalledWith(
      `https://eu.api.fpjs.io/events/${existingRequestId}?ii=${encodeURIComponent(getIntegrationInfo())}`,
      {
        headers: { 'Auth-API-Key': 'dummy_api_key' },
        method: 'GET',
      }
    )
    expect(response).toEqual(getEventResponse)
  })

  test('with additional signals', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(getEventWithExtraFieldsResponse))))

    const response = await client.getEvent(existingRequestId)
    expect(response).toEqual(getEventWithExtraFieldsResponse)
  })

  test('with all signals with failed error', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(getEventAllErrorsResponse))))

    const response = await client.getEvent(existingRequestId)

    expect(response).toEqual(getEventAllErrorsResponse)
  })

  test('403 error', async () => {
    const errorInfo = {
      error: {
        code: 'TokenRequired',
        message: 'secret key is required',
      },
    } satisfies ErrorResponse
    const mockResponse = new Response(JSON.stringify(errorInfo), {
      status: 403,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(client.getEvent(existingRequestId)).rejects.toThrow(
      RequestError.fromErrorResponse(errorInfo, mockResponse)
    )
  })

  test('404 error', async () => {
    const errorInfo = {
      error: {
        code: 'RequestNotFound',
        message: 'request id is not found',
      },
    } satisfies ErrorResponse
    const mockResponse = new Response(JSON.stringify(errorInfo), {
      status: 404,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))
    await expect(client.getEvent(existingRequestId)).rejects.toThrow(
      RequestError.fromErrorResponse(errorInfo, mockResponse)
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
    await expect(client.getEvent(existingRequestId)).rejects.toThrow(RequestError)
    await expect(client.getEvent(existingRequestId)).rejects.toThrow('Some text instead of shaped object')
  })

  test('Error with bad JSON', async () => {
    const mockResponse = new Response('(Some bad JSON)', {
      status: 404,
    })
    mockFetch.mockReturnValue(Promise.resolve(mockResponse))

    await expect(client.getEvent(existingRequestId)).rejects.toMatchObject(
      new SdkError(
        'Failed to parse JSON response',
        mockResponse,
        new SyntaxError('Unexpected token \'(\', \\"(Some bad JSON)\\" is not valid JSON')
      )
    )
  })
})
