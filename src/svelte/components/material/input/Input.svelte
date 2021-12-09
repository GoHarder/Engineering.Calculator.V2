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
   export let type = undefined;
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
      // 'mdc-text-field--fullwidth',
      $$slots.leadingIcon ? 'mdc-text-field--with-leading-icon' : '',
      $$slots.trailingIcon || link ? 'mdc-text-field--with-trailing-icon' : '',
   ]);

   $: spanClass = classList(['mdc-floating-label', value ? 'mdc-floating-label--float-above' : '']);

   $: props = filterProps($$props, ['fullWidth', 'grid', 'label', 'link', 'prefix', 'suffix', 'type', 'value']);

   // Events
   const onChange = (event) => {
      switch (type) {
         case 'number':
            value = parseFloat(event.target.value);
            break;
         default:
            value = event.target.value;
            break;
      }
   };

   const onLink = () => history.pushState({ path: link }, '');

   const onFocus = (event) => {
      event.target.select();
   };

   // Lifecycle
   onMount(() => {
      TextField = new MDCTextField(labelEle);

      if (value === undefined) value = '';

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

<div class="input" class:full-width={fullWidth}>
   <label bind:this={labelEle} class={labelClass}>
      <span class="mdc-text-field__ripple" />

      <span class={spanClass} {id}>{label}</span>

      <slot name="leadingIcon" />

      {#if prefix}
         <span class="mdc-text-field__affix mdc-text-field__affix--prefix">{prefix}</span>
      {/if}

      <input {value} {type} on:change={onChange} on:focus={onFocus} {...props} class="mdc-text-field__input" aria-labelledby={id} />

      {#if suffix}
         <span class="mdc-text-field__affix mdc-text-field__affix--suffix">{suffix}</span>
      {/if}

      {#if link}
         <Icon on:click={onLink} class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" role="button" tabindex="0" toolTip={link.match(/\w+$/)[0]}>
            link
         </Icon>
      {:else}
         <slot name="trailingIcon" />
      {/if}

      <span class="mdc-line-ripple" />
   </label>

   <slot name="helperText" />
</div>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/theme' with ($primary: vantage.$primary, $secondary: vantage.$secondary);
   @use '@material/floating-label/mdc-floating-label';
   @use '@material/line-ripple/mdc-line-ripple';
   @use '@material/notched-outline/mdc-notched-outline';
   @use '@material/textfield';
   @include textfield.core-styles;

   $metric-width: 100px;

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

   input::-webkit-outer-spin-button,
   input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
   }

   .mdc-text-field {
      grid-area: field;
   }

   .mdc-text-field.input-1 {
      grid-area: field-1;
   }

   .mdc-text-field.input-2 {
      grid-area: field-2;
   }

   .mdc-text-field-helper-line {
      grid-area: helper;
   }

   .metric-value {
      grid-area: metric;
      width: $metric-width;
      color: gray;
      font-size: 14px;
      margin-top: 24px;
   }

   .input {
      display: grid;
      grid-template: {
         columns: vantage.$input-width-2;
         rows: 56px 19px;
         areas: 'field' 'helper';
      }
      &.full-width {
         grid-template-columns: minmax(vantage.$input-width-2, 1fr);
      }

      &.metric {
         grid-template: {
            columns: vantage.$input-width-2 0.25em $metric-width;
            rows: 56px 19px;
            areas: 'field . metric' 'helper helper helper';
         }
         &.full-width {
            grid-template-columns: vantage.$input-width-2 0.25em $metric-width;
         }
      }
   }

   .input.length {
      grid-template: {
         columns: repeat(2, vantage.$input-width-1);
         rows: 56px 19px;
         areas: 'field-1 field-2' 'helper helper';
      }

      &.full-width {
         grid-template-columns: repeat(2, minmax(vantage.$input-width-1, 1fr));
      }

      &.metric {
         grid-template: {
            columns: repeat(2, vantage.$input-width-1) 0.25em $metric-width;
            rows: 56px 19px;
            areas: 'field-1 field-2 . metric' 'helper helper helper helper';
         }
         &.full-width {
            grid-template-columns: repeat(2, minmax(vantage.$input-width-1, 1fr)) 0.25em $metric-width;
         }
      }
   }
</style>
