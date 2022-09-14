import fetch from 'node-fetch';
import { Region } from '../../src/types';
import { FingerprintJsServerApiClient } from '../../src/serverApiClient';
import getEventResponse from './mocked-responses-data/get-event-body.json';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch');

describe('[Mocked response] Get Event', () => {
  const apiKey = 'dummy_api_key';
  const existingRequestId = '1626550679751.cVc5Pm';

  const client = new FingerprintJsServerApiClient({ region: Region.EU, apiKey });

  test('with request_id', async () => {
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(new Response(JSON.stringify(getEventResponse)))
    );

    const response = await client.getEvent(existingRequestId);

    expect(response).toMatchSnapshot();
  });
});
