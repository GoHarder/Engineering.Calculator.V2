<script>
   import { createEventDispatcher, onMount } from 'svelte';

   import SteelCalculator from 'js/steelCalculator';

   // Components
   import { StockStatusOptions } from 'components/common';
   import { Icon, IconButton } from 'components/material/button';
   import { Option, Select } from 'components/material/select';
   import { ToolTip } from 'components/material/tool-tip';

   import SteelMember from './SteelMember.svelte';

   // Stores
   // Properties
   export let axis;
   export let delay = 0;
   export let existing = false;
   export let id;
   export let label;
   export let members = [];
   export let name;
   export let shape;
   export let supplied;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let options1 = [];
   let options2 = [];
   let show = false;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: steelSizes = SteelCalculator.sortOptions(options1, options2) || [];

   // Events
   const onCopy = () => {
      const id = `member-${Date.now()}`;

      const pointLoads = [...members[0].pointLoads].map((pointLoad) => {
         pointLoad.show = false;
         return { ...pointLoad };
      });

      const newMember = { ...members[0], i: 2, id, label: `Copy of ${members[0].label}`, pointLoads, reactLoads: [] };
      members = [...members, newMember];
   };

   const onDelete = () => {
      dispatch('delete', id);
   };

   const onDeleteMember = (event) => {
      members = [...members].filter((member) => member.id !== event.detail);
   };

   // Lifecycle
   onMount(() => {
      setTimeout(() => {
         setTimeout(() => {
            show = true;
         }, delay);
      }, 0);
   });
</script>

<fieldset class:steel-set-skeleton={!show}>
   <header>
      <div class="label-div" data-tooltip-id={id}>
         {#if members.length === 1}
            <p class="label" bind:textContent={members[0].label} contenteditable="true" />
         {:else}
            <p class="label" bind:textContent={label} contenteditable="true" />
         {/if}
      </div>

      <ToolTip {id}>Edit Label</ToolTip>

      {#if members.length === 1}
         <IconButton on:click={onCopy} class="density-3" toolTip="Copy">
            <Icon>file_copy</Icon>
         </IconButton>
      {/if}

      <IconButton on:click={onDelete} class="density-3" toolTip="Delete">
         <Icon>close</Icon>
      </IconButton>
   </header>

   <hr />

   <SteelMember
      on:delete={onDeleteMember}
      bind:label={members[0].label}
      bind:length={members[0].length}
      bind:lengthRb={members[0].lengthRb}
      bind:options={options1}
      bind:pointLoads={members[0].pointLoads}
      bind:rA={members[0].reactions.rA}
      bind:rB={members[0].reactions.rB}
      bind:o_lengthRb={members[0].o_lengthRb}
      {axis}
      {delay}
      {existing}
      i={members[0].i}
      id={members[0].id}
      {name}
      {shape}
      qty={members.length}
   >
      <Select bind:value={axis} label="Direction">
         <Option value="x">Upright</Option>
         <Option value="y">Side</Option>
      </Select>

      <Select bind:value={shape} label="Shape">
         <Option value="cChannels">C Channel</Option>
         <Option value="mcChannels">MC Channel</Option>
         <Option value="sBeams">S Beam</Option>
         <Option value="wBeams">W Beam</Option>
      </Select>

      {#if shape && steelSizes.length > 0}
         <Select bind:value={name} label="Size" options={steelSizes}>
            {#if supplied}
               <StockStatusOptions options={steelSizes} />
            {:else}
               {#each steelSizes as { _id, name } (_id)}
                  <Option value={name}>{name}</Option>
               {/each}
            {/if}
         </Select>
      {/if}
   </SteelMember>

   {#if members.length === 2}
      <SteelMember
         on:delete={onDeleteMember}
         bind:label={members[1].label}
         bind:length={members[1].length}
         bind:lengthRb={members[1].lengthRb}
         bind:options={options2}
         bind:pointLoads={members[1].pointLoads}
         bind:rA={members[1].reactions.rA}
         bind:rB={members[1].reactions.rB}
         bind:o_lengthRb={members[1].o_lengthRb}
         {axis}
         {delay}
         {existing}
         i={members[1].i}
         id={members[1].id}
         {name}
         {shape}
         qty={members.length}
      />
   {/if}
</fieldset>

<style lang="scss">
   @use 'src/scss/theme' as vantage;

   header {
      display: flex;
      align-items: center;
   }

   .label {
      @include vantage.edit-label;
      font-size: 1.1rem;
      margin: 6px 0 2px;
      padding: 0 2px;
   }

   .label-div {
      margin-right: auto;
   }

   fieldset {
      @include vantage.fieldset;
      @include vantage.paper;
   }

   hr {
      border: 1px solid vantage.$primary;
   }

   :global {
      .steel-set-skeleton {
         pointer-events: none;
         .label-div,
         .label {
            animation: skeleton-loading 1s linear infinite alternate;
            opacity: 0.7;
            color: transparent;
            border-radius: 4px;
         }

         .mdc-icon-button {
            animation: skeleton-loading 1s linear infinite alternate;
            opacity: 0.7;
            color: transparent;
            border-radius: 500px;
         }

         .mdc-button {
            animation: skeleton-loading 1s linear infinite alternate;
            opacity: 0.7;
            border-radius: 4px;
            .mdc-button__label {
               color: transparent;
            }
            box-shadow: none;
         }

         .mdc-text-field,
         .mdc-select {
            animation: skeleton-loading 1s linear infinite alternate;
            opacity: 0.7;
            border-radius: 4px;
            color: transparent;

            > * {
               display: none;
            }
         }
      }

      @keyframes skeleton-loading {
         0% {
            background-color: hsl(200, 0%, 70%);
         }
         100% {
            background-color: hsl(200, 0%, 95%);
         }
      }
   }
</style>
