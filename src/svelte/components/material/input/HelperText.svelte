<script>
   import { classList } from '../../lib';

   // Components
   // Stores
   // Properties
   export let persistent = false;
   export let validation = false;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: divClass = classList([
      'mdc-text-field-helper-text',
      persistent ? 'mdc-text-field-helper-text--persistent' : '',
      validation ? 'mdc-text-field-helper-text--validation-msg' : '',
   ]);

   // Events
   // Lifecycle
</script>

<div class="mdc-text-field-helper-line">
   <div class={divClass}>
      <slot />
   </div>
</div>

<style>
</style>
