<script>
   import { filterProps, randomId } from '../../lib';

   // Components
   import ToolTip from '../tool-tip/ToolTip.svelte';

   // Stores
   // Properties
   export let toolTip = undefined;

   // Methods
   // Constants
   let id = `icon-${randomId()}`;

   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: props = filterProps($$props, ['toolTip']);

   // Events
   // Lifecycle
</script>

<i on:click {...props} data-tooltip-id={id}><slot /></i>

{#if toolTip}
   <ToolTip {id}>{toolTip}</ToolTip>
{/if}

<style>
</style>
