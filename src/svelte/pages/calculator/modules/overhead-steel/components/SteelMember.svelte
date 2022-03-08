<script>
   import SteelCalculator from 'js/steelCalculator';

   import { clone } from 'lib/main.mjs';

   // Components
   import { Button } from 'components/material/button';
   import { InputLength, InputNumber } from 'components/material/input';

   import Load from './Load.svelte';

   // Stores
   // Properties
   export let existing = false;
   export let label;
   export let length = 0;
   export let lengthRb = 0;
   export let name;
   export let options = [];
   export let pointLoads = [];
   export let rA = 0;
   export let rB = 0;
   export let shape;

   export let o_lengthRb = false;

   // Methods
   // Constants
   const Calc = new SteelCalculator();

   // Variables
   let loadIndex = 1;

   // Subscriptions
   // Contexts
   // Reactive Rules

   // - Calculator Inputs

   $: Calc.shape = shape;
   $: Calc.length = length;
   $: Calc.lengthRb = lengthRb;
   $: Calc.loads = pointLoads;
   $: Calc.existing = existing;
   $: Calc.name = name;

   // - Calculator Outputs
   $: options = Calc.options;

   $: console.log(Calc);

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

   const onDeleteLoad = (event) => {
      pointLoads = [...pointLoads].filter((pointLoad) => pointLoad.id !== event.detail);
   };

   // Lifecycle
</script>

<p>{label}</p>

<hr />

<div class="content">
   <div class="member">
      <InputLength bind:value={length} label="Length" />

      <InputLength bind:value={lengthRb} bind:override={o_lengthRb} label="Length to R<sub>b</sub>" calc={length} />

      <slot />

      <InputNumber value={rA} label="Force at R<sub>a</sub>" readonly type="weight" />

      <InputNumber value={rB} label="Force at R<sub>b</sub>" readonly type="weight" />
   </div>

   <div class="vr" />

   <div class="loads">
      {#each pointLoads as { id, label, length, weight, type, show } (id)}
         <Load on:delete={onDeleteLoad} bind:label bind:length bind:weight bind:type bind:show {id} />
      {/each}

      <Button on:click={onAddLoad} variant="contained">Add Load</Button>
   </div>
</div>

<style>
   p {
      margin: 0;
   }

   .content {
      display: flex;
   }

   .vr {
      width: 1px;
      margin: 0 8px;
      background-color: rgba(0, 0, 0, 0.12);
   }

   .loads {
      width: 300px;
   }
</style>
