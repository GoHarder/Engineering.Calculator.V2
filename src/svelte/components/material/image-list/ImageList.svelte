<script>
   import { classList } from '../../lib';

   // Components
   // Stores
   // Properties
   export let textProtection = false;
   export let columns = 1;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: ulClass = classList(['mdc-image-list', textProtection ? 'mdc-image-list--with-text-protection' : '', `image-list-columns-${columns}`, $$props.class]);

   // Events
   // Lifecycle
</script>

<ul class={ulClass}>
   <slot />
</ul>

<style lang="scss" global>
   @use '@material/image-list/mdc-image-list';
   @use '@material/image-list';

   $options: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10;

   .image-list-columns {
      @each $option in $options {
         &-#{$option} {
            @include image-list.standard-columns($option);
         }
      }
   }
</style>
