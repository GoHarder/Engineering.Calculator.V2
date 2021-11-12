<script>
   import { afterUpdate } from 'svelte';
   import { classList } from '../../lib';

   // Components
   // Stores
   // Properties
   export let selected = undefined;

   // Methods
   // Constants
   // Variables
   let liEle;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: liClass = classList(['mdc-list-item mdc-deprecated-list-item', selected ? 'mdc-deprecated-list-item--selected' : '']);

   // Events
   // Lifecycle
   afterUpdate(() => {
      const svgs = liEle.querySelectorAll('svg');

      if ($$slots.leadingIcon && svgs.length > 0) {
         svgs[0].classList.add('material-icons');
         svgs[0].classList.add('mdc-deprecated-list-item__graphic');
      }

      if ($$slots.trailingIcon && svgs.length > 0) {
         svgs[svgs.length - 1].classList.add('material-icons');
         svgs[svgs.length - 1].classList.add('mdc-deprecated-list-item__meta');
      }
   });
</script>

<li on:click bind:this={liEle} class={liClass} {...$$props}>
   <span class="mdc-deprecated-list-item__ripple" />
   <slot name="leadingIcon" />
   <span class="mdc-deprecated-list-item__text"><slot /></span>
   <slot name="trailingIcon" />
</li>

<style>
</style>
