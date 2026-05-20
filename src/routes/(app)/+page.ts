import { httpClient } from '$lib/api/http.client'

import type { Character } from '$lib/types/character.types'

import type { PageLoad } from './$types'

/**
 * Loads leaderboard data for the app home page.
 * Prefetches sorted characters (by profit) into TanStack Query cache.
 * Data is considered fresh for 24 hours.
 *
 * @param parent - Provides access to parent layout data (QueryClient).
 * @returns Empty object; data is cached and accessed via TanStack Query.
 */
export const load: PageLoad = async ({ parent }) => {
  // Retrieve the `queryClient` that we created in the root `+layout.ts` file
  // eslint-disable-next-line ts/no-unsafe-assignment, ts/no-unsafe-call
  const { queryClient } = await parent()

  // Preload the data!
  // If SSR is enabled, the server will make a request to FastAPI, wait for a
  // response, and embed it in the HTML
  // eslint-disable-next-line ts/no-unsafe-call, ts/no-unsafe-member-access
  await queryClient.prefetchQuery({
    queryKey: ['characters', 'leaderboard'],
    queryFn: async () => httpClient.get<Character[]>('/characters?sort=profit'),
    staleTime: 24 * 60 * 60 * 1000,
  })

  return {}
}
