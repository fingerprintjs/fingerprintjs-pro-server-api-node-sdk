import { ExtractQueryParams, Region, VisitorHistoryFilter } from './types'
import { version } from '../package.json'
import { paths } from './generatedApiTypes'

const euRegionUrl = 'https://eu.api.fpjs.io/'
const apRegionUrl = 'https://ap.api.fpjs.io/'
const globalRegionUrl = 'https://api.fpjs.io/'

type QueryStringParameters = Record<string, string | number> & {
  api_key?: string
  ii: string
}

export function getIntegrationInfo() {
  return `fingerprint-pro-server-node-sdk/${version}`
}

/**
 * @private
 * */
export function getEventUrl(requestId: string, region: Region, apiKey?: string) {
  const params: QueryStringParameters = {
    ii: getIntegrationInfo(),
  }

  if (apiKey) {
    params.api_key = apiKey
  }

  return `${getServerApiUrl(region)}events/${requestId}?${serializeQueryStringParams(params)}`
}

/**
 * @private
 * */
export function getDeleteVisitorDataUrl(region: Region, visitorId: string, apiKey?: string): string {
  const queryStringParameters: QueryStringParameters = {
    ii: getIntegrationInfo(),
  }

  if (apiKey) {
    queryStringParameters.api_key = apiKey
  }

  const serverApiPath = getVisitorsPath(region, visitorId)
  const queryString = serializeQueryStringParams(queryStringParameters)

  return `${serverApiPath}?${queryString}`
}

/**
 * @private
 * */
export function getVisitorsUrl(
  region: Region,
  visitorId: string,
  filter?: VisitorHistoryFilter,
  apiKey?: string
): string {
  const queryStringParameters: QueryStringParameters = {
    ...filter,
    ii: getIntegrationInfo(),
  }

  if (apiKey) {
    queryStringParameters.api_key = apiKey
  }

  const serverApiPath = getVisitorsPath(region, visitorId)
  const queryString = serializeQueryStringParams(queryStringParameters)

  return `${serverApiPath}?${queryString}`
}

function serializeQueryStringParams(params: QueryStringParameters): string {
  const urlSearchParams = new URLSearchParams(Object.entries(params) as Array<[string, string]>)

  return urlSearchParams.toString()
}

function getVisitorsPath(region: Region, visitorId: string): string {
  const serverApiUrl = getServerApiUrl(region)
  const serverApiPath = `${serverApiUrl}visitors/${visitorId}`
  return serverApiPath
}

function getServerApiUrl(region: Region): string {
  switch (region) {
    case Region.EU:
      return euRegionUrl
    case Region.AP:
      return apRegionUrl
    case Region.Global:
      return globalRegionUrl
    default:
      throw new Error('Unsupported region')
  }
}

type ExtractPathParams<T extends string> = T extends `${string}{${infer Param}}${infer Rest}`
  ? Param | ExtractPathParams<Rest>
  : never

type PathParams<Path extends keyof paths> =
  ExtractPathParams<Path> extends never
    ? { pathParams?: never }
    : {
        pathParams: ExtractPathParams<Path> extends never ? never : string[]
      }

type QueryParams<Path extends keyof paths, Method extends keyof paths[Path]> =
  ExtractQueryParams<paths[Path][Method]> extends never
    ? { queryParams?: never }
    : {
        queryParams?: ExtractQueryParams<paths[Path][Method]>
      }

// GetRequestPathOptions type definition
type GetRequestPathOptions<Path extends keyof paths, Method extends keyof paths[Path]> = {
  path: Path
  method: Method
  // Only passed if should be included in query string
  apiKey?: string
  region: Region
} & PathParams<Path> &
  QueryParams<Path, Method>

export function getRequestPath<Path extends keyof paths, Method extends keyof paths[Path]>({
  path,
  pathParams,
  apiKey,
  queryParams,
  region,
}: GetRequestPathOptions<Path, Method>): string {
  // Step 1: Extract the path parameters (placeholders) from the path
  const placeholders = Array.from(path.matchAll(/{(.*?)}/g)).map((match) => match[1])

  // Step 2: Replace the placeholders with provided pathParams
  let formattedPath: string = path
  placeholders.forEach((placeholder, index) => {
    if (pathParams && pathParams[index]) {
      formattedPath = formattedPath.replace(`{${placeholder}}`, pathParams[index])
    } else {
      throw new Error(`Missing path parameter for ${placeholder}`)
    }
  })

  const queryStringParameters: QueryStringParameters = {
    ...(queryParams ?? {}),
    ii: getIntegrationInfo(),
  }
  if (apiKey) {
    queryStringParameters.api_key = apiKey
  }

  const url = new URL(getServerApiUrl(region))
  url.pathname = formattedPath
  url.search = serializeQueryStringParams(queryStringParameters)

  // Return the formatted path with parameters replaced
  return url.toString()
}
