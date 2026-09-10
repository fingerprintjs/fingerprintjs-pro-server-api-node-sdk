import { ExtractQueryParams, Region } from './types'
import { version } from '../package.json'
import { paths } from './generatedApiTypes'

const euRegionUrl = 'https://eu.api.fpjs.io/'
const apRegionUrl = 'https://ap.api.fpjs.io/'
const globalRegionUrl = 'https://api.fpjs.io/'

type QueryStringScalar = string | number | boolean | null | undefined

type QueryStringParameters = Record<string, QueryStringScalar | string[]> & {
  api_key?: string
  ii: string
}

export function getIntegrationInfo() {
  return `fingerprint-pro-server-node-sdk/${version}`
}

function isEmptyValue(value: any): boolean {
  return value === undefined || value === null
}

function serializeQueryStringParams(params: QueryStringParameters): string {
  const entries: [string, string][] = []

  for (const [key, value] of Object.entries(params)) {
    // Use the helper for the main value
    if (isEmptyValue(value)) {
      continue
    }

    if (Array.isArray(value)) {
      for (const v of value) {
        // Also use the helper for each item in the array
        if (isEmptyValue(v)) {
          continue
        }
        entries.push([`${key}[]`, String(v)])
      }
    } else {
      entries.push([key, String(value)])
    }
  }

  if (!entries.length) {
    return ''
  }

  const urlSearchParams = new URLSearchParams(entries)

  return urlSearchParams.toString()
}

/**
 * Confines a value to a single URL path segment. `.` is deliberately left unencoded because
 * the Server API does not decode path parameters, and valid parameter values can contain dots.
 *
 * A value of `.` or `..` is rejected: `new URL()` drops such a segment even when the dots are
 * encoded, so it cannot be expressed. See https://url.spec.whatwg.org/#double-dot-path-segment
 */
function encodePathParam(placeholder: string, value: unknown): string {
  // Coerce before comparing, because an untyped caller can pass something that is not a string
  // but stringifies to one. Both conversions throw on values only such a caller could pass:
  // `String` when the value has no primitive representation, `encodeURIComponent` on a lone
  // surrogate. Neither should escape as its own error type.
  let param: string
  let encoded: string
  try {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string -- runtime validation
    param = String(value ?? '')
    encoded = encodeURIComponent(param)
  } catch (cause) {
    throw new TypeError(`Invalid path parameter for ${placeholder}`, { cause })
  }

  if (param === '') {
    throw new TypeError(`Missing path parameter for ${placeholder}`)
  }

  if (param === '.' || param === '..') {
    throw new TypeError(`Invalid path parameter for ${placeholder}: ${param}`)
  }

  return encoded
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

/**
 * Extracts parameter placeholders into a literal union type.
 * For example `extractPathParams<'/users/{userId}/posts/{postId}'>` resolves to `"userId" | "postId"
 */
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
    ? { queryParams?: any } // No query params
    : {
        queryParams?: ExtractQueryParams<paths[Path][Method]> // Optional query params
      }

type GetRequestPathOptions<Path extends keyof paths, Method extends keyof paths[Path]> = {
  path: Path
  method: Method
  apiKey?: string
  region: Region
} & PathParams<Path> &
  QueryParams<Path, Method>

/**
 * Formats a URL for the FingerprintJS server API by replacing placeholders and
 * appending query string parameters.
 *
 * @internal
 *
 * @param {GetRequestPathOptions<Path, Method>} options
 * @param {Path} options.path - The path of the API endpoint
 * @param {string[]} [options.pathParams] - Path parameters to be replaced in the path
 * @param {string} [options.apiKey] - API key to be included in the query string
 * @param {QueryParams<Path, Method>["queryParams"]} [options.queryParams] - Query string
 *   parameters to be appended to the URL
 * @param {Region} options.region - The region of the API endpoint
 * @param {Method} options.method - The method of the API endpoint
 *
 * @returns {string} The formatted URL with parameters replaced and query string
 *   parameters appended
 */
export function getRequestPath<Path extends keyof paths, Method extends keyof paths[Path]>({
  path,
  pathParams,
  apiKey,
  queryParams,
  region,
  // method mention here so that it can be referenced in JSDoc
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  method: _,
}: GetRequestPathOptions<Path, Method>): string {
  // Replace each `{placeholder}` with its path parameter. The replacement is a function so
  // that `$&` and friends in a parameter are not read as replacement patterns.
  let index = 0
  const formattedPath: string = path.replace(/{(.*?)}/g, (_, placeholder: string) =>
    encodePathParam(placeholder, pathParams?.[index++])
  )

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

  if (url.pathname !== formattedPath) {
    throw new TypeError('Invalid path: path changed during normalization')
  }

  return url.toString()
}
