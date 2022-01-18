<script>
   import { createEventDispatcher } from 'svelte';

   // Components
   import { Icon, IconButton } from 'components/material/button';
   import { OptGroup, Option, Select } from 'components/material/select';
   import { ToolTip } from 'components/material/tool-tip';

   import SteelMember from './SteelMember.svelte';

   // Stores
   // Properties
   export let steel = {};
   export let supplied = false;
   export let existing = false;

   export let id = '';
   export let members = [];
   export let name = '';
   export let shape = '';
   export let label = '';
   export let reactions = { rA: 0, rB: 0 };

   // Methods
   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let show = true;

   // Subscriptions
   // Contexts
   // Reactive Rules

   // - Steel Selection
   $: steelSizes = steel[shape] || [];

   // Events
   const onDelete = () => {
      dispatch('delete', id);
   };

   // Lifecycle
</script>

<div class="fieldset">
   <header>
      <p bind:textContent={label} contenteditable="true" data-tooltip-id={id} />

      <ToolTip {id}>Edit Label</ToolTip>

      <div class="buttons">
         <IconButton class="density-3" toolTip="Copy">
            <Icon>copy_all</Icon>
         </IconButton>

         <IconButton bind:on={show} toggle class="density-3" toolTip={show ? 'Minimize' : 'Maximize'}>
            <Icon class="mdc-icon-button__icon--on">minimize</Icon>
            <Icon>maximize</Icon>
         </IconButton>

         <IconButton on:click={onDelete} class="density-3" toolTip="Delete">
            <Icon>close</Icon>
         </IconButton>
      </div>
   </header>

   {#if show}
      <hr />

      <SteelMember>
         <Select bind:value={shape} label="Shape">
            <Option value="cChannels">C Channel</Option>
            <Option value="mcChannels">MC Channel</Option>
            <Option value="sBeams">S Beam</Option>
            <Option value="wBeams">W Beam</Option>
         </Select>
      </SteelMember>

      {steel}
      {supplied}
      {existing}
      {id}
      {members}
      {name}
      {shape}
      {reactions}

      {#if members.length === 2}
         <SteelMember />
      {/if}
   {/if}
</div>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .fieldset {
      @include vantage.paper;
      padding: 5.6px 12px 10px;
   }

   header {
      display: flex;
      align-items: center;
      justify-content: space-between;
   }

   p {
      font-size: 1.1rem;
      margin: 0;
      margin-top: 6px;
      margin-right: 100px;
      position: relative;

      &:hover {
         color: vantage.$primary;

         &::after {
            font-family: 'Material Icons';
            content: ' \e3c9';
            position: absolute;
            top: 1px;
            right: -24px;
            z-index: 12;
         }
      }
   }

   hr {
      border: 1px solid vantage.$primary;
   }
</style>
