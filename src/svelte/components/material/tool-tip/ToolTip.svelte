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

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: props = filterProps($$props, ['class', 'role']);

   // Events
   // Lifecycle
   onMount(() => {
      ToolTip = new MDCTooltip(divEle);

      const body = document.querySelector('body');

      body.appendChild(divEle);
   });

   onDestroy(() => {
      ToolTip.destroy();
   });
</script>

<div bind:this={divEle} {...props} class="mdc-tooltip" role="tooltip" aria-hidden="true">
   <div class="mdc-tooltip__surface mdc-tooltip__surface-animation">
      <slot />
   </div>
</div>

<style lang="scss" global>
   @use '@material/tooltip/styles';
</style>
