import { FingerprintJsServerApiClient, Region } from '@fingerprintjs/fingerprintjs-pro-server-api';
import 'dotenv/config';

const apiKey = process.env.API_KEY;
const visitorId = process.env.VISITOR_ID;
const requestId = process.env.REQUEST_ID;

const client = new FingerprintJsServerApiClient({ region: Region.Global, apiKey: apiKey });

try {
  const [visitorHistory, event] = await Promise.all([
    client.getVisitorHistory(visitorId),
    client.getEvent(requestId),
  ]);
} catch (e) {
  console.error(e);
  process.exit(1);
}

process.exit(0);
