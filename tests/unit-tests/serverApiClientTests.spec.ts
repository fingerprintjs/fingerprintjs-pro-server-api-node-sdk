import { RequestError, FingerprintJsServerApiClient, Region, AuthenticationMode } from '../../src'

describe('ServerApiClient', () => {
  it('should support passing custom fetch implementation', async () => {
    const mockFetch = jest.fn().mockResolvedValue(new Response(JSON.stringify({})))

    const client = new FingerprintJsServerApiClient({
      fetch: mockFetch,
      apiKey: 'test',
      region: Region.Global,
    })

    await client.getEvent('eventId')

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('errors should return response that supports body related methods', async () => {
    const responseBody = {
      error: {
        code: 'FeatureNotEnabled',
        message: 'feature not enabled',
      },
    }
    const mockFetch = jest.fn().mockResolvedValue(new Response(JSON.stringify(responseBody), { status: 403 }))

    const client = new FingerprintJsServerApiClient({
      fetch: mockFetch,
      apiKey: 'test',
      region: Region.Global,
    })

    try {
      await client.getEvent('test')
    } catch (e) {
      if (e instanceof RequestError) {
        expect(e.response.status).toBe(403)
        expect(e.responseBody).toEqual(responseBody)

        await expect(e.response.json()).resolves.not.toThrow()

        return
      }
    }

    throw new Error('Expected EventError to be thrown')
  })

  it('should support using a string constant for the Region', () => {
    const client = new FingerprintJsServerApiClient({
      apiKey: 'test',
      region: 'Global',
    })

    // This test just checks that the types provide the expected behavior
    // so a simple assertion to use the client variable is all that is required
    expect(client).toBeTruthy()
  })

  it('should support using a string constant for AuthenticationMode.AuthHeader', async () => {
    const mockFetch = jest.fn().mockResolvedValue(new Response(JSON.stringify({})))

    const client = new FingerprintJsServerApiClient({
      fetch: mockFetch,
      apiKey: 'test',
      region: Region.Global,
      authenticationMode: AuthenticationMode.AuthHeader,
    })

    await client.getEvent('eventId')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(expect.not.stringContaining('api_key=test'), {
      method: 'GET',
      headers: {
        'Auth-API-Key': 'test',
      },
    })
  })

  it.each([[AuthenticationMode.QueryParameter]])(
    'should put the API key in the query parameters for AuthenticationMode.QueryParameter',
    async (authenticationMode) => {
      const mockFetch = jest.fn().mockResolvedValue(new Response(JSON.stringify({})))

      const client = new FingerprintJsServerApiClient({
        fetch: mockFetch,
        apiKey: 'test',
        region: Region.Global,
        authenticationMode,
      })

      await client.getEvent('eventId')

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/.*\?.*api_key=test.*$/), {
        method: 'GET',
        headers: undefined,
      })
    }
  )
})
