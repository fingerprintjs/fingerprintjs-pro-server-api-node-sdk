export function getRetryAfter(response: Response) {
  const retryAfter = parseInt(response.headers.get('retry-after') ?? '')
  return Number.isNaN(retryAfter) ? 0 : retryAfter
}
