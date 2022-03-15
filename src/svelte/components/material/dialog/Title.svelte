<script>
   import { classList } from '../../lib';

   // Components
   // Stores
   // Properties
   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: h2Class = classList(['mdc-dialog__title', $$props.class]);

   // Events
   // Lifecycle
</script>

<h2 class={h2Class}><slot /></h2>

<style global lang="scss">
   @use './src/scss/theme' as vantage;

   .mdc-dialog__title.error {
      color: vantage.$error;
   }
</style>
