<script lang='ts'>
  import BetItem from './BetItem.svelte'
  import CharacterStats from './CharacterStats.svelte'

  import type { Character } from '$lib/types/character.types'

  interface Props {
    /** Full character data object with avatar, name, stats, and bets. */
    character: Character
    /** Called when the user clicks the Follow button inside CharacterStats. */
    onFollow?: () => void
  }

  const { character, onFollow }: Props = $props()
</script>

<!--
  @component
  Displays a complete character card with statistics and recent bets.

  @description Renders a rounded dark surface container composing CharacterStats
  and a BetItem list for the recent bets feed. Owns no local state.

  @param character {Character} Full character data from the API.
  @param onFollow {() => void} Optional selection handler.
-->
<section class='bg-surface flex w-full flex-col gap-5 rounded-md p-5'>
  <CharacterStats
    name={character.name}
    avatarUrl={character.avatarUrl}
    stats={character.stats}
    {onFollow}
  />
  <div class='flex flex-col gap-1'>
    {#each character.bets as bet (bet.id)}
      <BetItem {bet} />
    {/each}
  </div>
</section>
