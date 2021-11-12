<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCLinearProgress } from '@material/linear-progress';

   // Parameteres
   export let buffer = undefined;
   export let indeterminate = undefined;
   export let progress = undefined;
   export let show = false;

   // Variables
   let divEle;
   let LinearProgress;

   // Reactive Variables
   $: if (LinearProgress && show === true) LinearProgress.open();
   $: if (LinearProgress && show === false) LinearProgress.close();
   $: if (LinearProgress && indeterminate !== undefined) LinearProgress.determinate = !indeterminate;
   $: if (LinearProgress && progress !== undefined) LinearProgress.progress = progress;
   $: if (LinearProgress && buffer !== undefined) LinearProgress.buffer = buffer;

   // Lifecycle
   onMount(() => {
      LinearProgress = new MDCLinearProgress(divEle);
   });

   onDestroy(() => {
      LinearProgress.destroy();
   });
</script>

<div bind:this={divEle} class="mdc-linear-progress" role="progressbar" aria-label="Progress Bar">
   <div class="mdc-linear-progress__buffer">
      <div class="mdc-linear-progress__buffer-bar" />
      <div class="mdc-linear-progress__buffer-dots" />
   </div>

   <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
      <span class="mdc-linear-progress__bar-inner" />
   </div>

   <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
      <span class="mdc-linear-progress__bar-inner" />
   </div>
</div>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use "@material/theme" with (
      $primary: vantage.$primary,
      $secondary: vantage.$secondary,
   );
   @use "@material/linear-progress";
   @include linear-progress.core-styles;
</style>
