<script lang='ts'>
  import { cva } from 'class-variance-authority'

  import { twcn } from '$lib/utils/cx'

  import SvgIcon from '../ui/SvgIcon.svelte'

  import type { CharacterStats as CharacterStatsType } from '$lib/types/character.types'

  const statItemStyles = cva(
    `
      border-dashed-separator flex items-center gap-1 border-r border-dashed pr-3
      max-lg:h-8 max-lg:w-full max-lg:justify-between max-lg:border-r-0 max-lg:border-b max-lg:pr-0
    `,
    {
      variants: {
        isFirst: {
          true: 'max-lg:border-t',
        },
      },
    },
  )

  interface Props {
    /** Character avatar image URL. */
    avatarUrl: string
    /** Character display name. */
    name: string
    /** Aggregated performance metrics. */
    stats: CharacterStatsType
    /** Called when the user clicks the Follow button. */
    onFollow?: () => void
  }

  const { avatarUrl, name, stats, onFollow }: Props = $props()

  /* biome-ignore format: keep alignment */
  const formattedYield = $derived(stats.yield >= 0 ? `+ ${stats.yield}%` : `${stats.yield}%`)
  /* biome-ignore format: keep alignment */
  const formattedProfit = $derived(
    stats.profit >= 0 ? `+ $${stats.profit}` : `- $${Math.abs(stats.profit)}`,
  )
</script>

<!--
  @component
  Displays a character's avatar, name, and aggregated statistics with a Follow action button.

  @description Renders performance metrics in a responsive grid layout.
  - Large screen: three-column grid (avatar + name | stats | Follow button).
  - Small screen (≤1024px): collapses to vertical layout.

  @param avatarUrl {string} Character avatar image URL.
  @param name {string} Character display name.
  @param stats {CharacterStatsType} Aggregated performance metrics.
  @param onFollow {() => void} Optional callback when Follow button is clicked.
-->
<div
  class={twcn(
    'grid grid-cols-[auto_1fr_auto] items-center gap-x-5',
    'max-lg:grid-cols-[auto_auto] max-lg:grid-rows-[auto_auto] max-lg:gap-y-5',
  )}
>
  <!-- Avatar + name -->
  <div class='flex items-center gap-3'>
    <div class='size-15 overflow-hidden rounded-full'>
      <img src={avatarUrl} class='min-h-full min-w-full object-cover' alt={name} />
    </div>
    <span>{name}</span>
  </div>

  <!-- Stats cells -->
  <div
    class={twcn(
      'flex items-stretch justify-end gap-3',
      `
        max-lg:col-span-2 max-lg:row-start-2 max-lg:w-full max-lg:flex-col max-lg:justify-start
        max-lg:gap-0
      `,
    )}
  >
    <!-- Last Bets -->
    <div class={statItemStyles({ isFirst: true })}>
      <span class='font-light opacity-30'>Last Bets:</span>
      <div class='flex items-center gap-0.5'>
        {#each stats.lastBets as result, i (i)}
          <SvgIcon name={result === 'Won' ? 'Won' : 'Lost'} />
        {/each}
      </div>
    </div>

    <!-- Bets Placed -->
    <div class={statItemStyles({})}>
      <span class='font-light opacity-30'>Bet Placed:</span>
      <span class='inline-flex items-center'>{stats.betsPlaced}</span>
    </div>

    <!-- Avg Odds -->
    <div class={statItemStyles({})}>
      <span class='font-light opacity-30'>Avg. Odds:</span>
      <span class='inline-flex items-center'>{stats.avgOdds.toFixed(1)}</span>
    </div>

    <!-- Yield -->
    <div class={statItemStyles({})}>
      <span class='font-light opacity-30'>Yield:</span>
      <span class='text-accent inline-flex items-center'>{formattedYield}</span>
    </div>

    <!-- Profit -->
    <div class={statItemStyles({})}>
      <span class='font-light opacity-30'>Profit:</span>
      <span class='text-accent inline-flex items-center'>{formattedProfit}</span>
    </div>
  </div>

  <!-- Follow button -->
  <button
    type='button'
    class={twcn(
      'bg-accent text-primary h-10 cursor-pointer rounded-lg border-none px-5 transition-opacity',
      'hover:opacity-80',
    )}
    onclick={onFollow}
  >
    Follow
  </button>
</div>
