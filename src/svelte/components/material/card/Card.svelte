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
   $: divClass = classList(['mdc-card', $$props.class]);

   // Events
   // Lifecycle
</script>

<div class={divClass}>
   <slot />
</div>

<style lang="scss" global>
   @use '@material/card';
   @include card.core-styles;

   .mdc-card {
      @include card.shape-radius(0px);
   }
</style>
