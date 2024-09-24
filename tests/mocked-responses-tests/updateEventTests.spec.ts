import {
  FingerprintJsServerApiClient,
  Region,
  UpdateEventError400,
  UpdateEventError403,
  UpdateEventError404,
  UpdateEventError409,
  UpdateEventResponse400,
  UpdateEventResponse403,
  UpdateEventResponse404,
  UpdateEventResponse409,
} from '../../src'
import Error404 from './mocked-responses-data/update_event_404_error.json'
import Error403 from './mocked-responses-data/update_event_403_error.json'
import Error400 from './mocked-responses-data/update_event_400_error.json'
import Error409 from './mocked-responses-data/update_event_409_error.json'
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
      new UpdateEventError404(Error404 as UpdateEventResponse404, mockResponse)
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
      new UpdateEventError403(Error403 as UpdateEventResponse403, mockResponse)
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
      new UpdateEventError400(Error400 as UpdateEventResponse400, mockResponse)
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
      new UpdateEventError409(Error409 as UpdateEventResponse409, mockResponse)
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
    await expect(client.updateEvent(body, existingVisitorId)).rejects.toThrow(UpdateEventError404)
    await expect(client.updateEvent(body, existingVisitorId)).rejects.toThrow('Request id is not found')
  })
})
