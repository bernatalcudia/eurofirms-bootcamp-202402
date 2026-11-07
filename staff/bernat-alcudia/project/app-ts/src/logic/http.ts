import { errors } from "com"

export interface ApiRequestOptions {
  method?: string
  body?: unknown
  expectedStatus?: number
  parseResponse?: boolean
}

const expectedStatuses = {
  created: 201,
  ok: 200,
  noContent: 204,
} as const

function getError(message: string, name?: string): Error {
  if (name === "TypeError") return new TypeError(message)
  if (name === "RangeError") return new RangeError(message)
  if (name && Object.prototype.hasOwnProperty.call(errors, name)) {
    const ErrorConstructor = errors[name as keyof typeof errors]
    return new ErrorConstructor(message)
  }
  return new errors.SystemError(message)
}

async function readError(response: Response): Promise<never> {
  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new errors.SystemError(`Request failed with status ${response.status}`)
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
  ) {
    const errorName =
      "error" in body && typeof body.error === "string" ? body.error : undefined
    throw getError(body.message, errorName)
  }
  throw new errors.SystemError(`Request failed with status ${response.status}`)
}

export async function executeApiRequest<T>(
  url: string,
  options: ApiRequestOptions,
  authorization?: string,
): Promise<T> {
  const {
    method = "GET",
    body,
    expectedStatus = expectedStatuses.ok,
    parseResponse = false,
  } = options
  const headers: Record<string, string> = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (authorization) headers.Authorization = authorization

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
  } catch (error) {
    throw new errors.SystemError(
      error instanceof Error ? error.message : "Network request failed",
    )
  }

  if (response.status !== expectedStatus) return readError(response)
  if (response.status === 204 || (expectedStatus === expectedStatuses.created && !parseResponse)) {
    return undefined as T
  }
  try {
    return (await response.json()) as T
  } catch (error) {
    throw new errors.SystemError(
      error instanceof Error ? error.message : "Invalid server response",
    )
  }
}
