<script>
   import { createEventDispatcher } from 'svelte';

   // Components
   import { Icon, IconButton } from 'components/material/button';
   import { InputNumber, InputLength } from 'components/material/input';
   import { Option, Select } from 'components/material/select';
   import { ToolTip } from 'components/material/tool-tip';

   // Stores
   // Properties
   export let id;
   export let label;
   export let length = 0;
   export let reaction = false;
   export let show;
   export let type;
   export let weight = 0;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onDelete = () => dispatch('delete', id);

   // Lifecycle
</script>

<div>
   <header>
      <p class="label" bind:textContent={label} contenteditable="true" data-tooltip-id={id} />
      <ToolTip {id}>Edit Label</ToolTip>

      <IconButton bind:on={show} toggle class="density-3" toolTip={show ? 'Minimize' : 'Maximize'}>
         <Icon class="mdc-icon-button__icon--on">minimize</Icon>
         <Icon>maximize</Icon>
      </IconButton>

      <IconButton on:click={onDelete} class="density-3" toolTip="Delete">
         <Icon>close</Icon>
      </IconButton>
   </header>

   {#if show}
      {#if !reaction}
         <Select bind:value={type} label="Type">
            <Option value="Dead">Dead</Option>
            <Option value="Live">Live</Option>
         </Select>
      {/if}

      <InputLength bind:value={length} label="Length From R<sub>a</sub>" />

      {#if !reaction}
         <InputNumber bind:value={weight} label="Weight" type="weight" />
      {/if}
   {/if}
</div>

<hr />

<style lang="scss">
   @use './src/scss/theme' as vantage;

   div {
      margin-left: 8px;
   }
   header {
      display: flex;
      align-items: center;
   }

   hr {
      margin: 0;
   }

   .label {
      margin: 8px auto 8px 0;
      @include vantage.edit-label;
   }
</style>
