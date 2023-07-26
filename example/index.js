const {
  FingerprintJsServerApiClient,
  Region,
} = require('@fingerprintjs/fingerprintjs-pro-server-api');
require('dotenv').config();

const apiKey = process.env.API_KEY || 'API key not defined';
const visitorId = process.env.VISITOR_ID || 'Visitor ID not defined';
const requestId = process.env.REQUEST_ID || 'Request ID not defined';
const envRegion = process.env.REGION;

let region = Region.Global;
if (envRegion === 'eu') {
  region = Region.EU;
} else if (envRegion === 'ap') {
  region = Region.AP;
}

const client = new FingerprintJsServerApiClient({ region, apiKey: apiKey });

async function main() {
  try {
    const [visitorHistory, event] = await Promise.all([
      client.getVisitorHistory(visitorId, { limit: 1 }),
      client.getEvent(requestId),
    ]);

    console.log(JSON.stringify(visitorHistory, null, 2));
    console.log(JSON.stringify(event, null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
