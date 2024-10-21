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
