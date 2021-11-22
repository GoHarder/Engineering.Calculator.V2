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
   $: trClass = classList(['mdc-data-table__row', $$props.class]);

   // Events
   // Lifecycle
</script>

<tr on:click class={trClass}><slot /></tr>

<style>
</style>
