import { VisitorHistoryFilter, Region } from '../src/types';
import { FingerprintJsServerApiClient } from '../src/serverApiClient';
import { FingerprintJsServerApiConfig } from '../src/serverApiConfig';

describe('Get Visitors', () => {

  const authToken = 'REzGDv7I78VvztIik3UM'; // use your own test auth token here, consider invalidating it after use
  const existingVisitorId = "TaDnMBz9XCpZNuSzFUqP";
  const existingRequestId = "1626550679751.cVc5Pm";
  const existingLinkedId = "makma";

  const config = new FingerprintJsServerApiConfig(Region.EU, authToken);
  const client = new FingerprintJsServerApiClient(config);

  test('without filter', async () => {
    const response = await client.getVisitorHistory(existingVisitorId);
    expect(response).toMatchSnapshot();
  });

  test('with request_id filter', async () => {
    const filter: VisitorHistoryFilter = { request_id: existingRequestId };
    const response = await client.getVisitorHistory(existingVisitorId, filter);
    expect(response).toMatchSnapshot();
  });

  test('with request_id and linked_id filter', async () => {
    const filter: VisitorHistoryFilter = { request_id: existingRequestId, linked_id: existingLinkedId };
    const response = await client.getVisitorHistory(existingVisitorId, filter);
    expect(response).toMatchSnapshot();
  });

  test('with linked_id and limit filter', async () => {
    const filter: VisitorHistoryFilter = { linked_id: existingLinkedId, limit: 5 };
    const response = await client.getVisitorHistory(existingVisitorId, filter);
    expect(response).toMatchSnapshot();
  });

  test('with limit and before', async () => {
    const filter: VisitorHistoryFilter = { limit: 4, before: 1626538505244 };
    const response = await client.getVisitorHistory(existingVisitorId, filter);
    expect(response).toMatchSnapshot();
  });
});