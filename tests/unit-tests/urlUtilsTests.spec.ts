import { Region, VisitorHistoryFilter } from '../../src/types'
import { getRequestPath } from '../../src/urlUtils'
import { version } from '../../package.json'

const visitorId = 'TaDnMBz9XCpZNuSzFUqP'
const requestId = '1626550679751.cVc5Pm'
const ii = `ii=fingerprint-pro-server-node-sdk%2F${version}`

describe('Get Event path', () => {
  it('returns correct path without api key', () => {
    const url = getRequestPath({
      path: '/events/{request_id}',
      method: 'get',
      pathParams: [requestId],
      region: Region.Global,
    })
    const expectedPath = `https://api.fpjs.io/events/${requestId}?${ii}`

    expect(url).toEqual(expectedPath)
  })

  it('returns correct path with api key', () => {
    const apiKey = 'test-api-key'
    const url = getRequestPath({
      path: '/events/{request_id}',
      method: 'get',
      pathParams: [requestId],
      apiKey,
      region: Region.Global,
    })
    const expectedPath = `https://api.fpjs.io/events/${requestId}?${ii}&api_key=${apiKey}`

    expect(url).toEqual(expectedPath)
  })
})

describe('Get Visitors path', () => {
  const linkedId = 'makma'
  const limit = 10
  const before = 1626538505244
  const paginationKey = '1683900801733.Ogvu1j'

  test('eu region without filter', async () => {
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'get',
      pathParams: [visitorId],
      region: Region.EU,
    })
    const expectedPath = `https://eu.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  test('ap region without filter', async () => {
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'get',
      pathParams: [visitorId],
      region: Region.AP,
    })
    const expectedPath = `https://ap.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  test('without path param', async () => {
    expect(() =>
      getRequestPath({
        path: '/visitors/{visitor_id}',
        method: 'get',
        pathParams: [],
        region: Region.AP,
      })
    ).toThrowError('Missing path parameter for visitor_id')
  })

  test('unsupported region', async () => {
    expect(() =>
      getRequestPath({
        path: '/visitors/{visitor_id}',
        method: 'get',
        pathParams: [visitorId],
        // @ts-expect-error
        region: 'INVALID',
      })
    ).toThrowError('Unsupported region')
  })

  test('eu region with request_id filter', async () => {
    const filter: VisitorHistoryFilter = { request_id: requestId }
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'get',
      queryParams: filter,
      pathParams: [visitorId],
      region: Region.EU,
    })
    const expectedPath = `https://eu.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  test('eu region with request_id linked_id filters', async () => {
    const filter: VisitorHistoryFilter = { request_id: requestId, linked_id: linkedId }
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'get',
      queryParams: filter,
      pathParams: [visitorId],
      region: Region.EU,
    })
    const expectedPath = `https://eu.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&linked_id=makma&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  test('eu region with request_id, linked_id, limit, before filters', async () => {
    const filter: VisitorHistoryFilter = {
      request_id: requestId,
      linked_id: linkedId,
      limit,
      before,
    }
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'get',
      queryParams: filter,
      pathParams: [visitorId],
      region: Region.EU,
    })
    const expectedPath = `https://eu.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&linked_id=makma&limit=10&before=1626538505244&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  test('eu region with request_id, linked_id, limit, paginationKey filters', async () => {
    const filter: VisitorHistoryFilter = {
      request_id: requestId,
      linked_id: linkedId,
      limit,
      paginationKey,
    }
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'get',
      queryParams: filter,
      pathParams: [visitorId],
      region: Region.EU,
    })
    const expectedPath = `https://eu.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&linked_id=makma&limit=10&paginationKey=1683900801733.Ogvu1j&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  test('global region without filter', async () => {
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'get',
      pathParams: [visitorId],
      region: Region.Global,
    })
    const expectedPath = `https://api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  test('global region with request_id filter', async () => {
    const filter: VisitorHistoryFilter = { request_id: requestId }
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'get',
      pathParams: [visitorId],
      region: Region.Global,
      queryParams: filter,
    })
    const expectedPath = `https://api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  test('global region with request_id linked_id filters', async () => {
    const filter: VisitorHistoryFilter = { request_id: requestId, linked_id: linkedId }
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'get',
      pathParams: [visitorId],
      queryParams: filter,
      region: Region.Global,
    })
    const expectedPath = `https://api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&linked_id=makma&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  test('global region with request_id, linked_id, limit, paginationKey filters', async () => {
    const filter: VisitorHistoryFilter = {
      request_id: requestId,
      linked_id: linkedId,
      limit,
      paginationKey,
    }
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'get',
      pathParams: [visitorId],
      region: Region.Global,
      queryParams: filter,
    })
    const expectedPath = `https://api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&linked_id=makma&limit=10&paginationKey=1683900801733.Ogvu1j&${ii}`
    expect(actualPath).toEqual(expectedPath)
  })
})

describe('Delete visitor path', () => {
  test('eu region', async () => {
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'delete',
      pathParams: [visitorId],
      region: Region.EU,
    })
    const expectedPath = `https://eu.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  test('ap region', async () => {
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'delete',
      pathParams: [visitorId],
      region: Region.AP,
    })
    const expectedPath = `https://ap.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?${ii}`
    expect(actualPath).toEqual(expectedPath)
  })

  test('global region', async () => {
    const actualPath = getRequestPath({
      path: '/visitors/{visitor_id}',
      method: 'delete',
      pathParams: [visitorId],
      region: Region.Global,
    })
    const expectedPath = `https://api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?${ii}`
    expect(actualPath).toEqual(expectedPath)
  })
})

describe('getRequestPath', () => {
  it('disallows normalized path segments', () => {
    expect(() => {
      getRequestPath({
        path: '/visitors/../events' as '/events/{request_id}',
        method: 'get',
        pathParams: [requestId],
        region: Region.Global,
      })
    }).toThrow('Invalid path: path changed during normalization')
  })
})

// Encoding does not depend on which parameter is being replaced, so these run against one
// path. That every operation routes through it is covered by the mocked-response tests.
describe('path parameter encoding', () => {
  const eventPath = (param: unknown) =>
    getRequestPath({
      path: '/events/{request_id}',
      method: 'get',
      pathParams: [param] as string[],
      region: Region.Global,
    })

  it.each([
    ['../events', '..%2Fevents'],
    ['../', '..%2F'],
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
    // A placeholder in a parameter must not reach the next replacement, which would matter
    // for a path with two placeholders.
    ['{request_id}', '%7Brequest_id%7D'],
    ['1626550679751.cVc5Pm', '1626550679751.cVc5Pm'],
    // An untyped caller can pass something that is not a string but stringifies to one.
    [new String('../events'), '..%2Fevents'],
  ])('keeps %j inside a single path segment', (param, encoded) => {
    expect(eventPath(param)).toEqual(`https://api.fpjs.io/events/${encoded}?${ii}`)
  })

  it.each([
    ['.', '.', 'Invalid path parameter for request_id: .'],
    ['..', '..', 'Invalid path parameter for request_id: ..'],
    ['a String object', new String('..'), 'Invalid path parameter for request_id: ..'],
    ['an object with a toString', { toString: () => '..' }, 'Invalid path parameter for request_id: ..'],
    ['an array', ['..'], 'Invalid path parameter for request_id: ..'],
    // A lone surrogate makes `encodeURIComponent` throw a `URIError`
    ['a lone surrogate', '\ud800', 'Invalid path parameter for request_id'],
    // These have no primitive representation, so `String` itself throws
    ['an object without a prototype', Object.create(null), 'Invalid path parameter for request_id'],
    [
      'an object whose toString throws',
      {
        toString: () => {
          throw new Error('boom')
        },
      },
      'Invalid path parameter for request_id',
    ],
  ])('rejects %s', (_, param, message) => {
    // Asserted separately from the message because some of these carry a `cause`, which
    // `toThrow(new TypeError(...))` would compare too.
    expect(() => eventPath(param)).toThrow(TypeError)
    expect(() => eventPath(param)).toThrow(message)
  })

  it('preserves the cause when string coercion fails', () => {
    const cause = new Error('boom')
    const param = {
      toString: () => {
        throw cause
      },
    }

    expect(() => eventPath(param)).toThrow(
      expect.objectContaining({
        message: 'Invalid path parameter for request_id',
        cause,
      })
    )
  })

  it.each([
    ['an empty string', ''],
    ['an empty String object', new String('')],
    ['null', null],
    ['undefined', undefined],
  ])('rejects %s as missing', (_, param) => {
    expect(() => eventPath(param)).toThrow(new TypeError('Missing path parameter for request_id'))
  })
})
