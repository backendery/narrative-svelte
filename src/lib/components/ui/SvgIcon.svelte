<script lang='ts'>
  import BurgerIcon from '$lib/assets/icons/Burger.icon.svg?raw'
  import InstagramIcon from '$lib/assets/icons/Instagram.icon.svg?raw'
  import LogoIcon from '$lib/assets/icons/Logo.icon.svg?raw'
  import LostIcon from '$lib/assets/icons/Lost.icon.svg?raw'
  import PreferencesIcon from '$lib/assets/icons/Preferences.icon.svg?raw'
  import StopwatchIcon from '$lib/assets/icons/Stopwatch.icon.svg?raw'
  import TikTokIcon from '$lib/assets/icons/TikTok.icon.svg?raw'
  import WonIcon from '$lib/assets/icons/Won.icon.svg?raw'
  import YouTubeIcon from '$lib/assets/icons/YouTube.icon.svg?raw'

  // Registry of available SVG icon raw strings
  const icons = {
    Burger: BurgerIcon,
    Instagram: InstagramIcon,
    Logo: LogoIcon,
    Lost: LostIcon,
    Preferences: PreferencesIcon,
    Stopwatch: StopwatchIcon,
    TikTok: TikTokIcon,
    Won: WonIcon,
    YouTube: YouTubeIcon,
  } as const

  // Union type of all available SVG icon names.
  type SvgIconName = keyof typeof icons

  interface Props {
    // Required icon name from the available registry
    name: SvgIconName
    // Additional CSS classes forwarded to the SVG wrapper
    class?: string
    [key: string]: unknown
  }

  const { name, class: className, ...restProps }: Props = $props()

  const svg = $derived(icons[name])
</script>

{#if svg}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <span class={className} {...restProps}> {@html svg} </span>
{/if}
