<script>
   import { getContext, onMount } from 'svelte';

   import { classList } from '../../lib';

   // Components
   // Stores
   // Properties
   export let disabled = false;
   export let selected = false;
   export let value;

   // Methods
   // Constants
   // Variables
   const getValue = getContext('Select')?.getValue;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: liClass = classList(['mdc-deprecated-list-item', selected ? 'mdc-deprecated-list-item--selected' : '', disabled ? 'mdc-deprecated-list-item--disabled' : '']);

   // Events
   // Lifecycle
   onMount(() => {
      if (getValue) getValue(value);
   });
</script>

<li class={liClass} aria-selected={selected} aria-disabled={disabled} data-value={value} role="option">
   <span class="mdc-deprecated-list-item__ripple" />
   <span class="mdc-deprecated-list-item__text"><slot /></span>
</li>

<style>
</style>
