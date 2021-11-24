<script>
   import { MDCRipple } from '@material/ripple';
   import { onMount, onDestroy } from 'svelte';
   import { classList, filterProps } from '../../lib';

   // Components
   // Stores
   // Properties
   export let color = 'primary';
   export let unelevated = undefined;
   export let variant = 'text';

   // Methods
   // Constants
   const text = variant === 'text' ? 'mdc-button--text' : '';
   const outlined = variant === 'outlined' ? 'mdc-button--outlined' : '';
   const raised = unelevated ? 'mdc-button--unelevated' : 'mdc-button--raised';
   const contained = variant === 'contained' ? raised : '';

   // Variables
   let buttonEle;
   let ButtonRipple;

   // Subscriptions
   // Reactive Rules
   $: buttonClass = classList(['mdc-button', $$props.class, `mdc-button-${color}`, text, outlined, contained]);
   $: props = filterProps($$props, ['class']);

   // Events
   // Lifecycle
   onMount(() => {
      ButtonRipple = new MDCRipple(buttonEle);

      let icons = buttonEle.querySelectorAll('svg');

      if (icons.length === 0) {
         icons = buttonEle.querySelectorAll('i');
      }

      icons.forEach((icon) => {
         icon.classList.add('material-icons');
         icon.classList.add('mdc-button__icon');
      });
   });

   onDestroy(() => {
      ButtonRipple.destroy();
   });
</script>

<button on:click bind:this={buttonEle} class={buttonClass} {...props}>
   <span class="mdc-button__ripple" />
   <slot name="leadingIcon" />
   <span class="mdc-button__label"><slot /></span>
   <slot name="trailingIcon" />
</button>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/theme' with ($primary: vantage.$primary, $secondary: vantage.$secondary);
   @use '@material/button';
   @use '@material/button/styles';

   .mdc-button {
      text-transform: unset;
      @include button.horizontal-padding(12px);

      &.mdc-banner__primary-action {
         @include button.ink-color(vantage.$secondary);
      }

      &.mdc-button {
         &-primary.mdc-button--text {
            @include button.ink-color(vantage.$white);
         }

         &-secondary.mdc-button--text {
            @include button.ink-color(vantage.$secondary);
         }

         &-primary.mdc-button--outlined {
            @include button.ink-color(vantage.$secondary);
            @include button.outline-color(vantage.$primary);
         }

         &-secondary.mdc-button--outlined {
            @include button.ink-color(vantage.$secondary);
            @include button.outline-color(vantage.$secondary);
         }

         &-secondary {
            &.mdc-button--raised,
            &.mdc-button--unelevated {
               @include button.ink-color(vantage.$white);
               @include button.container-fill-color(vantage.$secondary);
            }
         }
      }
   }
</style>
