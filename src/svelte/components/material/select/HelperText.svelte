<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCSelectHelperText } from '@material/select/helper-text';
   import { classList } from '../../lib';

   // Components
   // Stores
   // Properties
   export let persistent = false;
   export let validation = false;

   // Methods
   // Constants
   // Variables
   let pEle;
   let HelperText;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: pClass = classList([
      'mdc-select-helper-text',
      persistent ? 'mdc-select-helper-text--validation-msg-persistent' : '',
      validation ? 'mdc-select-helper-text--validation-msg' : '',
   ]);

   // Events
   // Lifecycle
   onMount(() => {
      HelperText = new MDCSelectHelperText(pEle);
   });

   onDestroy(() => {
      HelperText.destory();
   });
</script>

<p bind:this={pEle} class={pClass} aria-hidden="true"><slot /></p>

<style>
</style>
