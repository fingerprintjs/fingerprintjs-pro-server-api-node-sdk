export function getJson<T>(response: Response) {
  return response.clone().json() as Promise<T>
}
