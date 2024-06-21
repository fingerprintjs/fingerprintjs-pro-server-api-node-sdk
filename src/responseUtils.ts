export function copyResponseJson(response: Response) {
  return response.clone().json()
}
