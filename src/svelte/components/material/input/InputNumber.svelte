<script>
   import { onMount, onDestroy } from 'svelte';
   import { MDCTextField } from '@material/textfield';
   import { classList, filterProps, randomId } from '../../lib';

   import { round } from 'lib/math.mjs';

   // Components
   import Icon from '../common/Icon.svelte';

   // Stores
   // Properties
   export let calc = undefined;
   export let disabled = undefined;
   export let display = false;
   export let fullWidth = undefined;
   export let label = '';
   export let link = undefined;
   export let metric = false;
   export let override = true;
   export let type = undefined;
   export let value = undefined;

   // Methods
   // Constants
   const id = `input-${randomId()}`;

   const types = {
      _default: { suffix: '', mSuffix: '', mConvert: 0, iConvert: 1, mRound: 1, iRound: 1 },
      area: { suffix: 'ft²', mSuffix: 'm²', mConvert: 0.00064516, iConvert: 144, mRound: 4, iRound: 1 },
      speed: { suffix: 'ft/min', mSuffix: 'm/sec', mConvert: 0.00508, iConvert: 1, mRound: 4, iRound: 1 },
      weight: { suffix: 'lb', mSuffix: 'kg', mConvert: 0.453592, iConvert: 1, mRound: 1, iRound: 1 },
   };

   const { suffix, mSuffix, mConvert, iConvert, mRound, iRound } = types[type] || types._default;

   // Variables
   let _value = 0;
   let labelEle;
   let TextField;
   let metricValue = 0;

   // Subscriptions
   // Reactive Rules
   $: labelClass = classList([
      'mdc-text-field mdc-text-field--filled',
      value ? 'mdc-text-field--label-floating' : '',
      // 'mdc-text-field--fullwidth',
      calc !== undefined ? 'mdc-text-field--with-leading-icon' : '',
      link ? 'mdc-text-field--with-trailing-icon' : '',
      display ? 'mdc-text-field--display' : '',
      $$props.class,
   ]);

   $: spanClass = classList(['mdc-floating-label', value ? 'mdc-floating-label--float-above' : '']);

   $: props = filterProps($$props, ['calc', 'disabled', 'display', 'fullWidth', 'gridArea', 'label', 'link', 'metric', 'override', 'type', 'value']);

   $: if (!override && calc !== undefined) value = calc;

   $: if (value) {
      _value = round(value * (1 / iConvert), iRound);
      metricValue = round(value * mConvert, mRound);
   }

   $: if (display) disabled = true;

   // Events
   const onChange = (event) => {
      override = calc !== event.target.value;

      console.log(iConvert);

      value = round((parseFloat(event.target.value) || 0) * iConvert, iRound);
      metricValue = round(value * mConvert, mRound);
   };

   const onFocus = (event) => event.target.select();

   const onLink = () => history.pushState({ path: link }, '');

   const onReset = () => (override = false);

   // Lifecycle
   onMount(() => {
      TextField = new MDCTextField(labelEle);

      if (value === undefined) value = '';
      if (calc !== undefined) value = calc;
      metricValue = round(value * mConvert, mRound);
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

      <input value={_value} {disabled} type="number" on:change={onChange} on:focus={onFocus} {...props} class="mdc-text-field__input" aria-labelledby={id} />

      {#if suffix}
         <span class="mdc-text-field__affix mdc-text-field__affix--suffix">{suffix}</span>
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
</div>

<style>
</style>
