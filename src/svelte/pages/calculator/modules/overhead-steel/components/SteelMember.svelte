<script>
   import { round } from 'lib/math.mjs';

   // Components
   import { Button } from 'components/material/button';
   import { InputLength } from 'components/material/input';

   import Load from './Load.svelte';

   // Stores
   // Properties
   export let label;
   export let length = 0;
   export let lengthRb = 0;
   export let memberObj = {};
   export let pointLoads = [];
   export let rA = 0;
   export let rB = 0;

   export let o_lengthRb = false;

   // Methods
   // Constants
   // Variables
   let loadIndex = 1;

   // Subscriptions
   // Contexts
   // Reactive Rules

   // - Reaction Calcs
   $: weightPerInch = memberObj?.weight ?? 0;

   // The distributed load of the member itself
   $: distLoad = { length: length / 2, weight: length * weightPerInch };

   // The sum of all the forces / moments in the Y direction
   $: sumOfForces = [...pointLoads, distLoad].reduce((total, load) => total + load.weight, 0);
   $: sumOfMoments = [...pointLoads, distLoad].reduce((total, load) => total + load.weight * load.length, 0);

   // The reactions
   $: rB = round(sumOfMoments / lengthRb, 2);
   $: rA = round(sumOfForces - rB, 2);

   // Shear Forces

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
