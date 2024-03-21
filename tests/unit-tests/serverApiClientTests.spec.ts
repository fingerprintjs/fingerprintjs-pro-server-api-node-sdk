import { FingerprintJsServerApiClient, Region } from '../../src'

describe('ServerApiClient', () => {
  it('should support passing custom fetch implementation', async () => {
    const mockFetch = jest.fn().mockResolvedValue(new Response(JSON.stringify({})))

    const client = new FingerprintJsServerApiClient({
      fetch: mockFetch as any,
      apiKey: 'test',
      region: Region.Global,
    })

    await client.getVisitorHistory('visitorId')

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})
