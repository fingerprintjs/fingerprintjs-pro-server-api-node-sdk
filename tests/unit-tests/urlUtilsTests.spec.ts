import { describe, expect, it } from 'vitest'
import { Region, SearchEventsFilter } from '../../src'
import { version } from '../../package.json'
import { getRequestPath } from '../../src/urlUtils'

const visitorId = 'TaDnMBz9XCpZNuSzFUqP'
const eventId = '1626550679751.cVc5Pm'
const ii = `ii=fingerprint-pro-server-node-sdk%2F${version}`

describe('Get Event path', () => {
  it('returns correct path', () => {
    const url = getRequestPath({
      path: '/events/{event_id}',
      method: 'get',
      pathParams: [eventId],
      region: Region.Global,
    })
    const expectedPath = `https://api.fpjs.io/v4/events/${eventId}?${ii}`

    expect(url).toEqual(expectedPath)
  })
})

describe('Get Event Search path', () => {
  const linkedId = 'linkedId'
  const limit = 10
  const end = 1626538505244
  const start = 1626538505241
  const paginationKey = '1683900801733.Ogvu1j'

  it('eu region with linked_id filters', () => {
    const filter: SearchEventsFilter = { linked_id: linkedId }
    const actualPath = getRequestPath({
      path: '/events',
      method: 'get',
      queryParams: filter,
      region: Region.EU,
    })
    const expectedPath = `https://eu.api.fpjs.io/v4/events?linked_id=${linkedId}&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  it('eu region with linked_id, limit, start, end filters', () => {
    const filter: SearchEventsFilter = {
      linked_id: linkedId,
      limit,
      start,
      end,
    }
    const actualPath = getRequestPath({
      path: '/events',
      method: 'get',
      queryParams: filter,
      region: Region.EU,
    })
    const expectedPath = `https://eu.api.fpjs.io/v4/events?linked_id=${linkedId}&limit=${String(limit)}&start=${String(start)}&end=${String(end)}&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  it('eu region with linked_id, limit, paginationKey filters', () => {
    const filter: SearchEventsFilter = {
      linked_id: linkedId,
      limit,
      pagination_key: paginationKey,
    }
    const actualPath = getRequestPath({
      path: '/events',
      method: 'get',
      queryParams: filter,
      region: Region.EU,
    })
    const expectedPath = `https://eu.api.fpjs.io/v4/events?linked_id=${linkedId}&limit=${String(limit)}&pagination_key=${paginationKey}&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  it('global region without filter', () => {
    const actualPath = getRequestPath({
      path: '/events',
      method: 'get',
      region: Region.Global,
    })
    const expectedPath = `https://api.fpjs.io/v4/events?${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  it('global region with linked_id filters', () => {
    const filter: SearchEventsFilter = { linked_id: linkedId }
    const actualPath = getRequestPath({
      path: '/events',
      method: 'get',
      queryParams: filter,
      region: Region.Global,
    })
    const expectedPath = `https://api.fpjs.io/v4/events?linked_id=${linkedId}&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  it('global region with linked_id, limit, paginationKey filters', () => {
    const filter: SearchEventsFilter = {
      linked_id: linkedId,
      limit,
      pagination_key: paginationKey,
    }
    const actualPath = getRequestPath({
      path: '/events',
      method: 'get',
      region: Region.Global,
      queryParams: filter,
    })
    const expectedPath = `https://api.fpjs.io/v4/events?linked_id=${linkedId}&limit=${String(limit)}&pagination_key=${paginationKey}&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })
})

describe('Delete visitor path', () => {
  it('eu region', () => {
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'delete',
      pathParams: [visitorId],
      region: Region.EU,
    })
    const expectedPath = `https://eu.api.fpjs.io/v4/visitors/TaDnMBz9XCpZNuSzFUqP?${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  it('ap region', () => {
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'delete',
      pathParams: [visitorId],
      region: Region.AP,
    })
    const expectedPath = `https://ap.api.fpjs.io/v4/visitors/TaDnMBz9XCpZNuSzFUqP?${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  it('global region', () => {
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'delete',
      pathParams: [visitorId],
      region: Region.Global,
    })
    const expectedPath = `https://api.fpjs.io/v4/visitors/TaDnMBz9XCpZNuSzFUqP?${ii}`
    expect(actualPath).toEqual(expectedPath)
  })
})

describe('getRequestPath', () => {
  it('serializes string[] and skips null and undefined', () => {
    const actual = getRequestPath({
      path: '/events',
      method: 'get',
      region: Region.Global,
      queryParams: {
        environment: ['a', null as unknown as string, 'b', undefined as unknown as string],
        linked_id: null as unknown as string,
        limit: undefined,
      },
    })

    const expected = `https://api.fpjs.io/v4/events?environment=a&environment=b&${ii}`
    expect(actual).toEqual(expected)
  })

  it('throws error on unsupported region', () => {
    expect(() => {
      getRequestPath({
        path: '/events',
        method: 'get',
        region: 'unknown' as Region,
      })
    }).toThrow('Unsupported region')
  })

  it('throws error when required path param is missing', () => {
    expect(() => {
      getRequestPath({
        path: '/events/{event_id}',
        method: 'get',
        pathParams: [],
      })
    }).toThrow('Missing path parameter for event_id')
  })

  it('encodes special characters', () => {
    const actual = getRequestPath({
      path: '/events',
      method: 'get',
      queryParams: {
        linked_id: 'a b+c%d',
      },
    })

    const expected = `https://api.fpjs.io/v4/events?linked_id=a+b%2Bc%25d&${ii}`
    expect(actual).toEqual(expected)
  })
})

describe('path parameter encoding', () => {
  const pathsWithParams = [
    { path: '/events/{event_id}', method: 'get', prefix: 'v4/events', placeholder: 'event_id' },
    { path: '/visitors/{visitor_id}', method: 'delete', prefix: 'v4/visitors', placeholder: 'visitor_id' },
  ] as const

  describe.each(pathsWithParams)('$path', ({ path, method, prefix, placeholder }) => {
    it.each([
      ['../events', '..%2Fevents'],
      ['/../../events', '%2F..%2F..%2Fevents'],
      ['evil.com', 'evil.com'],
      ['//evil.com', '%2F%2Fevil.com'],
      ['https://evil.com', 'https%3A%2F%2Fevil.com'],
      ['a b#c?d', 'a%20b%23c%3Fd'],
      ['%2e%2e', '%252e%252e'],
      ['..%2fevents', '..%252fevents'],
      ['..\\..', '..%5C..'],
      ['$&', '%24%26'],
      ['...', '...'],
      // Guards the assumption that a placeholder in a parameter cannot reach the next
      // replacement, which would matter for a path with two placeholders.
      ['{event_id}', '%7Bevent_id%7D'],
      ['1626550679751.cVc5Pm', '1626550679751.cVc5Pm'],
    ])('keeps %j inside a single path segment', (param, encoded) => {
      const actual = getRequestPath({ path, method, pathParams: [param], region: Region.Global })

      expect(actual).toEqual(`https://api.fpjs.io/${prefix}/${encoded}?${ii}`)
      expect(new URL(actual).host).toEqual('api.fpjs.io')
    })

    it.each(['.', '..'])('rejects the dot segment %j', (param) => {
      expect(() => getRequestPath({ path, method, pathParams: [param], region: Region.Global })).toThrow(
        /^Invalid path parameter for /
      )
    })

    it('rejects an empty parameter', () => {
      expect(() => getRequestPath({ path, method, pathParams: [''], region: Region.Global })).toThrow(
        /^Missing path parameter for /
      )
    })

    it('rejects a value that cannot be encoded', () => {
      // A lone surrogate makes `encodeURIComponent` throw a `URIError`
      expect(() => getRequestPath({ path, method, pathParams: ['\ud800'], region: Region.Global })).toThrow(
        new TypeError(`Invalid path parameter for ${placeholder}`)
      )
    })

    // An untyped caller can pass a value that is not a string but stringifies to one.
    describe('non-string parameters', () => {
      const asPathParams = (param: unknown) => [param] as unknown as string[]

      it.each([
        ['a String object', new String('..')],
        ['an object with a toString', { toString: () => '..' }],
        ['an array', ['..']],
      ])('rejects the dot segment from %s', (_, param) => {
        expect(() => getRequestPath({ path, method, pathParams: asPathParams(param), region: Region.Global })).toThrow(
          /^Invalid path parameter for /
        )
      })

      it.each([
        ['an empty String object', new String('')],
        ['null', null],
      ])('rejects %s as missing', (_, param) => {
        expect(() => getRequestPath({ path, method, pathParams: asPathParams(param), region: Region.Global })).toThrow(
          /^Missing path parameter for /
        )
      })

      it('encodes a stringified value that is not a dot segment', () => {
        const actual = getRequestPath({
          path,
          method,
          pathParams: asPathParams(new String('../events')),
          region: Region.Global,
        })

        expect(actual).toEqual(`https://api.fpjs.io/${prefix}/..%2Fevents?${ii}`)
      })
    })
  })
})
