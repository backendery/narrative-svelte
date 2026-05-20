<script lang='ts'>
  import SvgIcon from '$lib/components/ui/SvgIcon.svelte'
  import { twcn } from '$lib/utils/cx'
</script>

<header class='bg-surface mb-4 h-header w-full rounded-b-container'>
  <div
    class={twcn(
      'mx-auto flex size-full max-w-container items-center justify-between px-container py-4',
      'max-sm:px-container-sm',
    )}
  >
    <SvgIcon name='Logo' class='h-auto' />
    <nav class='flex items-center gap-6 font-bold max-sm:hidden'>
      <a
        href='/about-us'
        class='opacity-70 transition-opacity duration-120 ease-linear hover:opacity-100'
        data-sveltekit-preload-code='viewport'>About Us</a
      >
      <a
        href='/contacts'
        class='opacity-70 transition-opacity duration-120 ease-linear hover:opacity-100'
        data-sveltekit-preload-code='viewport'>Contacts</a
      >
      <span class='bg-separator h-4 w-px' aria-hidden='true'></span>
      <SvgIcon
        name='Preferences'
        class={twcn(
          'cursor-pointer',
          'opacity-70 transition-opacity duration-120 ease-linear hover:opacity-100',
        )}
      />
    </nav>
    <SvgIcon name='Burger' class='hidden cursor-pointer max-sm:inline' />
  </div>
</header>
