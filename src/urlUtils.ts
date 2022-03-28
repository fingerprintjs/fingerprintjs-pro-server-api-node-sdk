import querystring from 'querystring';
import { Region, VisitorHistoryFilter } from './types';

const euRegionUrl = 'https://eu.api.fpjs.io/';
const apRegionUrl = 'https://ap.api.fpjs.io';
const globalRegionUrl = 'https://api.fpjs.io/';

type QueryStringParameters = VisitorHistoryFilter & {
  api_key?: string;
};

export function getVisitorsUrl(
  region: Region,
  visitorId: string,
  filter?: VisitorHistoryFilter,
  apiKey?: string
): string {
  const queryStringParameters: QueryStringParameters = filter ?? {};
  if (apiKey) {
    queryStringParameters.api_key = apiKey;
  }

  const serverApiPath = getVisitorsPath(region, visitorId);
  const queryString = queryStringParameters ? querystring.stringify(queryStringParameters) : '';

  if (queryString === '') {
    return serverApiPath;
  }
  return `${serverApiPath}?${queryString}`;
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
