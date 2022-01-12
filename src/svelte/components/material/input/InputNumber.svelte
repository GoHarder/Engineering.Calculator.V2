<script>
   import { getContext, onMount, onDestroy } from 'svelte';
   import { MDCTextField } from '@material/textfield';
   import { classList, filterProps, randomId } from '../../lib';

   import { round } from 'lib/math.mjs';

   // Components
   import Icon from '../common/Icon.svelte';

   // Stores
   // Properties
   export let calc = undefined;
   export let fullWidth = undefined;
   export let invalid = undefined;
   export let label = '';
   export let link = undefined;
   export let metric = false;
   export let override = true;
   export let readonly = undefined;
   export let suffix = '';
   export let type = undefined;
   export let value = undefined;

   // Methods
   // Constants
   const id = `input-${randomId()}`;

   const types = {
      _default: { iSuffix: suffix, mSuffix: '', mConvert: 0, mround: 1, toValue: (x) => x, toDisplay: (x) => x },
      angle: { iSuffix: '°', mSuffix: '', mConvert: 0, mround: 1, toValue: (x) => x, toDisplay: (x) => x },
      area: { iSuffix: 'ft²', mSuffix: 'm²', mConvert: 0.00064516, mRound: 4, toValue: (x) => round(x * 144, 6), toDisplay: (x) => round(x / 144, 2) },
      pressure: { iSuffix: 'lb/ft²', mSuffix: 'kg/m²', mConvert: 4.88242764, mRound: 4, toValue: (x) => round(x / 144, 6), toDisplay: (x) => round(x * 144, 2) },
      speed: { iSuffix: 'ft/min', mSuffix: 'm/sec', mConvert: 0.00508, mRound: 4, toValue: (x) => x, toDisplay: (x) => x },
      torque: { iSuffix: 'lb/ft', mSuffix: 'kg/m', mConvert: 1.48816, mround: 4, toValue: (x) => round(x / 12, 4), toDisplay: (x) => round(x * 12, 4) },
      weight: { iSuffix: 'lb', mSuffix: 'kg', mConvert: 0.453592, mRound: 1, toValue: (x) => x, toDisplay: (x) => x },
   };

   const { iSuffix, mSuffix, mConvert, mRound, toValue, toDisplay } = types[type] || types._default;

   const getFocused = getContext('getFocused');

   // Variables
   let displayValue = 0;
   let focused = false;
   let labelEle;
   let TextField;
   let metricValue = 0;
   let useNativeValidation = true;

   // Subscriptions
   // Reactive Rules
   $: labelClass = classList([
      $$props.class,
      'mdc-text-field mdc-text-field--filled',
      value ? 'mdc-text-field--label-floating' : '',
      'mdc-text-field--fullwidth',
      calc !== undefined ? 'mdc-text-field--with-leading-icon' : '',
      link ? 'mdc-text-field--with-trailing-icon' : '',
      readonly ? 'mdc-text-field--read-only' : '',
   ]);

   $: spanClass = classList(['mdc-floating-label', value ? 'mdc-floating-label--float-above' : '']);

   $: props = filterProps($$props, ['calc', 'fullWidth', 'invalid', 'label', 'link', 'metric', 'override', 'suffix', 'type', 'value']);

   $: if (!override && calc !== undefined) value = calc;

   $: if (value) {
      displayValue = toDisplay(value);
      metricValue = round(value * mConvert, mRound);
   }

   $: if (TextField) {
      if (useNativeValidation) {
         invalid = !TextField.valid;
      } else {
         TextField.valid = !invalid;
      }
   }

   $: if (link) readonly = true;

   $: if (getFocused) getFocused(focused);

   // Events
   const onBlur = () => (focused = false);

   const onChange = (event) => {
      override = calc !== event.target.value;
      value = toValue(parseFloat(event.target.value) || 0);
   };

   const onFocus = (event) => {
      focused = true;
      event.target.select();
   };

   const onLink = () => history.pushState({ path: link }, '');

   const onReset = () => (override = false);

   // Lifecycle
   onMount(() => {
      TextField = new MDCTextField(labelEle);

      if (value === undefined) value = 0;
      override = calc !== value;

      if (invalid !== undefined) {
         useNativeValidation = false;
      }

      if (readonly) {
         const input = labelEle.querySelector('input');
         input.tabIndex = -1;

         TextField.foundation.autoCompleteFocus();

         setTimeout(() => {
            TextField.foundation.deactivateFocus();
         }, 0);
      }

      TextField.useNativeValidation = useNativeValidation;
   });

   onDestroy(() => {
      TextField.destroy();
   });
</script>

<div class="input" class:metric class:full-width={fullWidth}>
   <label bind:this={labelEle} class={labelClass}>
      <span class="mdc-text-field__ripple" />

      <span class={spanClass} {id}>{label}</span>

      {#if calc !== undefined}
         {#if override}
            <Icon on:click={onReset} class="material-icons mdc-text-field__icon mdc-text-field__icon--leading" tabindex="0" role="button" toolTip="Reset To Default">
               edit_off
            </Icon>
         {:else}
            <Icon class="material-icons mdc-text-field__icon mdc-text-field__icon--leading">edit</Icon>
         {/if}
      {/if}

      <input value={displayValue} type="number" on:blur={onBlur} on:change={onChange} on:focus={onFocus} {...props} class="mdc-text-field__input" aria-labelledby={id} />

      {#if iSuffix}
         <span class="mdc-text-field__affix mdc-text-field__affix--suffix">{iSuffix}</span>
      {/if}

      {#if link}
         <Icon on:click={onLink} class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" role="button" tabindex="0" toolTip={link.match(/\w+$/)[0]}>
            link
         </Icon>
      {/if}

      <span class="mdc-line-ripple" />
   </label>

   <slot name="helperText" />

   {#if metric}
      <span class="metric-value">
         {#if metricValue}
            ({metricValue} {mSuffix})
         {/if}
      </span>
   {/if}

   {#if $$slots.datalist}
      <slot name="datalist" {focused} {onChange} />
   {/if}
</div>

<style>
</style>
