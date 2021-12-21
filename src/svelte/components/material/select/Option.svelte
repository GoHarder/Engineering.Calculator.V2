<script>
   import { getContext, onMount } from 'svelte';

   import { classList } from '../../lib';

   // Components
   // Stores
   // Properties
   export let disabled = false;
   export let selected = false;
   export let value = undefined;

   // Methods
   // Constants
   // Variables
   let spanEle;

   // Subscriptions
   // Contexts
   const getValue = getContext('select.getValue');

   // Reactive Rules
   $: liClass = classList(['mdc-deprecated-list-item', selected ? 'mdc-deprecated-list-item--selected' : '', disabled ? 'mdc-deprecated-list-item--disabled' : '']);

   // Events
   // Lifecycle
   onMount(() => {
      if ($$slots.default && value === undefined) {
         value = spanEle.innerHTML;
      }

      getValue(value);
   });
</script>

<li class={liClass} aria-selected={selected} aria-disabled={disabled} data-value={value} role="option">
   <span class="mdc-deprecated-list-item__ripple" />
   <span bind:this={spanEle} class="mdc-deprecated-list-item__text"><slot /></span>
</li>

<style>
</style>
