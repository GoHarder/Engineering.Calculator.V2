<script>
   import { createEventDispatcher, onMount, onDestroy } from 'svelte';
   import { MDCTextField } from '@material/textfield';
   import { classList, filterProps, randomId } from '../../lib';

   // Components
   import Icon from '../common/Icon.svelte';

   // Stores
   // Properties
   export let fullWidth = undefined;
   export let label = 'Search';
   export let value = undefined;

   // Methods
   // Constants
   const id = `input-${randomId()}`;
   const dispatch = createEventDispatcher();

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
      'mdc-text-field--with-leading-icon',
   ]);

   $: spanClass = classList(['mdc-floating-label', value ? 'mdc-floating-label--float-above' : '']);

   $: props = filterProps($$props, ['fullWidth', 'label', 'type', 'value']);

   // Events
   const onChange = (event) => {
      value = event.target.value;
   };

   const onFocus = (event) => {
      event.target.select();
   };

   const onKeyDown = (event) => {
      if (event.keyCode === 13) {
         onSearch(event);
      }
   };

   const onSearch = (event) => {
      event.target.blur();
      dispatch('search');
   };

   // Lifecycle
   onMount(() => {
      TextField = new MDCTextField(labelEle);

      if (value === undefined) value = '';
   });

   onDestroy(() => {
      TextField.destroy();
   });
</script>

<svelte:window on:keydown={onKeyDown} />

<label bind:this={labelEle} class={labelClass}>
   <span class="mdc-text-field__ripple" />

   <span class={spanClass} {id}>{label}</span>

   <Icon on:click={onSearch} class="material-icons mdc-text-field__icon mdc-text-field__icon--leading" role="button" tabindex="0" toolTip="Search">search</Icon>

   <input {value} type="search" on:change={onChange} on:focus={onFocus} on:search={onSearch} {...props} class="mdc-text-field__input" aria-labelledby={id} />

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

   .input-number,
   .input-length {
      .mdc-text-field {
         grid-area: field;
      }

      .input-length-1 {
         grid-area: field-1;
      }

      .input-length-2 {
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
   }
   .input-number {
      width: 250px;
      display: grid;
      grid-template: {
         columns: 1fr;
         rows: 56px 19px;
         areas: 'field' 'helper';
      }

      &.metric {
         width: calc(250px + 0.5em + $metric-width);
         grid-template: {
            columns: 1fr 0.5em $metric-width;
            rows: 56px 19px;
            areas: 'field . metric' 'helper helper helper';
         }
      }
   }

   .input-length {
      width: 250px;
      display: grid;
      grid-template: {
         columns: 1fr 1fr;
         rows: 56px 19px;
         areas: 'field-1 field-2' 'helper helper';
      }

      &.metric {
         width: calc(250px + 0.5em + $metric-width);
         grid-template: {
            columns: 1fr 0.5em $metric-width;
            rows: 56px 19px;
            areas: 'field . metric' 'helper helper helper';
         }
      }
   }

   .input-number,
   .input-length {
      &.full-width {
         width: 100%;
      }
   }
</style>
