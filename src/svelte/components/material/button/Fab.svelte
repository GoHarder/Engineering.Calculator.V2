<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCRipple } from '@material/ripple';

   import { randomId } from '../../lib';

   // Components
   import ToolTip from '../tool-tip/ToolTip.svelte';

   // Stores
   // Properties
   export let mini = false;
   export let toolTip = undefined;

   // Methods
   // Constants
   const id = `fab-${randomId()}`;

   // Variables
   let buttonEle;
   let Ripple;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
   onMount(() => {
      Ripple = new MDCRipple(buttonEle);

      let icon = buttonEle.querySelector('svg');

      if (!icon) icon = buttonEle.querySelector('i');

      if ($$slots.default && icon) {
         icon.classList.add('mdc-fab__icon');
      }
   });

   onDestroy(() => {
      Ripple.destroy();
   });
</script>

<button bind:this={buttonEle} on:click class="mdc-fab" class:mdc-fab--mini={mini} data-tooltip-id={id}>
   <div class="mdc-fab__ripple" />
   <slot />
</button>

{#if toolTip}
   <ToolTip {id}>{toolTip}</ToolTip>
{/if}

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/theme' with (
      $primary: vantage.$primary,
      $secondary: vantage.$primary
   );
   @use '@material/fab';

   @include fab.core-styles;
</style>
