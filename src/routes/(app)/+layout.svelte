<script lang='ts'>
  import Footer from '$lib/components/app/Footer.svelte'
  import Header from '$lib/components/app/Header.svelte'

  const { children } = $props()
</script>

<div class='flex min-h-screen flex-col bg-primary font-sans text-secondary'>
  <Header />
  <main class='
    mx-auto flex w-full max-w-container flex-1 flex-col px-container
    max-sm:px-container-sm
  '>
    {@render children?.()}
  </main>
  <Footer />
</div>
