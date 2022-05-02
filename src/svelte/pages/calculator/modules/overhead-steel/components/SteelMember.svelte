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

   // Components
   import { Button, Icon, IconButton } from 'components/material/button';
   import { InputLength } from 'components/material/input';
   import { ToolTip } from 'components/material/tool-tip';

   import Load from './Load.svelte';

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
   export let name;
   export let options;
   export let qty;
   export let rA;
   export let rB;
   export let setId;
   export let shape;

   export let o_lengthRb = false;

   // Methods
   // Constants
   const Calc = new SteelCalculator();
   const dispatch = createEventDispatcher();

   // Variables
   let run = false;

   // Subscriptions
   // Contexts
   // Reactive Rules

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
      <span class="label" bind:textContent={label} contenteditable="true" data-tooltip-id={id} />

      {#if i === 2}
         <IconButton on:click={onDelete} class="density-3" toolTip="Delete">
            <Icon>close</Icon>
         </IconButton>
      {/if}
   </div>
{/if}

<InputLength bind:value={length} label="Length" />

<InputLength bind:value={lengthRb} bind:override={o_lengthRb} label="Length to R<sub>b</sub>" calc={length} />

<Button on:click={onAddLoad} variant="contained">Add Load</Button>

{#if qty === 2}
   <ToolTip {id}>Edit Label</ToolTip>
{/if}

{#each loads as load}
   <Load />
{/each}

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
   }
</style>
