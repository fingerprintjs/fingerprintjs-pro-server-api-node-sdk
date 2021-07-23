import { Region, VisitorHistoryFilter } from "./types";
import querystring from 'querystring'

const euRegionUrl = "https://eu.api.fpjs.io/";
const globaRegionUrl = "https://api.fpjs.io/";

export function getVisitorsUrl(region: Region, visitorId: string, filter?: VisitorHistoryFilter): string {
  const serverApiPath = getVisitorsPath(region, visitorId);
  const queryString = filter ? querystring.stringify(filter) : '';

  if (queryString === '') {
    return serverApiPath;
  } else {
    return `${serverApiPath}?${queryString}`;
  }
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
    case Region.Global:
      return globaRegionUrl;
    default:
      throw new Error(`Unsupported region`);
  }
}