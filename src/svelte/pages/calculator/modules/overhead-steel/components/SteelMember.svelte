<script>
   import { createEventDispatcher, onMount } from 'svelte';

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
   export let rA = 0;
   export let rB = 0;
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

   // - Calculator Inputs
   $: Calc.shape = shape;
   $: Calc.axis = axis;
   $: Calc.length = length;
   $: Calc.lengthRb = lengthRb;
   $: Calc.loads = pointLoads;
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
         weight: 0,
         type: 'Dead',
         show: true,
      };

      pointLoads = [...pointLoads, newLoad];
      loadIndex++;
   };

   const onAddReaction = () => dispatch('addReaction', id);

   const onDelete = () => {
      dispatch('delete', id);
   };

   const onDeleteLoad = (event) => {
      pointLoads = [...pointLoads].filter((pointLoad) => pointLoad.id !== event.detail);
   };

   // Lifecycle

   onMount(() => {
      setTimeout(() => {
         setTimeout(() => {
            run = true;
         }, delay + 500);
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
      {#each pointLoads as { id, label, length, weight, type, show } (id)}
         <Load on:delete={onDeleteLoad} bind:label bind:length bind:weight bind:type bind:show {id} />
      {/each}

      <Button on:click={onAddLoad} style="margin: 8px;" variant="contained">Add Load</Button>
      <Button on:click={onAddReaction} style="margin: 8px;" variant="contained">Add Reaction</Button>
   </div>
</div>

<style lang="scss">
   @use './src/scss/theme' as vantage;

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
