<script>
   import { onMount, onDestroy } from 'svelte';
   import { MDCTextField } from '@material/textfield';

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
   // Events
   // Lifecycle
   onMount(() => {
      TextField = new MDCTextField(labelEle);
   });

   onDestroy(() => {
      TextField.destroy();
   });
</script>

<label bind:this={labelEle} id="some-id" class="mdc-text-field mdc-text-field--filled mdc-text-field--textarea mdc-text-field--no-label">
   <span class="mdc-text-field__ripple" />
   <span class="mdc-text-field__resizer">
      <textarea bind:value class="mdc-text-field__input" rows="8" cols="40" aria-label="Label" aria-labelled-by="some-id" />
   </span>
   <span class="mdc-line-ripple" />
</label>

<style>
</style>
