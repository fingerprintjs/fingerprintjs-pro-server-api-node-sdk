import { Region } from "./types";

const euRegionUrl = "https://eu.api.fpjs.io/";
const globaRegionUrl = "https://api.fpjs.io/";

export function getVisitorsPath(region: Region, visitorId: string): string {
    const serverApiUrl = getServerApiUrl(region);
    const serverApiPath = `${serverApiUrl}visitors/${visitorId}`;
    return serverApiPath;
  }

  export function getServerApiUrl(region: Region): string {
    switch (region) {
      case Region.EU:
        return euRegionUrl;
      case Region.Global:
        return globaRegionUrl;
      default:
        throw new Error(`Unsupported region`);
    }
  }