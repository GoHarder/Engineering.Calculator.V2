<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCRipple } from '@material/ripple';
   import { MDCIconButtonToggle } from '@material/icon-button';
   import { classList, filterProps } from '../../lib';

   // Components
   // Stores
   // Properties
   export let toggle = false;

   // Methods
   // Constants
   // Variables
   let buttonEle;
   let ButtonRipple;
   let ButtonToggle;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: buttonClass = classList(['mdc-icon-button material-icons', $$props.class]);

   $: props = filterProps($$props, ['class', 'toggle']);

   // Events
   // Lifecycle
   onMount(() => {
      ButtonRipple = new MDCRipple(buttonEle);

      if (toggle) ButtonToggle = new MDCIconButtonToggle(buttonEle);

      ButtonRipple.unbounded = true;
   });

   onDestroy(() => {
      ButtonRipple.destroy();
      if (toggle) ButtonToggle.destroy();
   });
</script>

<button bind:this={buttonEle} on:click class={buttonClass} {...props}>
   <div class="mdc-icon-button__ripple" />
   <slot />
</button>

<style lang="scss" global>
   @use "@material/icon-button/_icon-button";
   @include icon-button.core-styles;
</style>
