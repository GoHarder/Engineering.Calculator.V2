<script>
   import { classList } from '../../lib';

   // Components
   // Stores
   // Properties
   export let textProtection = false;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: ulClass = classList(['mdc-image-list', textProtection ? 'mdc-image-list--with-text-protection' : '', 'default-image-list', $$props.class]);

   // Events
   // Lifecycle
</script>

<ul class={ulClass}>
   <slot />
</ul>

<style lang="scss" global>
   @use '@material/image-list/mdc-image-list';
   @use '@material/image-list';

   .default-image-list {
      @include image-list.standard-columns(2);
   }
</style>
