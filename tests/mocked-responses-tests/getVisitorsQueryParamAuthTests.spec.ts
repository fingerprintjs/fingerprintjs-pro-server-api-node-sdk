import fetch from 'node-fetch';
import { AuthenticationMode, VisitorHistoryFilter, Region } from '../../src/types';
import { FingerprintJsServerApiClient } from '../../src/serverApiClient';
import visitorsWithoutFilterResponse from './mocked-responses-data/visitors-without-filter-response.json';
import visitorsResponseWithRequestId from './mocked-responses-data/visitors-with-request-id.json';
import visitorsResponseWithRequestIdLinkedId from './mocked-responses-data/visitors-with-request-id-linked-id.json';
import visitorsResponseWithLinkedIdLimit from './mocked-responses-data/visitors-with-linked-id-limit.json';
import visitorsWithLimitBefore from './mocked-responses-data/visitors-with-limit-before.json';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch');

describe('[Mocked response] Get Visitors', () => {
  const authToken = 'dummy_auth_token';
  const existingVisitorId = 'TaDnMBz9XCpZNuSzFUqP';
  const existingRequestId = '1626550679751.cVc5Pm';
  const existingLinkedId = 'makma';

  const client = new FingerprintJsServerApiClient({
    region: Region.EU,
    apiToken: authToken,
    authenticationMode: AuthenticationMode.QueryParameter,
  });

  test('without filter', async () => {
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(new Response(JSON.stringify(visitorsWithoutFilterResponse)))
    );

    const response = await client.getVisitorHistory(existingVisitorId);
    expect(response).toMatchSnapshot();
  });

  test('with request_id filter', async () => {
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(new Response(JSON.stringify(visitorsResponseWithRequestId)))
    );

    const filter: VisitorHistoryFilter = { request_id: existingRequestId };
    const response = await client.getVisitorHistory(existingVisitorId, filter);
    expect(response).toMatchSnapshot();
  });

  test('with request_id and linked_id filter', async () => {
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(new Response(JSON.stringify(visitorsResponseWithRequestIdLinkedId)))
    );

    const filter: VisitorHistoryFilter = {
      request_id: existingRequestId,
      linked_id: existingLinkedId,
    };
    const response = await client.getVisitorHistory(existingVisitorId, filter);
    expect(response).toMatchSnapshot();
  });

  test('with linked_id and limit filter', async () => {
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(new Response(JSON.stringify(visitorsResponseWithLinkedIdLimit)))
    );

    const filter: VisitorHistoryFilter = { linked_id: existingLinkedId, limit: 5 };
    const response = await client.getVisitorHistory(existingVisitorId, filter);
    expect(response).toMatchSnapshot();
  });

  test('with limit and before', async () => {
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(new Response(JSON.stringify(visitorsWithLimitBefore)))
    );

    const filter: VisitorHistoryFilter = { limit: 4, before: 1626538505244 };
    const response = await client.getVisitorHistory(existingVisitorId, filter);
    expect(response).toMatchSnapshot();
  });
});
