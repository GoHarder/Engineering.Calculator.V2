<script>
   import { setContext } from 'svelte';
   import { fly } from 'svelte/transition';
   import { filterProps } from '../lib';

   // Components
   // Stores
   // Properties
   export let alt = '';
   export let src = '';

   // Methods
   // Constants
   // Variables
   let focused = false;

   // Subscriptions
   // Contexts
   setContext('InputImg', {
      getFocused: (isFocused) => (focused = isFocused),
   });

   // Reactive Rules
   $: props = filterProps($$props, ['alt', 'src']);

   // Events
   // Lifecycle
</script>

<div>
   {#if focused}
      <img {src} {alt} {...props} transition:fly={{ y: 50, opacity: 0 }} />
   {/if}

   <slot />
</div>

<style lang="scss">
   @use 'src/scss/theme' as vantage;

   div {
      position: relative;

      img {
         @include vantage.paper;
         position: absolute;
         bottom: calc(100% + 19px);
         left: 0;
         border: 2px solid vantage.$primary;
         background-color: vantage.$white;
         z-index: 10;
      }
   }
</style>
