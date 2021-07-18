import { Region } from '../src/types';
import { getVisitorsPath } from '../src/pathUtils';

describe('Get Visitors path', () => {

  const existingVisitorId = "TaDnMBz9XCpZNuSzFUqP";

  test('eu region', async () => {
    // @ts-ignore
    const actualPath = getVisitorsPath(Region.EU, existingVisitorId);
    const expectedPath = "https://eu.api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP";
    expect(actualPath).toEqual(expectedPath);
  });

  test('global region', async () => {
    // @ts-ignore
    const actualPath = getVisitorsPath(Region.Global, existingVisitorId);
    const expectedPath = "https://api.fpjs.io/visitors/TaDnMBz9XCpZNuSzFUqP";
    expect(actualPath).toEqual(expectedPath);
  });
});