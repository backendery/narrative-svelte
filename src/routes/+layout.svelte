<script lang='ts'>
  import '../app.css'

  import { QueryClientProvider } from '@tanstack/svelte-query'

  const { data, children } = $props()
</script>

<svelte:head>
  <link href='/favicon.svg' rel='icon' />
</svelte:head>

<QueryClientProvider client={data.queryClient}>
  {@render children?.()}
</QueryClientProvider>
