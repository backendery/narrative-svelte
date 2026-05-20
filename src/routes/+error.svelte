<script lang='ts'>
  import { page } from '$app/state'
</script>

<main class='bg-primary flex min-h-screen flex-col items-center justify-center p-8 text-center'>
  <div class='max-w-md space-y-6'>
    {#if page.status === 404}
      <p class='text-accent text-9xl font-bold'>404</p>
      <h1 class='text-secondary text-3xl font-bold'>Page Not Found</h1>
      <p class='text-secondary/80'>
        The page you're looking for doesn't exist or may have been moved.
      </p>
    {:else}
      <p class='text-accent text-9xl font-bold'>{page.status}</p>
      <h1 class='text-secondary text-3xl font-bold'>Something Went Wrong</h1>
      <p class='text-secondary/80'>
        {page.error?.message ?? 'An unexpected error occurred.'}
      </p>
    {/if}
    <a
      href='/'
      class='
        bg-accent
        hover:bg-accent/90
        text-white inline-block rounded-lg px-6 py-3 font-medium transition-colors
      '
      data-sveltekit-preload-code='hover'
    >
      Go to Home Page
    </a>
  </div>
</main>
