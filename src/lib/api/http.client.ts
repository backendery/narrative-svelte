import { PUBLIC_BASE_URL_API } from '$env/static/public'
import { authToken } from '$lib/stores/auth.svelte'

// Supported HTTP methods for the API client
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

/**
 * Shape of the error body returned by the backend.
 *
 * @interface ApiErrorBody
 * @property {string} [message] - Primary error message from the backend.
 * @property {string | { msg: string }[]} [detail] - Detailed error information; either a string or array of error objects with `msg` property.
 * @property {unknown} - Arbitrary additional error fields from the backend.
 */
interface ApiErrorBody {
  message?: string
  detail?: string | { msg: string }[]
  [key: string]: unknown
}

/**
 * Options accepted by the internal request function.
 *
 * @interface RequestOptions
 * @property {unknown} [body] - Request body — serialised to JSON automatically.
 * @property {Record<string, string>} [headers] - Additional headers merged with defaults.
 * @property {AbortSignal} [signal] - Passed directly to `fetch` for abort support.
 */
interface RequestOptions {
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

/**
 * Typed error thrown by the API client for every non-2xx response.
 * Consumers can narrow on `status` to handle specific HTTP errors.
 *
 * @description Wraps backend failures in a typed error object that carries the
 * HTTP status and the parsed response payload.
 * @example
 * ```ts
 * try {
 *   await api.characters.list()
 * } catch (err) {
 *   if (err instanceof ApiError && err.status === 404) {
 *     // handle not found
 *   }
 * }
 * ```
 */
export class ApiError extends Error {
  // HTTP status code from the response
  readonly status: number
  // Human-readable message extracted from the response body
  override readonly message: string
  // Raw response body for detailed error handling
  readonly details: ApiErrorBody

  constructor(status: number, message: string, details: ApiErrorBody) {
    super(message)

    this.status = status
    this.message = message
    this.details = details

    this.name = 'ApiError'
  }
}

/**
 * Extracts a human-readable message from a backend error body.
 *
 * @description Normalises common backend error shapes into a single displayable
 * message.
 * @param body {ApiErrorBody} Backend error payload returned by the API.
 * @param fallback {string} Message used when the payload does not contain a
 * readable message.
 * @returns {string} A user-facing error message.
 */
function extractMessage(body: ApiErrorBody, fallback: string): string {
  if (typeof body.message === 'string') {
    return body.message
  }

  if (Array.isArray(body.detail)) {
    return body.detail.map(dtl => dtl.msg).join(', ')
  }

  if (typeof body.detail === 'string') {
    return body.detail
  }

  return fallback
}

/**
 * Builds default request headers.
 *
 * @description Merges JSON defaults with caller-provided headers and injects
 * auth when available.
 * @param extra {Record<string, string>} Additional headers.
 * @returns {HeadersInit} The final header set passed to `fetch`.
 */
function buildHeaders(extra: Record<string, string> = {}): HeadersInit {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...extra,
  }

  if (authToken.value != null && authToken.value.length > 0) {
    headers.Authorization = `Bearer ${authToken.value}`
  }

  return headers
}

/**
 * Base fetch wrapper used by all domain API modules.
 *
 * @description Serialises request bodies, parses successful JSON responses, and
 * converts backend error payloads into `ApiError` instances. Throws `ApiError`
 * on non-2xx responses and re-throws network errors as-is.
 * @template R Response type parameter.
 * @param method {HttpMethod} HTTP method.
 * @param path {string} Path relative to `PUBLIC_BASE_URL_API`, must start with `/`.
 * @param options {RequestOptions} Optional request options.
 * @param options.body {unknown} Request body — serialised to JSON automatically.
 * @param options.headers {Record<string, string>} Additional headers merged with defaults.
 * @param options.signal {AbortSignal} Passed directly to `fetch` for abort support.
 * @returns {Promise<R>} Parsed JSON response typed as `R`.
 */
async function request<R>(method: HttpMethod, path: string, { body, headers, signal }: RequestOptions = {}): Promise<R> {
  const response = await fetch(`${PUBLIC_BASE_URL_API}${path}`, {
    method,
    headers: buildHeaders(headers),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  })

  if (response.ok) {
    if (response.status === 204) {
      return undefined as R
    }

    return response.json() as Promise<R>
  }

  let errorBody: ApiErrorBody = {}
  try {
    errorBody = (await response.json()) as ApiErrorBody
  }
  catch {
    // Non-JSON error body (e.g. HTML gateway error pages) — ignore
  }

  throw new ApiError(response.status, extractMessage(errorBody, response.statusText), errorBody)
}

/**
 * Typed HTTP client used by all domain API modules in `src/lib/api/`.
 *
 * @description Provides the only supported fetch surface for the application.
 * Components and hooks must use this client instead of calling `fetch` directly.
 * @example
 * File: src/lib/api/characters.ts
 * ```ts
 * import { httpClient } from '$lib/http.client'
 * export const getCharacters = () => httpClient.get<Character[]>('/characters')
 * ```
 */
export const httpClient = {
  /**
   * Perform a GET request.
   * @param path {string} Resource path relative to `PUBLIC_BASE_URL_API`.
   * @param options {Omit<RequestOptions, 'body'>} Optional headers or abort signal.
   * @returns {Promise<R>} Parsed JSON response.
   */
  get: async <R>(path: string, options?: Omit<RequestOptions, 'body'>) => request<R>('GET', path, options),
  /**
   * Perform a POST request with a JSON body.
   * @param path {string} Resource path.
   * @param body {unknown} Payload serialised as JSON.
   * @param options {RequestOptions} Optional headers or abort signal.
   * @returns {Promise<R>} Parsed JSON response.
   */
  post: async <R>(path: string, body?: unknown, options?: RequestOptions) => request<R>('POST', path, { ...options, body }),
  /**
   * Perform a PATCH request with a JSON body.
   * @param path {string} Resource path.
   * @param body {unknown} Partial payload serialised as JSON.
   * @param options {RequestOptions} Optional headers or abort signal.
   * @returns {Promise<R>} Parsed JSON response.
   */
  patch: async <R>(path: string, body?: unknown, options?: RequestOptions) => request<R>('PATCH', path, { ...options, body }),
  /**
   * Perform a PUT request with a JSON body.
   * @param path {string} Resource path.
   * @param body {unknown} Payload serialised as JSON.
   * @param options {RequestOptions} Optional headers or abort signal.
   * @returns {Promise<R>} Parsed JSON response.
   */
  put: async <R>(path: string, body?: unknown, options?: RequestOptions) => request<R>('PUT', path, { ...options, body }),
  /**
   * Perform a DELETE request.
   * @param path {string} Resource path.
   * @param options {Omit<RequestOptions, 'body'>} Optional headers or abort signal.
   * @returns {Promise<R>} Parsed JSON response.
   */
  delete: async <R>(path: string, options?: Omit<RequestOptions, 'body'>) => request<R>('DELETE', path, options),
} as const
