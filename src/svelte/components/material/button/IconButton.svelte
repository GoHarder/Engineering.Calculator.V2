<script>
   import { onDestroy, onMount } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCRipple } from '@material/ripple';
   import { MDCIconButtonToggle } from '@material/icon-button';
   import { classList, filterProps, forwardEvents, randomId } from '../../lib';

   // Components
   import ToolTip from '../tool-tip/ToolTip.svelte';

   // Stores
   // Properties
   export let on = false;
   export let toggle = false;
   export let toolTip = undefined;

   // Methods
   // Constants
   const id = `icon-button-${randomId()}`;
   const events = forwardEvents(get_current_component(), toggle ? ['MDCIconButtonToggle:change'] : '');

   // Variables
   let buttonEle;
   let ButtonRipple;
   let ButtonToggle;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: buttonClass = classList(['mdc-icon-button material-icons', $$props.class]);

   $: props = filterProps($$props, ['class', 'toggle']);

   $: if (ButtonToggle && on !== undefined) {
      ButtonToggle.on = on;
   }

   // Events
   const onChange = (event) => {
      on = event.detail.isOn;
   };

   // Lifecycle
   onMount(() => {
      ButtonRipple = new MDCRipple(buttonEle);

      if (toggle) ButtonToggle = new MDCIconButtonToggle(buttonEle);

      ButtonRipple.unbounded = true;

      let icon = buttonEle.querySelector('svg');

      if (!icon) {
         icon = buttonEle.querySelector('i');
      }

      if ($$slots.default && icon) {
         icon.classList.add('material-icons');
         icon.classList.add('mdc-icon-button__icon');
      }
   });

   onDestroy(() => {
      ButtonRipple.destroy();
      if (toggle) ButtonToggle.destroy();
   });
</script>

<button bind:this={buttonEle} use:events on:MDCIconButtonToggle:change={onChange} class={buttonClass} {...props} data-tooltip-id={id}>
   <div class="mdc-icon-button__ripple" />
   <slot />
</button>

{#if toolTip}
   <ToolTip {id}>{toolTip}</ToolTip>
{/if}

<style lang="scss" global>
   @use '@material/icon-button/_icon-button';
   @include icon-button.core-styles;
</style>
