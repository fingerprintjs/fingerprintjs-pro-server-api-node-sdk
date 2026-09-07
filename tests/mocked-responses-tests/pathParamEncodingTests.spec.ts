import { FingerprintServerApiClient, Region } from '../../src'
import { getIntegrationInfo } from '../../src/urlUtils'
import { describe, expect, it } from 'vitest'
import { mockFetch } from './mockFetch'

/**
 * A path parameter must never be able to change which endpoint or which host the SDK talks
 * to, no matter what the caller passes in.
 */
describe('[Mocked response] Path parameter encoding', () => {
  const apiKey = 'dummy_api_key'
  const ii = `ii=${encodeURIComponent(getIntegrationInfo())}`

  const client = new FingerprintServerApiClient({ region: Region.EU, apiKey })

  const emptyResponse = () => new Response(undefined, { headers: { 'content-length': '0' } })

  const operations = [
    {
      name: 'getEvent',
      prefix: 'v4/events',
      placeholder: 'event_id',
      paramName: 'eventId',
      call: (param: string) => client.getEvent(param),
    },
    {
      name: 'updateEvent',
      prefix: 'v4/events',
      placeholder: 'event_id',
      paramName: 'eventId',
      call: (param: string) => client.updateEvent(param, { suspect: true }),
    },
    {
      name: 'deleteVisitorData',
      prefix: 'v4/visitors',
      placeholder: 'visitor_id',
      paramName: 'visitorId',
      call: (param: string) => client.deleteVisitorData(param),
    },
  ] as const

  describe.each(operations)('$name', ({ prefix, placeholder, paramName, call }) => {
    it.each([
      ['../events', '..%2Fevents'],
      ['/../../events', '%2F..%2F..%2Fevents'],
      ['evil.com', 'evil.com'],
      ['//evil.com', '%2F%2Fevil.com'],
      ['https://evil.com', 'https%3A%2F%2Fevil.com'],
    ])('requests a single path segment for %j', async (param, encoded) => {
      mockFetch.mockReturnValue(Promise.resolve(emptyResponse()))

      await call(param).catch(() => undefined)

      const requestedUrl = mockFetch.mock.calls[0]?.[0] as string
      expect(requestedUrl).toEqual(`https://eu.api.fpjs.io/${prefix}/${encoded}?${ii}`)
      expect(new URL(requestedUrl).host).toEqual('eu.api.fpjs.io')
    })

    it.each(['.', '..'])('does not send a request for %j', async (param) => {
      await expect(call(param)).rejects.toThrow(new TypeError(`Invalid path parameter for ${placeholder}`))

      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('does not send a request for an empty parameter', async () => {
      await expect(call('')).rejects.toThrow(new TypeError(`${paramName} is not set`))

      expect(mockFetch).not.toHaveBeenCalled()
    })
  })
})
