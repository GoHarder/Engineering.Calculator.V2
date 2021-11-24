<script>
   import { afterUpdate } from 'svelte';
   import { classList, filterProps } from '../../lib';

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
   $: props = filterProps($$props, ['class']);
   $: liClass = classList(['mdc-list-item mdc-deprecated-list-item', $$props.class, selected ? 'mdc-deprecated-list-item--selected' : '']);

   // Events
   // Lifecycle
   afterUpdate(() => {
      // const svgs = liEle.querySelectorAll('svg');

      let icons = liEle.querySelectorAll('svg');

      if (icons.length === 0) {
         icons = liEle.querySelectorAll('i');
      }

      if ($$slots.leadingIcon && icons.length > 0) {
         icons[0].classList.add('material-icons');
         icons[0].classList.add('mdc-deprecated-list-item__graphic');
      }

      if ($$slots.trailingIcon && icons.length > 0) {
         icons[icons.length - 1].classList.add('material-icons');
         icons[icons.length - 1].classList.add('mdc-deprecated-list-item__meta');
      }
   });
</script>

<li on:click bind:this={liEle} class={liClass} {...props}>
   <span class="mdc-deprecated-list-item__ripple" />
   <slot name="leadingIcon" />
   <span class="mdc-deprecated-list-item__text"><slot /></span>
   <slot name="trailingIcon" />
</li>

<style>
</style>
