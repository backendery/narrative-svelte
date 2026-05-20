import { browser } from '$app/environment'
import { createQueryClient, setupQueryErrorHandler } from '$lib/query.client'

import type { LayoutLoad } from './$types'

/**
 * Root layout loader — initializes TanStack Query client and sets up error handling.
 * Runs on all routes and provides the QueryClient instance to child pages via context.
 *
 * @returns Layout data containing the initialized `queryClient` instance.
 */
export const load: LayoutLoad = () => {
  const queryClient = createQueryClient()

  // Log errors only in the browser to avoid spamming `Sentry` with
  // server-side prefetch logs
  if (browser) {
    setupQueryErrorHandler(queryClient)
  }

  return { queryClient }
}
