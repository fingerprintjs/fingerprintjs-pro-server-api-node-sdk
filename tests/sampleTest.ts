import { VisitorHistoryFilter } from './../src/types';
import { FingerprintJsServerApiClient } from './../src/serverApiClient';
import { Region } from '../src/types';
import { FingerprintJsServerApiConfig } from './../src/serverApiConfig';

describe('Get Visitors', () => {

  const authToken = 'REzGDv7I78VvztIik3UM'; // use your own test auth token here, consider invalidating it after use
  const visitorId = "TaDnMBz9XCpZNuSzFUqP";
  const existingRequestId = "1626550679751.cVc5Pm";
  const existingLinkedId = "makma";

  const config = new FingerprintJsServerApiConfig(Region.EU, authToken);
  const client = new FingerprintJsServerApiClient(config);

  test('without filter', async () => {
    try {
      const response = await client.getVisitorHistory(visitorId);
      expect(response).toMatchSnapshot();
    } catch (e) {
      fail();
    }
  });

  test('with request_id filter', async () => {
    try {
      const filter: VisitorHistoryFilter = { request_id: existingRequestId };
      const response = await client.getVisitorHistory(visitorId, filter);
      expect(response).toMatchSnapshot();
    } catch (e) {
      fail();
    }
  });

  test('with request_id and linked_id filter', async () => {
    try {
      const filter: VisitorHistoryFilter = { request_id: existingRequestId, linked_id: existingLinkedId };
      const response = await client.getVisitorHistory(visitorId, filter);
      expect(response).toMatchSnapshot();
    } catch (e) {
      fail();
    }
  });

  test('with linked_id and limit filter', async () => {
    try {
      const filter: VisitorHistoryFilter = { linked_id: existingLinkedId, limit: 5 };
      const response = await client.getVisitorHistory(visitorId, filter);
      expect(response).toMatchSnapshot();
    } catch (e) {
      fail();
    }
  });

  test('with limit and before', async () => {
    try {
      const filter: VisitorHistoryFilter = { limit: 5, before: 1626538505244 };
      const response = await client.getVisitorHistory(visitorId, filter);
      expect(response).toMatchSnapshot();
    } catch (e) {
      fail();
    }
  });
});