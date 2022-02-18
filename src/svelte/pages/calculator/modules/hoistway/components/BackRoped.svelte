<script>
   import { toLengthString } from 'lib/math.mjs';

   // Components
   import { Fieldset } from 'components/common';
   import { HelperText, InputLength } from 'components/material/input';

   // Stores
   // Properties
   export let beamUnderside;
   export let clearOverhead;
   export let carEquipOffset;
   export let cwtEquipOffset;
   export let topToBeam;

   export let carTopClear = 0;
   export let cwtTopClear = 0;
   export let metric = false;
   export let minCarTopClear = 0;
   export let minCwtTopClear = 0;
   export let overTravel = 0;
   export let railClear = 0;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: beamUnderside = clearOverhead - topToBeam;

   $: cwtEquipOffset = 0; // No sheave over the counterweight

   $: carTopClearError = carTopClear < minCarTopClear;
   $: cwtTopClearError = cwtTopClear < minCwtTopClear;

   // Events
   // Lifecycle
</script>

<div class="container">
   <Fieldset title="Clearance Dimensions">
      <div class="flex">
         <div>
            <InputLength bind:value={topToBeam} label="Beam And Slab" {metric} />

            <InputLength value={carTopClear} label="Car Clearance" invalid={carTopClearError} {metric} readonly>
               <svelte:fragment slot="helperText">
                  <HelperText validation>{toLengthString(minCarTopClear)} Required</HelperText>
               </svelte:fragment>
            </InputLength>

            <InputLength bind:value={clearOverhead} label="Clear Overhead" {metric} />

            <InputLength bind:value={railClear} label="Rail Clearance" {metric} readonly />

            <InputLength bind:value={carEquipOffset} label="Deflector Sheave" {metric} />

            <InputLength value={cwtTopClear} label="Counterweight Clearance" invalid={cwtTopClearError} {metric} readonly>
               <svelte:fragment slot="helperText">
                  <HelperText validation>{toLengthString(minCwtTopClear)} Required</HelperText>
               </svelte:fragment>
            </InputLength>

            <InputLength bind:value={overTravel} label="Over Travel" {metric} readonly />
         </div>

         <img src="/public/img/hoistway/back_roped.svg" alt="Back Roped" />
      </div>
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

   .flex {
      display: flex;
      flex-wrap: wrap-reverse;
   }
</style>
