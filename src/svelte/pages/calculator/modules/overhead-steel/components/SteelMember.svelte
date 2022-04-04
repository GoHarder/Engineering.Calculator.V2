<script>
   import { createEventDispatcher, onMount } from 'svelte';
   import { clone } from 'lib/main.mjs';
   import SteelCalculator from 'js/steelCalculator';

   // Components
   import { Button, Icon, IconButton } from 'components/material/button';
   import { InputLength } from 'components/material/input';
   import { ToolTip } from 'components/material/tool-tip';

   import Load from './Load.svelte';

   // Stores
   // Properties
   export let axis;
   export let delay = 0;
   export let existing = false;
   export let i;
   export let id;
   export let label;
   export let length = 0;
   export let lengthRb = 0;
   export let name;
   export let options = [];
   export let pointLoads = [];
   export let reactLoads = [];
   export let rA = 0;
   export let rB = 0;
   export let setId = '';
   export let shape;
   export let qty;

   export let o_lengthRb = false;

   // Methods
   // Constants
   const Calc = new SteelCalculator();
   const dispatch = createEventDispatcher();

   // Variables
   let loadIndex = 1;
   let run = false;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: _pointLoads = clone(pointLoads).map((load) => {
      load.weight = load.liveLoad + load.deadLoad;
      return load;
   });

   // - Calculator Inputs
   $: Calc.shape = shape;
   $: Calc.axis = axis;
   $: Calc.length = length;
   $: Calc.lengthRb = lengthRb;
   $: Calc.loads = [..._pointLoads, ...reactLoads];
   $: Calc.existing = existing;
   $: Calc.name = name;

   // - Calculator Outputs
   $: options = run ? Calc.options : [];
   $: rA = Calc.rA;
   $: rB = Calc.rB;

   // Events
   const onAddLoad = () => {
      const newLoad = {
         id: `load-${Date.now()}`,
         label: `Load ${loadIndex}`,
         length: 0,
         liveLoad: 0,
         deadLoad: 0,
         show: true,
      };

      pointLoads = [...pointLoads, newLoad];
      loadIndex++;
   };

   const onAddReaction = () => dispatch('addReaction', { set: setId, member: id });

   const onDelete = () => {
      dispatch('delete', id);
   };

   const onDeleteLoad = (event) => {
      if (event.detail.includes('load')) {
         pointLoads = [...pointLoads].filter((pointLoad) => pointLoad.id !== event.detail);
      }

      if (event.detail.includes('link')) {
         dispatch('deleteReaction', event.detail);
         reactLoads = [...reactLoads].filter((reactLoad) => reactLoad.id !== event.detail);
      }
   };

   // Lifecycle
   onMount(() => {
      setTimeout(() => {
         setTimeout(() => {
            run = true;
         }, delay);
      }, 0);
   });
</script>

{#if qty === 2}
   {#if i === 2}
      <hr />
   {/if}

   <header>
      <p class="label" bind:textContent={label} contenteditable="true" data-tooltip-id={id} />
      <ToolTip {id}>Edit Label</ToolTip>

      {#if i === 2}
         <IconButton on:click={onDelete} class="density-3" toolTip="Delete">
            <Icon>close</Icon>
         </IconButton>
      {/if}
   </header>

   <hr />
{/if}

<div class="content">
   <div class="member">
      <InputLength bind:value={length} label="Length" />

      <InputLength bind:value={lengthRb} bind:override={o_lengthRb} label="Length to R<sub>b</sub>" calc={length} />

      <slot />
   </div>

   <div class="vr" />

   <div class="loads">
      {#each reactLoads as { id, label, length, liveLoad, deadLoad, show } (id)}
         <Load on:delete={onDeleteLoad} bind:label bind:length bind:liveLoad bind:deadLoad bind:show {id} reaction={true} />
      {/each}

      {#each pointLoads as { id, label, length, liveLoad, deadLoad, show } (id)}
         <Load on:delete={onDeleteLoad} bind:label bind:length bind:liveLoad bind:deadLoad bind:show {id} reaction={false} />
      {/each}

      <div class="buttons">
         <Button on:click={onAddLoad} style="margin: 8px; width:125px;" variant="contained">Add Load</Button>
         <Button on:click={onAddReaction} style="margin: 8px; width:125px;" variant="contained">Add Reaction</Button>
      </div>
   </div>
</div>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .buttons {
      display: flex;
   }
   header {
      display: flex;
      align-items: center;
   }

   .label {
      margin: 8px auto 8px 0;
      @include vantage.edit-label;
   }

   .content {
      display: flex;
   }

   .vr {
      width: 1px;
      // margin: 0 8px;
      background-color: rgba(0, 0, 0, 0.12);
   }

   hr {
      margin: 0;
   }

   .loads {
      width: 308px;
   }

   .member {
      margin-top: 8px;
      margin-right: 8px;
   }
</style>
