import { Region, VisitorHistoryFilter } from '../../src/types';
import { getVisitorsUrl } from '../../src/urlUtils';
import { version } from '../../package.json';

describe('Get Visitors path', () => {
  const visitorId = 'TaDnMBz9XCpZNuSzFUqP';
  const requestId = '1626550679751.cVc5Pm';
  const linkedId = 'makma';
  const limit = 10;
  const before = 1626538505244;
  const ii = `ii=fingerprint-pro-server-node-sdk%2F${version}`;

  test('eu region without filter', async () => {
    const actualPath = getVisitorsUrl(Region.EU, visitorId);
    const expectedPath = `https://eu.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?${ii}`;
    expect(actualPath).toEqual(expectedPath);
  });

  test('eu region with request_id filter', async () => {
    const filter: VisitorHistoryFilter = { request_id: requestId };
    const actualPath = getVisitorsUrl(Region.EU, visitorId, filter);
    const expectedPath = `https://eu.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&${ii}`;
    expect(actualPath).toEqual(expectedPath);
  });

  test('eu region with request_id linked_id filters', async () => {
    const filter: VisitorHistoryFilter = { request_id: requestId, linked_id: linkedId };
    const actualPath = getVisitorsUrl(Region.EU, visitorId, filter);
    const expectedPath = `https://eu.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&linked_id=makma&${ii}`;
    expect(actualPath).toEqual(expectedPath);
  });

  test('eu region with request_id, linked_id, limit, before filters', async () => {
    const filter: VisitorHistoryFilter = {
      request_id: requestId,
      linked_id: linkedId,
      limit,
      before,
    };
    const actualPath = getVisitorsUrl(Region.EU, visitorId, filter);
    const expectedPath = `https://eu.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&linked_id=makma&limit=10&before=1626538505244&${ii}`;
    expect(actualPath).toEqual(expectedPath);
  });

  test('global region without filter', async () => {
    const actualPath = getVisitorsUrl(Region.Global, visitorId);
    const expectedPath = `https://api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?${ii}`;
    expect(actualPath).toEqual(expectedPath);
  });

  test('global region with request_id filter', async () => {
    const filter: VisitorHistoryFilter = { request_id: requestId };
    const actualPath = getVisitorsUrl(Region.Global, visitorId, filter);
    const expectedPath = `https://api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&${ii}`;
    expect(actualPath).toEqual(expectedPath);
  });

  test('global region with request_id linked_id filters', async () => {
    const filter: VisitorHistoryFilter = { request_id: requestId, linked_id: linkedId };
    const actualPath = getVisitorsUrl(Region.Global, visitorId, filter);
    const expectedPath = `https://api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&linked_id=makma&${ii}`;
    expect(actualPath).toEqual(expectedPath);
  });

  test('global region with request_id, linked_id, limit, before filters', async () => {
    const filter: VisitorHistoryFilter = {
      request_id: requestId,
      linked_id: linkedId,
      limit,
      before,
    };
    const actualPath = getVisitorsUrl(Region.Global, visitorId, filter);
    const expectedPath = `https://api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP?request_id=1626550679751.cVc5Pm&linked_id=makma&limit=10&before=1626538505244&${ii}`;
    expect(actualPath).toEqual(expectedPath);
  });
});
