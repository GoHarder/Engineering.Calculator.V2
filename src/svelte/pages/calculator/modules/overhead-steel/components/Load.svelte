<script context="module">
   // Poo
</script>

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
   export let type;

   /**
    * load
    * reacion
    * sheave
    * hitch
    */

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
      {#if type === 'load'}
         <span class="label edit" bind:textContent={_label} contenteditable="true" data-tooltip-id={id} />
      {:else}
         <span class="label">{label}</span>
      {/if}

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

         {#if type === 'load'}
            <InputNumber bind:value={liveLoad} label="Live Load" type="weight" {metric} />

            <InputNumber bind:value={deadLoad} label="Dead Load" type="weight" {metric} />
         {/if}

         {#if type === 'reaction'}
            <InputNumber value={deadLoad} label="Dead Load" readonly type="weight" {metric} />
         {/if}

         <!-- {:else if type === 'hitch'}
            <InputNumber value={liveLoad} label="Live Load" readonly type="weight" {metric} />

            <InputNumber value={deadLoad} label="Dead Load" readonly type="weight" {metric} />
         {/if} -->
      {/if}
   </div>
</div>

{#if type === 'load'}
   <ToolTip {id}>Edit Label</ToolTip>
{/if}

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .load {
      border: 1px solid rgb(224, 224, 224);
      margin: 0 -1px -1px 0;
      padding: 0.25em 0 0.25em 0.5em;
      width: min(318px, 422px);
   }

   .load.show > .title {
      margin-bottom: 8px;
   }

   .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 36px;
      margin-bottom: 0px;
   }

   .label {
      padding: 6px 2px;
      flex-grow: 1;
      cursor: default;
   }

   .edit {
      @include vantage.edit-label;
   }

   .form {
      margin-right: 0.5em;
   }
</style>
