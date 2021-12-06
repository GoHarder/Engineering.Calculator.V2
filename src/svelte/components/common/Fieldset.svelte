<script>
   import { fade } from 'svelte/transition';

   // Components
   // Stores
   // Properties
   export let title = '';

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
</script>

<fieldset transition:fade>
   <legend>{title}</legend>
   <hr />
   <slot />
</fieldset>

<style lang="scss">
   @use 'src/scss/theme' as vantage;

   fieldset {
      @include vantage.fieldset;
   }
</style>
