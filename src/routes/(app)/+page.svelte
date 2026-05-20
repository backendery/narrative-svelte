<script lang='ts'>
  import { createQuery } from '@tanstack/svelte-query'

  import { httpClient } from '$lib/api/http.client'
  import CharacterCard from '$lib/components/features/CharacterCard.svelte'

  import type { Character } from '$lib/types/character.types'

  /**
   * TanStack Query is smart: it will recognize that the data for the keys ['characters','leaderboard']
   * has already been fetched from the server thanks to the prefetchQuery in `+page.ts`. It won't make an
   * unnecessary HTTP request in the browser, but will retrieve it directly from the cache!
   */
  const charactersQuery = createQuery(() => ({
    queryKey: ['characters', 'leaderboard'],
    queryFn: async () => httpClient.get<Character[]>('/characters?sort=profit'),
    staleTime: 24 * 60 * 60 * 1000,
  }))
</script>

<svelte:head>
  <title>Leaderboard | Sportico</title>
</svelte:head>

<div class='flex flex-col gap-6 py-6'>
  <h1 class='text-3xl font-bold'>Leaderboard</h1>

  {#if charactersQuery.isPending}
    <p class='text-lg text-muted'>Loading...</p>
  {:else if charactersQuery.isError}
    <p class='text-red-500'>Error: {charactersQuery.error?.message}</p>
  {:else if charactersQuery.data?.length === 0}
    <p class='text-muted'>No characters yet.</p>
  {:else if charactersQuery.data}
    <div class='flex flex-col gap-4'>
      {#each charactersQuery.data as character (character.id)}
        <CharacterCard {character} />
      {/each}
    </div>
  {/if}
</div>
