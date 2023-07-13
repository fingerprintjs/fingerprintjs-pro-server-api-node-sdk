const {
  FingerprintJsServerApiClient,
  Region,
} = require('@fingerprintjs/fingerprintjs-pro-server-api');
require('dotenv').config();

const apiKey = process.env.API_KEY;
const visitorId = process.env.VISITOR_ID;
const requestId = process.env.REQUEST_ID;

const client = new FingerprintJsServerApiClient({ region: Region.Global, apiKey: apiKey });

async function main() {
  try {
    const [visitorHistory, event] = await Promise.all([
      client.getVisitorHistory(visitorId),
      client.getEvent(requestId),
    ]);

    console.log(JSON.stringify(visitorHistory));
    console.log(JSON.stringify(event));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  process.exit(0);
}

void main();
