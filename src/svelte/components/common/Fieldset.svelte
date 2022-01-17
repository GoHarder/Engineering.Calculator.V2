<script>
   import { filterProps } from '../lib';

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
   $: props = filterProps($$props, ['title']);

   // Events
   // Lifecycle
</script>

<fieldset {...props}>
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
