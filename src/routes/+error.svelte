<script lang='ts'>
  import { page } from '$app/state'
</script>

<main class='flex min-h-screen flex-col items-center justify-center bg-primary p-8 text-center'>
  <div class='max-w-md space-y-6'>
    {#if page.status === 404}
      <p class='text-9xl font-bold text-accent'>404</p>
      <h1 class='text-3xl font-bold text-secondary'>Page Not Found</h1>
      <p class='text-secondary/80'>
        The page you're looking for doesn't exist or may have been moved.
      </p>
    {:else}
      <p class='text-9xl font-bold text-accent'>{page.status}</p>
      <h1 class='text-3xl font-bold text-secondary'>Something Went Wrong</h1>
      <p class='text-secondary/80'>
        {page.error?.message ?? 'An unexpected error occurred.'}
      </p>
    {/if}
    <a
      href='/'
      class='
        inline-block rounded-lg bg-accent px-6 py-3 font-medium text-white transition-colors
        hover:bg-accent/90
      '
      data-sveltekit-preload-code='hover'
    >
      Go to Home Page
    </a>
  </div>
</main>
