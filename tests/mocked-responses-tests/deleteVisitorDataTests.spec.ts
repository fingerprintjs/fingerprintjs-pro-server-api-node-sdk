import { FingerprintJsServerApiClient, Region } from '../../src'
import Error404 from './mocked-responses-data/external/delete_visits_404_error.json'
import Error403 from './mocked-responses-data/external/delete_visits_403_error.json'

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
