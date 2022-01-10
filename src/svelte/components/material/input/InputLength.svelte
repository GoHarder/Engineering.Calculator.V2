<script>
   import { getContext, onMount, onDestroy } from 'svelte';
   import { MDCTextField } from '@material/textfield';
   import { classList, filterProps, randomId } from '../../lib';

   import { floor, round } from 'lib/math.mjs';

   // Components
   import Icon from '../common/Icon.svelte';

   // Stores
   // Properties
   export let calc = undefined;
   export let fullWidth = undefined;
   export let label = '';
   export let link = undefined;
   export let readonly = undefined;
   export let metric = false;
   export let override = true;
   export let value = undefined;

   // Methods
   const updateValue = () => {
      value = round(feet * 12 + inches, 4);
      override = calc !== value;
   };

   // Constants
   const id = `input-length-${randomId()}`;

   // Variables
   let feet = 0;
   let focused = false;
   let focusedFt = false;
   let focusedIn = false;
   let inches = 0;
   let labelEle;
   let metricValue = 0;
   let TextField;

   // Subscriptions
   // Contexts
   const getFocused = getContext('InputImg')?.getFocused;

   // Reactive Rules
   $: labelClass = classList([
      $$props.class,
      'mdc-text-field mdc-text-field--filled',
      value !== undefined ? 'mdc-text-field--label-floating' : '',
      'mdc-text-field--fullwidth',
      calc !== undefined ? 'mdc-text-field--with-leading-icon' : '',
      link ? 'mdc-text-field--with-trailing-icon' : '',
      readonly ? 'mdc-text-field--read-only' : '',
   ]);

   $: spanClass = classList(['mdc-floating-label', value !== undefined ? 'mdc-floating-label--float-above' : '']);

   $: props = filterProps($$props, ['calc', 'fullWidth', 'label', 'link', 'metric', 'override', 'type', 'value', 'step']);

   $: if (!override && calc !== undefined) value = calc;

   $: if (value) {
      feet = floor(value / 12);
      inches = round(value % 12, 4);
      metricValue = round(value * 0.0254, 2);
   }

   $: if (link) readonly = true;

   $: focused = focusedFt || focusedIn;

   $: if (focused !== undefined) getFocused?.(focused);

   // Events
   const onBlur = (event) => {
      const { units } = event.target.dataset;

      setTimeout(() => {
         if (units === 'ft') focusedFt = false;
         if (units === 'in') focusedIn = false;
      }, 100);
   };

   const onChange = (event) => {
      const { dataset, value: eValue } = event.target;

      if (dataset?.units === 'ft') feet = parseFloat(eValue) || 0;
      if (dataset?.units === 'in') inches = parseFloat(eValue) || 0;
      if (dataset?.units === undefined) {
         value = parseFloat(eValue);
         return;
      }

      updateValue();
   };

   const onFocus = (event) => {
      const { target } = event;
      const { units } = target.dataset;

      target.select();

      if (units === 'ft') focusedFt = true;
      if (units === 'in') focusedIn = true;
   };

   const onLink = () => history.pushState({ path: link }, '');

   const onReset = () => (override = false);

   // Lifecycle
   onMount(() => {
      TextField = new MDCTextField(labelEle);

      if (value === undefined) value = 0;
      override = calc !== value;

      if (readonly) {
         const inputs = labelEle.querySelectorAll('input');

         inputs.forEach((input) => {
            input.tabIndex = -1;
         });
      }
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

      <input
         value={feet}
         type="number"
         on:blur={onBlur}
         on:change={onChange}
         on:focus={onFocus}
         {...props}
         data-units="ft"
         class="mdc-text-field__input"
         aria-labelledby={id}
         min="0"
      />

      <span class="mdc-text-field__affix mdc-text-field__affix--suffix">ft</span>

      <input
         value={inches}
         type="number"
         on:blur={onBlur}
         on:change={onChange}
         on:focus={onFocus}
         {...props}
         data-units="in"
         class="mdc-text-field__input"
         aria-labelledby={id}
         step="0.0001"
         min="0"
         max="12"
      />

      <span class="mdc-text-field__affix mdc-text-field__affix--suffix">in</span>

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
            ({metricValue} m)
         {/if}
      </span>
   {/if}

   {#if $$slots.datalist}
      <slot name="datalist" {focused} {onChange} />
   {/if}
</div>

<style>
</style>
