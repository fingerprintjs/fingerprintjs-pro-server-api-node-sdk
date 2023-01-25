import { Region, VisitorHistoryFilter } from './types';
import { version } from '../package.json';

const euRegionUrl = 'https://eu.api.fpjs.io/';
const apRegionUrl = 'https://ap.api.fpjs.io/';
const globalRegionUrl = 'https://api.fpjs.io/';

type QueryStringParameters = VisitorHistoryFilter & {
  api_key?: string;
  ii: string;
};

function getIntegrationInfo() {
  return `fingerprint-pro-server-node-sdk/${version}`;
}

export function getEventUrl(requestId: string, region: Region, apiKey?: string) {
  const params: QueryStringParameters = {
    ii: getIntegrationInfo(),
  };

  if (apiKey) {
    params.api_key = apiKey;
  }

  return `${getServerApiUrl(region)}events/${requestId}?${serializeQueryStringParams(params)}`;
}

export function getVisitorsUrl(
  region: Region,
  visitorId: string,
  filter?: VisitorHistoryFilter,
  apiKey?: string
): string {
  const queryStringParameters: QueryStringParameters = {
    ...filter,
    ii: getIntegrationInfo(),
  };

  if (apiKey) {
    queryStringParameters.api_key = apiKey;
  }

  const serverApiPath = getVisitorsPath(region, visitorId);
  const queryString = serializeQueryStringParams(queryStringParameters);

  return `${serverApiPath}?${queryString}`;
}

function serializeQueryStringParams(params: QueryStringParameters): string {
  const urlSearchParams = new URLSearchParams(Object.entries(params) as Array<[string, string]>);

  return urlSearchParams.toString();
}

function getVisitorsPath(region: Region, visitorId: string): string {
  const serverApiUrl = getServerApiUrl(region);
  const serverApiPath = `${serverApiUrl}visitors/${visitorId}`;
  return serverApiPath;
}

function getServerApiUrl(region: Region): string {
  switch (region) {
    case Region.EU:
      return euRegionUrl;
    case Region.AP:
      return apRegionUrl;
    case Region.Global:
      return globalRegionUrl;
    default:
      throw new Error('Unsupported region');
  }
}
