<script>
   import { classList } from '../js/svelte';

   // Components
   // Stores
   // Properties
   export let disabled = false;
   export let selected = false;
   export let value;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: liClass = classList(['mdc-deprecated-list-item', selected ? 'mdc-deprecated-list-item--selected' : '', disabled ? 'mdc-deprecated-list-item--disabled' : '']);

   // Events
   // Lifecycle
</script>

<li class={liClass} aria-selected={selected} aria-disabled={disabled} data-value={value} role="option">
   <span class="mdc-deprecated-list-item__ripple" />
   <span class="mdc-deprecated-list-item__text"><slot /></span>
</li>

<style>
</style>
