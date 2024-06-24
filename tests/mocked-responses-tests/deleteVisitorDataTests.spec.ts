import { FingerprintJsServerApiClient, Region } from '../../src'
import Error404 from './mocked-responses-data/external/delete_visits_404_error.json'
import Error403 from './mocked-responses-data/external/delete_visits_403_error.json'
import Error400 from './mocked-responses-data/external/delete_visits_400_error.json'
import Error429 from './mocked-responses-data/external/delete_visits_429_error.json'

jest.spyOn(global, 'fetch')

describe('[Mocked response] Delete visitor data', () => {
  const apiKey = 'dummy_api_key'

  const existingVisitorId = 'TaDnMBz9XCpZNuSzFUqP'

  const client = new FingerprintJsServerApiClient({ region: Region.EU, apiKey })

  test('with visitorId', async () => {
    ;(fetch as unknown as jest.Mock).mockReturnValue(Promise.resolve(new Response()))

    const response = await client.deleteVisitorData(existingVisitorId)

    expect(response).toBeUndefined()
  })

  test('404 error', async () => {
    ;(fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(
        new Response(JSON.stringify(Error404), {
          status: 404,
        })
      )
    )

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toMatchObject({
      ...Error404,
      status: 404,
    })
  })

  test('403 error', async () => {
    ;(fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(
        new Response(JSON.stringify(Error403), {
          status: 403,
        })
      )
    )

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toMatchObject({
      ...Error403,
      status: 403,
    })
  })

  test('400 error', async () => {
    ;(fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(
        new Response(JSON.stringify(Error400), {
          status: 400,
        })
      )
    )

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toMatchObject({
      ...Error400,
      status: 400,
    })
  })

  test('429 error', async () => {
    ;(fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(
        new Response(JSON.stringify(Error429), {
          status: 429,
          headers: {
            'retry-after': '5',
          },
        })
      )
    )

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toMatchObject({
      ...Error429,
      status: 429,
      retryAfter: 5,
    })
  })

  test('Error with bad JSON', async () => {
    ;(fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(
        new Response('(Some bad JSON)', {
          status: 404,
        })
      )
    )
    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toEqual({
      status: 0,
      error: new SyntaxError(),
    })
  })

  test('Error with bad shape', async () => {
    const errorInfo = 'Some text instead of shaped object'
    ;(fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(
        new Response(
          JSON.stringify({
            error: errorInfo,
          }),
          {
            status: 404,
          }
        )
      )
    )

    await expect(client.deleteVisitorData(existingVisitorId)).rejects.toEqual({
      status: 0,
      error: {
        response: expect.any(Response),
        error: errorInfo,
        status: 404,
      },
    })
  })
})
