<script context="module">
   let count = 1;

   const getDelay = () => {
      const current = count * 1000;
      count++;
      return current;
   };
</script>

<script>
   import { createEventDispatcher, onMount } from 'svelte';
   import SteelCalculator from 'js/steelCalculator';
   import { debounce } from 'lib/main.mjs';

   // Components
   import { Button, Icon, IconButton } from 'components/material/button';
   import { InputLength } from 'components/material/input';
   import { ToolTip } from 'components/material/tool-tip';

   import Hitch from './Hitch.svelte';
   import Load from './Load.svelte';
   import Reaction from './Reaction.svelte';
   import Sheave from './Sheave.svelte';

   // Stores
   // Properties
   export let axis = 'x';
   export let existing;
   export let i;
   export let id;
   export let label;
   export let length;
   export let lengthRb;
   export let loads = [];
   export let metric;
   export let name;
   export let options;
   export let qty;
   export let rA;
   export let rB;
   export let setId;
   export let shape;

   export let o_lengthRb = false;

   // Methods
   const updateLabel = debounce((update) => (label = update), 5000);

   // Constants
   const Calc = new SteelCalculator();
   const dispatch = createEventDispatcher();

   // Variables
   let run = false;
   let _label = label;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: updateLabel(_label);

   // - Calculator Inputs
   $: Calc.shape = shape;
   $: Calc.axis = axis;
   $: Calc.length = length;
   $: Calc.lengthRb = lengthRb;
   $: Calc.loads = loads;
   $: Calc.existing = existing;
   $: Calc.name = name;

   // - Calculator Outputs
   $: options = run ? Calc.options : [];
   $: rA = Calc.rA;
   $: rB = Calc.rB;

   // Events
   const onAddLoad = () => dispatch('addLoad', { setId, memberId: id });

   const onDelete = () => dispatch('delete', id);

   const onDeleteLoad = (event) => {
      loads = loads.filter((load) => load.id !== event.detail);
   };

   const onUpdate = () => {
      Calc.loads = loads;
   };

   // Lifecycle
   onMount(() => {
      const delay = getDelay();

      setTimeout(() => {
         run = true;
      }, delay);
   });
</script>

<hr />

{#if qty === 2}
   <div class="title">
      <span class="label" bind:textContent={_label} contenteditable="true" data-tooltip-id={id} />

      {#if i === 2}
         <IconButton on:click={onDelete} class="density-3" toolTip="Delete">
            <Icon>close</Icon>
         </IconButton>
      {/if}
   </div>
{/if}

<div class="main">
   <div class="form">
      <InputLength bind:value={length} label="Length" {metric} />

      <InputLength bind:value={lengthRb} bind:override={o_lengthRb} label="Length to R<sub>b</sub>" calc={length} {metric} />

      <Button on:click={onAddLoad} style="width: 150px;" variant="contained">Add Load</Button>
   </div>

   <div class="steel-member loads">
      {#each loads as { elevation, id, label, length, liveLoad, deadLoad, diameter, sheave, show, type } (id)}
         {#if type === 'hitch'}
            <Hitch on:delete={onDeleteLoad} on:update={onUpdate} bind:length bind:show {deadLoad} {id} {label} {liveLoad} {metric} />
         {/if}

         {#if type === 'load'}
            <Load on:delete={onDeleteLoad} on:update={onUpdate} bind:label bind:length bind:liveLoad bind:deadLoad bind:show {id} {metric} />
         {/if}

         {#if type === 'reaction'}
            <Reaction on:delete={onDeleteLoad} on:update={onUpdate} bind:length bind:show {deadLoad} {id} {label} {metric} />
         {/if}

         {#if type === 'sheave'}
            <Sheave
               on:delete={onDeleteLoad}
               on:update={onUpdate}
               bind:elevation
               bind:label
               bind:length
               bind:liveLoad
               bind:deadLoad
               bind:diameter
               bind:sheave
               bind:show
               {id}
               {metric}
            />
         {/if}
      {/each}
   </div>
</div>

{#if qty === 2}
   <ToolTip {id}>Edit Label</ToolTip>
{/if}

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 36px;
      margin-bottom: 8px;
   }

   .label {
      @include vantage.edit-label;
      padding: 6px 2px;
      flex-grow: 1;
      max-width: calc(100% - 36px);
   }

   .main {
      display: flex;
      flex-wrap: wrap;
      column-gap: 0.25em;
      row-gap: 1em;
      width: fit-content;
   }

   :global {
      .steel-member.loads {
         .load {
            border: 1px solid rgb(224, 224, 224);
            margin: 0 -1px -1px 0;
            padding: 0.25em 0 0.25em 0.5em;
            width: min(318px, 422px);

            &.show > .title {
               margin-bottom: 8px;
            }
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
      }
   }
</style>
