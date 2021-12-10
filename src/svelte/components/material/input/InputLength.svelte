<script>
   import { onMount, onDestroy } from 'svelte';
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
      metricValue = round(value * 0.0254, 2);
   };

   // Constants
   const id = `input-${randomId()}`;

   // Variables
   let feet = 0;
   let inches = 0;
   let labelEle1;
   let labelEle2;
   let metricValue = 0;
   let TextField1;
   let TextField2;

   // Subscriptions
   // Reactive Rules
   $: labelClass1 = classList([
      $$props.class,
      'mdc-text-field mdc-text-field--filled',
      value ? 'mdc-text-field--label-floating' : '',
      calc !== undefined ? 'mdc-text-field--with-leading-icon' : '',
      readonly ? 'mdc-text-field--read-only' : '',
      'input-1',
   ]);

   $: labelClass2 = classList([
      $$props.class,
      'mdc-text-field mdc-text-field--filled',
      value ? 'mdc-text-field--label-floating' : '',
      link ? 'mdc-text-field--with-trailing-icon' : '',
      readonly ? 'mdc-text-field--read-only' : '',
      'input-2',
   ]);

   $: spanClass = classList(['mdc-floating-label', value ? 'mdc-floating-label--float-above' : '']);

   $: props = filterProps($$props, ['calc', 'fullWidth', 'label', 'link', 'metric', 'override', 'type', 'value', 'step']);

   $: if (!override && calc !== undefined) value = calc;

   $: if (value) {
      feet = floor(value / 12);
      inches = round(value % 12, 4);
   }

   // Events
   const onChange1 = (event) => {
      feet = parseFloat(event.target.value) || 0;
      updateValue();
   };

   const onChange2 = (event) => {
      inches = parseFloat(event.target.value) || 0;
      updateValue();
   };

   const onFocus = (event) => event.target.select();

   const onReset = () => (override = false);

   // Lifecycle
   onMount(() => {
      TextField1 = new MDCTextField(labelEle1);
      TextField2 = new MDCTextField(labelEle2);

      if (value === undefined) value = '';
      if (calc !== undefined) value = calc;
      metricValue = round(value * 0.0254, 2);

      if (readonly) {
         const input1 = labelEle1.querySelector('input');
         const input2 = labelEle2.querySelector('input');
         input1.tabIndex = -1;
         input2.tabIndex = -1;
      }
   });

   onDestroy(() => {
      TextField1.destroy();
      TextField2.destroy();
   });
</script>

<div class="input length" class:metric class:full-width={fullWidth}>
   <label bind:this={labelEle1} class={labelClass1}>
      <span class="mdc-text-field__ripple" />

      <span class={spanClass} id="{id}-1">{label}</span>

      {#if calc !== undefined}
         {#if override}
            <Icon on:click={onReset} class="material-icons mdc-text-field__icon mdc-text-field__icon--leading" tabindex="0" role="button" toolTip="Reset To Calculation">
               replay
            </Icon>
         {:else}
            <Icon class="material-icons mdc-text-field__icon mdc-text-field__icon--leading">create</Icon>
         {/if}
      {/if}

      <input value={feet} type="number" on:change={onChange1} on:focus={onFocus} {...props} class="mdc-text-field__input" aria-labelledby="{id}-1" min="0" />

      <span class="mdc-text-field__affix mdc-text-field__affix--suffix">ft</span>

      <span class="mdc-line-ripple" />
   </label>

   <label bind:this={labelEle2} class={labelClass2}>
      <span class="mdc-text-field__ripple" />

      <span class={spanClass} id="{id}-2" />

      <input
         value={inches}
         type="number"
         on:change={onChange2}
         on:focus={onFocus}
         {...props}
         class="mdc-text-field__input"
         aria-labelledby="{id}-2"
         step="0.0001"
         min="0"
         max="12"
      />

      <span class="mdc-text-field__affix mdc-text-field__affix--suffix">in</span>

      {#if link}
         <Icon class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" role="button" tabindex="0" toolTip={link}>link</Icon>
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
</div>

<style>
</style>
