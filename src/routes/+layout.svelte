<script lang='ts'>
  import '../app.css'

  const { children } = $props()
</script>

<svelte:head>
  <link href='/favicon.svg' rel='icon' />
</svelte:head>

{@render children?.()}
