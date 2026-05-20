import { QueryClient } from '@tanstack/svelte-query'

import { browser } from '$app/environment'
import { ApiError } from '$lib/api/http.client'
import { captureToSentry } from '$lib/sentry/sentry'

const DEFAULT_QUERY_STALE_TIME = 1000 * 60 * 5

const MAX_QUERY_RETRIES = 3
const MIN_QUERY_RETRIES = 1

const HTTP_STATUS = {
  CLIENT_ERROR_MIN: 400,
  CLIENT_ERROR_MAX: 499,
} as const

/**
 * Returns true if the error is a client-side HTTP error (4xx).
 * These are permanent failures — retrying won't change the outcome.
 *
 * @param error {unknown} Error raised by a query or mutation.
 * @returns {boolean} `true` when the failure is a non-retryable client error.
 */
function isClientError(error: unknown): boolean {
  return (
    error instanceof ApiError
    && error.status >= HTTP_STATUS.CLIENT_ERROR_MIN
    && error.status <= HTTP_STATUS.CLIENT_ERROR_MAX
  )
}

/**
 * Creates a new TanStack Query client configured for the application lifecycle.
 *
 * @description Called once per SSR request (or once for the SPA). Applies shared
 * retry, refetch, and production error-reporting defaults for all queries and mutations.
 * @returns {QueryClient} A fresh TanStack Query client instance.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_QUERY_STALE_TIME,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // IMPORTANT: If we're on the server (SSR) — NO retries!
          // This will prevent the page from freezing for 5 seconds while loading
          if (!browser) {
            return false
          }

          // If it's a 4xx error (e.g., 401 Unauthorized or 404 Not Found)
          // There's no point in retrying the request; it will fail anyway
          if (isClientError(error)) {
            return false
          }

          // For all other cases (server error 5xx or network connection lost
          // resulting in a TypeError)
          // We retry (but only in the browser, thanks to the check above)
          return failureCount < MAX_QUERY_RETRIES
        },
      },
      mutations: {
        retry: failureCount => failureCount < MIN_QUERY_RETRIES,
      },
    },
  })
}

/**
 * Attaches a global error handler for unhandled query/mutation errors.
 *
 * @description Hooks the query cache into the shared Sentry reporter so
 * cache-level failures are not missed by per-hook handlers.
 * @param client {QueryClient} The query client to attach handlers to.
 * @returns {void}
 */
export function setupQueryErrorHandler(client: QueryClient): void {
  client.getQueryCache().config.onError = (error, query) => {
    void captureToSentry(error, {
      category: 'query',
      queryKey: JSON.stringify(query.queryKey),
    })
  }

  client.getMutationCache().config.onError = (error, _variables, _context, mutation) => {
    void captureToSentry(error, {
      category: 'mutation',
      mutationKey: mutation.options.mutationKey
        ? JSON.stringify(mutation.options.mutationKey)
        : 'unnamed',
    })
  }
}
