<script>
   import { createEventDispatcher } from 'svelte';
   import { debounce } from 'lib/main.mjs';

   // Components
   import { Icon, IconButton } from 'components/material/button';
   import { InputNumber, InputLength } from 'components/material/input';
   import { ToolTip } from 'components/material/tool-tip';

   // Stores
   // Properties
   export let deadLoad;
   export let id;
   export let label;
   export let length;
   export let liveLoad;
   export let metric;
   export let show;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();
   const updateLabel = debounce((update) => (label = update), 5000);

   // Variables
   let _label = label;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (length || liveLoad || deadLoad) dispatch('update');

   $: updateLabel(_label);

   // Events
   const onDelete = () => dispatch('delete', id);

   // Lifecycle
</script>

<div class="load" class:show>
   <div class="title">
      <span class="label edit" bind:textContent={_label} contenteditable="true" data-tooltip-id={id} />

      <IconButton bind:on={show} toggle class="density-3" toolTip={show ? 'Minimize' : 'Maximize'}>
         <Icon class="mdc-icon-button__icon--on">minimize</Icon>
         <Icon>maximize</Icon>
      </IconButton>

      <IconButton on:click={onDelete} class="density-3" toolTip="Delete">
         <Icon>close</Icon>
      </IconButton>
   </div>

   <div class="form">
      {#if show}
         <InputLength bind:value={length} label="Length From R<sub>a</sub>" {metric} />

         <InputNumber bind:value={liveLoad} label="Live Load" type="weight" {metric} />

         <InputNumber bind:value={deadLoad} label="Dead Load" type="weight" {metric} />
      {/if}
   </div>
</div>

<ToolTip {id}>Edit Label</ToolTip>

<style>
</style>
