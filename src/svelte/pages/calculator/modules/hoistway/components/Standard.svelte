<script>
   // Components
   import { Fieldset } from 'components/common';
   import { InputLength } from 'components/material/input';

   // Stores
   // Properties
   export let topToBeam = 14;
   export let deflector = 17.5;
   export let clearOverhead;
   export let beamUnderside = 0;
   export let cwtTopClear = 0;
   export let metric = false;

   // Methods
   // Constants
   // Variables

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: beamUnderside = clearOverhead - topToBeam;

   // Events
   // Lifecycle
</script>

<div class="container">
   <Fieldset title="Clearance Dimensions">
      <img src="/public/img/hoistway/standard.svg" alt="Standard Overhead" />

      <InputLength bind:value={clearOverhead} label="Clear Overhead" {metric} />

      <InputLength bind:value={topToBeam} label="Slab To Beam" {metric} />

      <InputLength bind:value={deflector} label="Deflector Sheave" {metric} />

      <InputLength value={cwtTopClear} label="Counterweight Clearance" {metric} readonly />
   </Fieldset>
</div>

<style>
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      margin: 0.25em;
      gap: 0.25em;
   }
</style>
