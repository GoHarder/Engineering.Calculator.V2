<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCTooltip } from '@material/tooltip';
   import { filterProps } from '../../lib';

   // Components
   // Stores
   // Properties
   // Methods
   // Constants
   // Variables
   let divEle;
   let ToolTip;
   let siblingEle;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: props = filterProps($$props, ['class', 'role']);

   // Events
   // Lifecycle
   onMount(() => {
      const body = document.querySelector('body');

      siblingEle = divEle.previousElementSibling;

      body.appendChild(divEle);

      ToolTip = new MDCTooltip(divEle);
   });

   onDestroy(() => {
      ToolTip.destroy();

      siblingEle.after(divEle);
   });
</script>

<div bind:this={divEle} {...props} class="mdc-tooltip" role="tooltip" aria-hidden="true">
   <div class="mdc-tooltip__surface mdc-tooltip__surface-animation">
      <slot />
   </div>
</div>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/tooltip';
   @use '@material/tooltip/styles';

   .mdc-tooltip {
      @include tooltip.fill-color(vantage.$secondary);
   }
</style>
