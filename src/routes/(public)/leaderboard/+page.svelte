<script lang='ts'>
  import CharacterCard from '$lib/components/features/CharacterCard.svelte'

  import type { Character } from '$lib/types/character.types'

  /** TODO: replace with TanStack Query once API is ready */
  const characters: Character[] = []
</script>

<!--
  Public leaderboard page — visible without (app) layout shell.
  TODO: wire up TanStack Query + API.
-->
<div class='bg-primary text-secondary flex min-h-screen flex-col p-6'>
  <div class='mx-auto w-full max-w-container'>
    <h1 class='mb-6 text-3xl font-bold'>Leaderboard</h1>
    {#if characters.length === 0}
      <p class='text-muted'>No characters yet.</p>
    {:else}
      <div class='flex flex-col gap-4'>
        {#each characters as character (character.id)}
          <CharacterCard {character} />
        {/each}
      </div>
    {/if}
  </div>
</div>
