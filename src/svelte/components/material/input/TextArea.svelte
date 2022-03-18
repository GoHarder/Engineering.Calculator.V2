<script>
   import { onMount, onDestroy } from 'svelte';
   import { MDCTextField } from '@material/textfield';
   import { filterProps } from '../../lib';

   // Components
   // Stores
   // Properties
   export let value = '';

   // Methods
   // Constants
   // Variables
   let labelEle;
   let TextField;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: props = filterProps($$props, ['value']);

   // Events
   // Lifecycle
   onMount(() => {
      TextField = new MDCTextField(labelEle);
   });

   onDestroy(() => {
      TextField.destroy();
   });
</script>

<label bind:this={labelEle} for="test-id" class="mdc-text-field mdc-text-field--filled mdc-text-field--textarea mdc-text-field--no-label">
   <span class="mdc-text-field__ripple" />
   <span class="mdc-text-field__resizer">
      <textarea bind:value class="mdc-text-field__input" rows="14" cols="40" aria-label="Label" id="test-id" {...props} />
   </span>
   <span class="mdc-line-ripple" />
</label>

<style>
</style>
