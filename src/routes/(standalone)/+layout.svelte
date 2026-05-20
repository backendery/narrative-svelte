<script lang='ts'>
  interface Props {
    children: import('svelte').Snippet
  }

  const { children }: Props = $props()
</script>

<!--
  Minimal layout for standalone static pages (About, Contacts, Privacy Policy).
  No Header/Footer — just a constrained content column with a back-to-home link.
-->
<div class='bg-primary text-secondary flex min-h-screen flex-col p-6 font-sans'>
  <nav class='mx-auto mb-8 w-full max-w-3xl'>
    <a href='/' class='text-muted hover:text-secondary text-sm transition-colors' aria-label='Home' data-sveltekit-preload-code='viewport'>
      ← Back to Home
    </a>
  </nav>
  <main class='mx-auto flex w-full max-w-3xl flex-1 flex-col'>
    {@render children?.()}
  </main>
</div>
