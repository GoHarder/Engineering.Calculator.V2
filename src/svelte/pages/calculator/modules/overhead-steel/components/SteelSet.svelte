<script>
   import { createEventDispatcher } from 'svelte';

   // Components
   import { StockStatusOptions } from 'components/common';
   import { Icon, IconButton } from 'components/material/button';
   import { Option, Select } from 'components/material/select';

   import SteelMember from './SteelMember.svelte';

   // Stores
   // Properties
   export let id;
   export let label;
   export let members = [];
   export let name;
   export let shape;
   export let steel = {};
   export let supplied;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let memberObj = {};

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: steelSizes = steel[shape] || [];

   // Events
   const onDelete = () => {
      dispatch('delete', id);
   };

   // $: console.log(memberObj);

   // Lifecycle
</script>

<fieldset>
   <header>
      <legend>{label}</legend>
      <div class="buttons">
         <IconButton on:click={onDelete} class="density-3" toolTip="Delete">
            <Icon>close</Icon>
         </IconButton>
      </div>
   </header>

   <hr />

   <SteelMember
      bind:label={members[0].label}
      bind:length={members[0].length}
      bind:lengthRb={members[0].lengthRb}
      bind:pointLoads={members[0].pointLoads}
      bind:rA={members[0].reactions.rA}
      bind:rB={members[0].reactions.rB}
      bind:o_lengthRb={members[0].o_lengthRb}
      {memberObj}
   >
      <Select bind:value={shape} label="Shape">
         <Option value="cChannels">C Channel</Option>
         <Option value="mcChannels">MC Channel</Option>
         <Option value="sBeams">S Beam</Option>
         <Option value="wBeams">W Beam</Option>
      </Select>

      {#if supplied}
         <Select bind:value={name} bind:selected={memberObj} label="Size" options={steelSizes}>
            <StockStatusOptions options={steelSizes} />
         </Select>
      {:else}
         <Select bind:value={name} bind:selected={memberObj} label="Size" options={steelSizes}>
            {#each steelSizes as { _id, name } (_id)}
               <Option value={name}>{name}</Option>
            {/each}
         </Select>
      {/if}
   </SteelMember>
</fieldset>

<style lang="scss">
   @use 'src/scss/theme' as vantage;

   fieldset {
      @include vantage.fieldset;
   }

   header {
      display: flex;
   }

   .buttons {
      margin-top: 2px;
   }
</style>
