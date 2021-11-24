<script>
   import { onMount, onDestroy } from 'svelte';
   import { MDCTextField } from '@material/textfield';
   import { classList, filterProps, randomId } from '../../lib';

   // Components
   import Icon from '../common/Icon.svelte';

   // Stores
   // Properties
   export let fullWidth = undefined;
   export let label = '';
   export let link = undefined;
   export let prefix = undefined;
   export let suffix = undefined;
   export let value = undefined;

   // Methods
   // Constants
   const id = `input-${randomId()}`;

   // Variables
   let labelEle;
   let TextField;

   // Subscriptions
   // Reactive Rules

   $: labelClass = classList([
      $$props.class,
      'mdc-text-field mdc-text-field--filled',
      value ? 'mdc-text-field--label-floating' : '',
      fullWidth ? 'mdc-text-field--fullwidth' : '',
      $$slots.leadingIcon ? 'mdc-text-field--with-leading-icon' : '',
      $$slots.trailingIcon || link ? 'mdc-text-field--with-trailing-icon' : '',
   ]);

   $: spanClass = classList(['mdc-floating-label', value ? 'mdc-floating-label--float-above' : '']);

   $: props = filterProps($$props, ['fullWidth', 'label', 'value']);

   // Events
   // Lifecycle
   onMount(() => {
      TextField = new MDCTextField(labelEle);

      // Inject icon classes to make the icon component more flexible
      let icons = labelEle.querySelectorAll('svg');

      if (icons.length === 0) {
         icons = labelEle.querySelectorAll('i');
      }

      if ($$slots.leadingIcon && icons.length > 0) {
         icons[0].classList.add('material-icons');
         icons[0].classList.add('mdc-text-field__icon');
         icons[0].classList.add('mdc-text-field__icon--leading');
      }

      if ($$slots.trailingIcon && icons.length > 0) {
         icons[icons.length - 1].classList.add('material-icons');
         icons[icons.length - 1].classList.add('mdc-text-field__icon');
         icons[icons.length - 1].classList.add('mdc-text-field__icon--trailing');
      }
   });

   onDestroy(() => {
      TextField.destroy();
   });
</script>

<label bind:this={labelEle} class={labelClass}>
   <span class="mdc-text-field__ripple" />

   <span class={spanClass} {id}>{label}</span>

   <slot name="leadingIcon" />

   {#if prefix}<span class="mdc-text-field__affix mdc-text-field__affix--prefix">{prefix}</span>{/if}

   <input bind:value on:search {...props} class="mdc-text-field__input" aria-labelledby={id} />

   {#if suffix}<span class="mdc-text-field__affix mdc-text-field__affix--suffix">{suffix}</span>{/if}

   {#if link}
      <Icon class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" role="button" tabindex="0" toolTip={link}>link</Icon>
   {:else}
      <slot name="trailingIcon" />
   {/if}

   <span class="mdc-line-ripple" />
</label>

<slot name="helperText" />

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/theme' with ($primary: vantage.$primary, $secondary: vantage.$secondary);
   @use '@material/floating-label/mdc-floating-label';
   @use '@material/line-ripple/mdc-line-ripple';
   @use '@material/notched-outline/mdc-notched-outline';
   @use '@material/textfield';
   @include textfield.core-styles;

   .mdc-text-field {
      @include textfield.label-color(vantage.$secondary);
      @include textfield.shape-radius(0);

      &.mdc-text-field--fullwidth {
         width: 100%;
      }
   }

   .mdc-text-field__icon {
      box-sizing: content-box;
   }

   input[type='number'] {
      text-align: right;
      -moz-appearance: textfield;
   }
</style>
