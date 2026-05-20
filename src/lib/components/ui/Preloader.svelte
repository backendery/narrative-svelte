<!--
  @component
  Centered spinning loader used as a loading fallback.

  @description Renders a full-screen overlay with a rotating spinner.
  Fixed positioning ensures it covers the entire viewport with z-50 stacking.
-->
<div class='fixed inset-0 z-50 flex items-center justify-center bg-primary'>
  <div class='size-6 animate-spin rounded-full border-3 border-accent border-t-primary'></div>
</div>
