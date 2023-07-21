import fetch from 'node-fetch';
import { Region } from '../../src/types';
import { FingerprintJsServerApiClient } from '../../src/serverApiClient';
import getEventResponse from './mocked-responses-data/external/get_event.json';
import getEventWithExtraFieldsResponse from './mocked-responses-data/external/get_event_extra_fields.json';
import getEventAllErrorsResponse from './mocked-responses-data/external/get_event_all_errors.json';

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

  test('with additional signals', async () => {
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(new Response(JSON.stringify(getEventWithExtraFieldsResponse)))
    );

    const response = await client.getEvent(existingRequestId);
    expect(response).toMatchSnapshot();
  });

  test('with all signals with failed error', async () => {
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(new Response(JSON.stringify(getEventAllErrorsResponse)))
    );

    const response = await client.getEvent(existingRequestId);

    expect(response).toMatchSnapshot();
  });

  test('403 error', async () => {
    const errorInfo = {
      code: 'TokenRequired',
      message: 'secret key is required',
    };
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(
        new Response(
          JSON.stringify({
            error: errorInfo,
          }),
          {
            status: 403,
          }
        )
      )
    );
    await expect(client.getEvent(existingRequestId)).rejects.toMatchObject({
      status: 403,
      error: errorInfo,
    });
  });

  test('404 error', async () => {
    const errorInfo = {
      code: 'RequestNotFound',
      message: 'request id is not found',
    };
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(
        new Response(
          JSON.stringify({
            error: errorInfo,
          }),
          {
            status: 404,
          }
        )
      )
    );
    await expect(client.getEvent(existingRequestId)).rejects.toMatchObject({
      status: 404,
      error: errorInfo,
    });
  });

  test('Error with bad shape', async () => {
    const errorInfo = 'Some text instead og shaped object';
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(
        new Response(
          JSON.stringify({
            error: errorInfo,
          }),
          {
            status: 404,
          }
        )
      )
    );
    await expect(client.getEvent(existingRequestId)).rejects.toMatchSnapshot();
  });

  test('Error with bad JSON', async () => {
    (fetch as unknown as jest.Mock).mockReturnValue(
      Promise.resolve(
        new Response('(Some bad JSON)', {
          status: 404,
        })
      )
    );
    await expect(client.getEvent(existingRequestId)).rejects.toMatchObject({
      status: 0,
    });
  });
});
