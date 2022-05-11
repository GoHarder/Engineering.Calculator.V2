<script>
   import { createEventDispatcher, setContext } from 'svelte';
   import { writable } from 'svelte/store';
   import SteelCalculator from 'js/steelCalculator';
   import { clone, debounce } from 'lib/main.mjs';

   // Components
   import { StockStatusOptions } from 'components/common';
   import { Icon, IconButton } from 'components/material/button';
   import { InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';
   import { ToolTip } from 'components/material/tool-tip';

   import SteelMember from './SteelMember.svelte';

   // Stores
   // Properties
   export let axis;
   export let existing;
   export let id;
   export let label;
   export let members = [];
   export let metric;
   export let name;
   export let reactions;
   export let shape;
   export let supplied;

   // Methods
   const updateLabel1 = debounce((update) => (label = update), 5000);
   const updateLabel2 = debounce((update) => (members[0].label = update), 5000);

   // Constants
   const dispatch = createEventDispatcher();
   const contextStore = writable({});

   // Variables
   let options1 = [];
   let options2 = [];
   let _label1 = label;
   let _label2 = members[0].label;
   let memberObj;

   // Subscriptions
   // Contexts
   setContext('steelSet', {
      getMemberObj: () => memberObj,
      contextStore,
   });

   // Reactive Rules
   $: updateLabel1(_label1);
   $: updateLabel2(_label2);
   $: contextStore.set(memberObj);

   $: steelSizes = SteelCalculator.sortOptions(options1, options2) || [];

   $: reactions = clone(members).reduce(
      (output, member) => {
         output.rA += member.reactions.rA;
         output.rB += member.reactions.rB;

         return output;
      },
      { rA: 0, rB: 0 }
   );

   // Events
   const onCopyMember = () => {
      const newMember = clone(members[0]);

      newMember.id = `member-${Date.now()}`;

      newMember.loads.map((load) => {
         load.show = false;
         return load;
      });

      members = [...members, newMember];
   };

   const onDelete = () => dispatch('delete', id);

   const onDeleteMember = (event) => {
      members = clone(members).filter((member) => member.id !== event.detail);
   };

   // Lifecycle
</script>

<fieldset>
   <div class="title">
      <legend data-tooltip-id={id}>
         {#if members.length === 1}
            <span bind:textContent={_label2} contenteditable="true" />
         {:else}
            <span bind:textContent={_label1} contenteditable="true" />
         {/if}
      </legend>

      {#if members.length === 1}
         <IconButton on:click={onCopyMember} class="density-3" toolTip="Copy">
            <Icon>file_copy</Icon>
         </IconButton>
      {/if}

      <IconButton on:click={onDelete} class="density-3" toolTip="Delete">
         <Icon>close</Icon>
      </IconButton>
   </div>

   <hr />

   <div class="top">
      <div>
         <Select bind:value={axis} label="Orientation">
            <Option value="x">Upright</Option>
            <Option value="y">Sideways</Option>
         </Select>

         <Select bind:value={shape} label="Shape">
            <Option value="cChannels">C Channel</Option>
            <Option value="mcChannels">MC Channel</Option>
            <Option value="sBeams">S Beam</Option>
            <Option value="wBeams">W Beam</Option>
         </Select>

         <Select bind:value={name} bind:selected={memberObj} label="Size" disabled={steelSizes.length < 1} options={steelSizes}>
            {#if supplied}
               <StockStatusOptions options={steelSizes} />
            {:else}
               {#each steelSizes as { _id, name } (_id)}
                  <Option value={name}>{name}</Option>
               {/each}
            {/if}
         </Select>
      </div>

      <div>
         <InputNumber value={reactions.rA} label="Reaction at R<sub>a</sub>" {metric} readonly step="0.1" type="weight" />

         <InputNumber value={reactions.rB} label="Reaction at R<sub>b</sub>" {metric} readonly step="0.1" type="weight" />
      </div>
   </div>

   <SteelMember
      on:addLoad
      bind:label={members[0].label}
      bind:length={members[0].length}
      bind:lengthRb={members[0].lengthRb}
      bind:options={options1}
      bind:loads={members[0].loads}
      bind:rA={members[0].reactions.rA}
      bind:rB={members[0].reactions.rB}
      bind:o_lengthRb={members[0].o_lengthRb}
      id={members[0].id}
      {axis}
      {existing}
      i={1}
      {metric}
      {name}
      setId={id}
      {shape}
      qty={members.length}
   />

   {#if members.length === 2}
      <SteelMember
         on:addLoad
         on:delete={onDeleteMember}
         bind:label={members[1].label}
         bind:length={members[1].length}
         bind:lengthRb={members[1].lengthRb}
         bind:options={options2}
         bind:loads={members[1].loads}
         bind:rA={members[1].reactions.rA}
         bind:rB={members[1].reactions.rB}
         bind:o_lengthRb={members[1].o_lengthRb}
         id={members[1].id}
         {axis}
         {existing}
         i={2}
         {metric}
         {name}
         setId={id}
         {shape}
         qty={members.length}
      />
   {/if}
</fieldset>

<ToolTip {id}>Edit Label</ToolTip>

<style lang="scss">
   @use 'src/scss/theme' as vantage;
   fieldset {
      @include vantage.fieldset;
      @include vantage.paper;
      @include vantage.fieldset-legend(vantage.$primary);
   }

   .title {
      display: flex;
      legend {
         @include vantage.edit-label;
         cursor: text;
         display: flex;
         flex-grow: 1;
         span {
            flex-grow: 1;
         }
      }
   }

   .top {
      display: grid;
      column-gap: 0.25em;
      align-items: start;
      grid-template-columns: repeat(auto-fill, min(300px, 404px));
   }
</style>
