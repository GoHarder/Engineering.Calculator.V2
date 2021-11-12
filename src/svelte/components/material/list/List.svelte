<script>
   import { onMount } from 'svelte';
   import { classList } from '../../lib';

   // Components
   // Stores
   // Properties
   export let dense = false;
   export let interactive = true;

   // Methods
   // Constants
   // Variables
   let ulEle;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: ulClass = classList(['mdc-deprecated-list', dense ? 'mdc-deprecated-list--dense' : '']);

   // Events
   // Lifecycle
   onMount(() => {
      if (!interactive) {
         const items = ulEle.querySelectorAll('.mdc-deprecated-list-item');

         items.forEach((item) => {
            item.classList.add('mdc-deprecated-list-item--non-interactive');
         });
      }
   });
</script>

<ul bind:this={ulEle} class={ulClass}>
   <slot />
</ul>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use "@material/theme" with (
      $primary: vantage.$secondary,
      $secondary: vantage.$primary,
   );
   @use "@material/list";
   @include list.deprecated-core-styles;

   .mdc-list-item {
      align-items: center;
   }

   .mdc-deprecated-list-item.mdc-deprecated-list-item--non-interactive {
      cursor: auto;
      &:hover {
         .mdc-deprecated-list-item__ripple {
            display: none;
         }
      }
   }
</style>
