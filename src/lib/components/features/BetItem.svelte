<script lang='ts'>
  import { format } from 'date-fns'

  import SvgIcon from '$lib/components/ui/SvgIcon.svelte'
  import { twcn } from '$lib/utils/cx'

  import type { Bet } from '$lib/types/character.types'

  /* The bet data object containing match, market, odds, and stake information */
  interface Props {
    bet: Bet
  }

  const { bet }: Props = $props()

  const time = $derived(format(new Date(bet.matchStartsAt), 'HH:mm'))
</script>

<!--
  @component
  Displays a single bet row inside an expert's bets feed.

  @description Shows match time, league/teams, market label, odds, and stake information.
  On small screen (≤720px) the layout stacks vertically and the market pill spans full width.

  @param bet {Bet} The bet data object.
-->
<div
  class={twcn(
    'bg-surface flex items-center justify-between rounded-xl p-2.5',
    'max-sm:flex-col max-sm:items-start max-sm:gap-2.5',
  )}
>
  <div class='flex h-full items-center gap-3'>
    <div
      class='
        bg-surface flex h-13 w-14 flex-col items-center justify-center gap-1.5 rounded-lg text-xs
        leading-none
      '
    >
      <SvgIcon name='Stopwatch' class='opacity-30' />
      <span class='opacity-30'>{time}</span>
    </div>
    <div class='leading-[1.2]'>
      <div class='text-xs opacity-30'>{bet.league}</div>
      <div>{bet.homeTeam}</div>
      <div>{bet.awayTeam}</div>
    </div>
  </div>
  <div
    class={twcn(
      'grid grid-cols-[auto_auto_auto] gap-1',
      'max-sm:w-full max-sm:grid-cols-[1fr_1fr]',
    )}
  >
    <div
      class={twcn(
        'bg-surface flex h-8 items-center justify-center rounded-lg px-3',
        'max-sm:col-span-2',
      )}
    >
      {bet.marketValue}
    </div>
    <div class='bg-surface flex h-8 items-center justify-center rounded-lg px-3'>
      {bet.odd}
    </div>
    <div
      class={twcn(
        'bg-accent-surface mr-2.5 flex h-8 items-center justify-center rounded-lg px-3',
        'max-sm:mr-0',
      )}
    >
      <span class='mr-1 opacity-30'>Stake:</span>
      <span>${bet.stake}</span>
    </div>
  </div>
</div>
