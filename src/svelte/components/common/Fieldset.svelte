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
   <div class="title">
      <legend>{title}</legend>
   </div>
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

   .title {
      display: flex;
      align-items: center;
      height: 36px;
   }
</style>
