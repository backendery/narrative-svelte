import { createQueryClient, setupQueryErrorHandler } from '$lib/query.client'

export const ssr = false

export function load() {
  const queryClient = createQueryClient()
  setupQueryErrorHandler(queryClient)

  return { queryClient }
}
