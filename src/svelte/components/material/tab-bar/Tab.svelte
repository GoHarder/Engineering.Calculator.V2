<script>
   import { onMount } from 'svelte';
   import { classList, filterProps } from '../../lib';

   // Components
   // Stores
   // Properties
   export let active = false;
   export let component = undefined;
   export let stacked = false;
   export let minWidth = false;

   // Methods
   // Constants
   // Variables
   let spanEle;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: props = filterProps($$props, ['active', 'stacked', 'minWidth', 'class']);

   $: buttonClass = classList([
      $$props.class,
      'mdc-tab',
      active ? 'mdc-tab--active' : '',
      stacked && $$slots.icon ? 'mdc-tab--stacked' : '',
      minWidth ? 'mdc-tab--min-width' : '',
   ]);
   $: spanClass = classList(['mdc-tab-indicator', active ? 'mdc-tab-indicator--active' : '']);

   // Events
   // Lifecycle
   onMount(() => {
      if ($$slots.icon) {
         let icon = spanEle.querySelector('svg');

         if (!icon) {
            icon = spanEle.querySelector('i');
         }

         icon.classList.add('mdc-tab__icon');
         icon.classList.add('material-icons');
         icon.ariaHidden = true;
      }
   });
</script>

<button class={buttonClass} role="tab" aria-selected={active} data-component={component} {...props}>
   <span bind:this={spanEle} class="mdc-tab__content">
      {#if $$slots.icon}
         <slot name="icon" />
      {/if}

      <span class="mdc-tab__text-label"><slot /></span>
   </span>
   <span class={spanClass}>
      <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline" />
   </span>
   <span class="mdc-tab__ripple" />
</button>

<style>
</style>
