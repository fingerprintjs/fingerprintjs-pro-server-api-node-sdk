import { VisitWebhook } from '../../src/types';
import visitWebhookBody from './mocked-responses-data/visit-webhook-body.json';

describe('[Mocked body] Cast visitor webhook', () => {
  test('with sample request body', async () => {
    const visit = visitWebhookBody as unknown as VisitWebhook;

    expect(visit).toMatchSnapshot();

    // TODO: check all properties manually
    // expect(requestBody.requestId).toEqual("1627054081281.wo4lLc");
    // expect(requestBody.visitorId).toEqual("TaDnMBz9XCpZNuSzFUqP");

    // expect(requestBody.browserDetails.browserName).toEqual("Chrome");
    // expect(requestBody.browserDetails.browserMajorVersion).toEqual("92");
    // expect(requestBody.browserDetails.browserFullVersion).toEqual("92.0.4515");
    // expect(requestBody.browserDetails.os).toEqual("Windows");
    // expect(requestBody.browserDetails.osVersion).toEqual("10");
    // expect(requestBody.browserDetails.device).toEqual("Other");
    // expect(requestBody.browserDetails.userAgent).toEqual("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36");
    // // not documented
    // // expect(requestBody.browserDetails.botProbability).toEqual(0);

    // expect(requestBody.incognito).toEqual(false);
    // expect(requestBody.ip).toEqual("185.5.70.59");

    // expect(requestBody.ipLocation.accuracyRadius).toEqual(100);
    // expect(requestBody.ipLocation.city).toEqual(null);
  });
});
