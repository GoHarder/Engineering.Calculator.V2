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

<style></style>
