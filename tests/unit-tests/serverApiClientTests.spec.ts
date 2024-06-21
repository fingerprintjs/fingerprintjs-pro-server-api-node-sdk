import { FingerprintJsServerApiClient, isEventError, Region } from '../../src'

describe('ServerApiClient', () => {
  it('should support passing custom fetch implementation', async () => {
    const mockFetch = jest.fn().mockResolvedValue(new Response(JSON.stringify({})))

    const client = new FingerprintJsServerApiClient({
      fetch: mockFetch,
      apiKey: 'test',
      region: Region.Global,
    })

    await client.getVisitorHistory('visitorId')

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('errors should return response that supports body related methods', async () => {
    const mockFetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'FeatureNotEnabled',
            message: 'feature not enabled',
          },
        }),
        { status: 403 }
      )
    )

    const client = new FingerprintJsServerApiClient({
      fetch: mockFetch,
      apiKey: 'test',
      region: Region.Global,
    })

    try {
      await client.getEvent('test')
    } catch (e) {
      if (isEventError(e)) {
        expect(e.response.status).toBe(403)

        await expect(e.response.json()).resolves.not.toThrow()

        return
      }
    }

    throw new Error('Expected EventError to be thrown')
  })
})
