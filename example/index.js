import { FingerprintJsServerApiClient, Region } from '@fingerprintjs/fingerprintjs-pro-server-api';
import 'dotenv/config';

const apiKey = process.env.API_KEY;
const visitorId = process.env.VISITOR_ID;

const client = new FingerprintJsServerApiClient({ region: Region.Global, apiKey: apiKey });

try {
  const visitorHistory = await client.getVisitorHistory(visitorId);
  if (visitorHistory.visitorId !== visitorId) {
    console.error('Received visitorId does not match with given');
    process.exit(1);
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}

process.exit(0);
