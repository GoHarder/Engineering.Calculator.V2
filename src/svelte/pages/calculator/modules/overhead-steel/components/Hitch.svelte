<script>
   import { createEventDispatcher } from 'svelte';

   // Components
   import { Icon, IconButton } from 'components/material/button';
   import { InputNumber, InputLength } from 'components/material/input';

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

   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (length) dispatch('update');

   // Events
   const onDelete = () => dispatch('delete', id);

   // Lifecycle
</script>

<div class="load" class:show>
   <div class="title">
      <span class="label">{label}</span>

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

         <InputNumber value={liveLoad} label="Live Load" readonly type="weight" {metric} />

         <InputNumber value={deadLoad} label="Dead Load" readonly type="weight" {metric} />
      {/if}
   </div>
</div>

<style>
</style>
