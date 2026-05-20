<script lang='ts'>
  import SvgIcon from '$lib/components/ui/SvgIcon.svelte'
  import { twcn } from '$lib/utils/cx'

  const currentYear = new Date().getFullYear()
</script>

<footer class='mt-4 h-footer w-full rounded-t-container bg-surface'>
  <div
    class={twcn(
      'mx-auto grid size-full max-w-container grid-cols-[1fr_auto] items-center px-container py-4',
      `
        max-sm:grid-cols-1 max-sm:grid-rows-[auto_auto] max-sm:justify-items-center max-sm:gap-5
        max-sm:px-container-sm
      `,
    )}
  >
    <p class='opacity-30 max-sm:row-start-2'>©{currentYear}, Sportico. All rights reserved.</p>
    <div class='flex items-center gap-5'>
      <a
        href='/privacy-policy'
        class='transition-opacity hover:opacity-70'
        data-sveltekit-preload-code='viewport'
      >
        Privacy Policy
      </a>
      <span class='h-4 w-px bg-separator' aria-hidden='true'></span>
      <div class='flex items-center gap-3 text-muted'>
        <span>Follow Us:</span>
        <a
          href='#'
          class='cursor-pointer opacity-70 transition-opacity hover:opacity-100'
          aria-label='TT'
        >
          <SvgIcon name='TikTok'></SvgIcon>
        </a>
        <a
          href='#'
          class='cursor-pointer opacity-70 transition-opacity hover:opacity-100'
          aria-label='IG'
        >
          <SvgIcon name='Instagram'></SvgIcon>
        </a>
        <a
          href='#'
          class='cursor-pointer opacity-70 transition-opacity hover:opacity-100'
          aria-label='YT'
        >
          <SvgIcon name='YouTube'></SvgIcon>
        </a>
      </div>
    </div>
  </div>
</footer>
