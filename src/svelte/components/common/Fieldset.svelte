<script>
   import { classList, filterProps } from '../lib';

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
   $: props = filterProps($$props, ['class', 'title']);
   $: fieldsetClass = classList([$$props.class]);

   // Events
   // Lifecycle
</script>

<fieldset {...props} class={fieldsetClass}>
   <legend>{title}</legend>
   <hr />
   <slot />
</fieldset>

<style lang="scss">
   @use 'src/scss/theme' as vantage;

   fieldset {
      @include vantage.fieldset;
      @include vantage.paper;
      @include vantage.fieldset-legend(vantage.$primary);
   }
</style>
