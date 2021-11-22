<script>
   import { classList, filterProps } from '../../lib';

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
   $: props = filterProps($$props, ['class']);

   // Events
   // Lifecycle
</script>

<tr on:click class={trClass} {...props}><slot /></tr>

<style>
</style>
