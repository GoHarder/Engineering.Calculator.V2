<script>
   import { toLengthString } from 'lib/math.mjs';
   import { containerQuery } from 'components/lib.js';

   // Components
   import { Fieldset } from 'components/common';
   import { HelperText, InputLength } from 'components/material/input';

   // Stores
   // Properties
   export let carBeamUnderside;
   export let cwtBeamUnderside;
   export let clearOverhead;
   export let carEquipOffset;
   export let cwtEquipOffset;
   export let topToCarBeam;
   export let topToCwtBeam;

   export let carTopClear = 0;
   export let cwtTopClear = 0;
   export let metric = false;
   export let minCarTopClear = 0;
   export let minCwtTopClear = 0;
   export let overTravel = 0;
   export let railClear = 0;

   // Methods
   // Constants
   const breakpoints = {
      745: ['small'],
      5000: ['large'],
   };

   // Variables
   let imgSrc = `/img/hoistway/basement_1.svg`;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: carBeamUnderside = clearOverhead - topToCarBeam;
   $: cwtBeamUnderside = clearOverhead - topToCwtBeam;

   $: carEquipOffset = 0; // Nothing above car
   $: cwtEquipOffset = 0; // Nothing above counterweight

   $: carTopClearError = carTopClear < minCarTopClear;
   $: cwtTopClearError = cwtTopClear < minCwtTopClear;

   $: if (topToCarBeam === topToCwtBeam) {
      imgSrc = `/img/hoistway/basement_2.svg`;
   } else if (topToCarBeam < topToCwtBeam) {
      imgSrc = `/img/hoistway/basement_1.svg`;
   } else {
      imgSrc = `/img/hoistway/basement_3.svg`;
   }

   // Events
   // Lifecycle
</script>

<div class="flex-row hoistway-clearance" use:containerQuery={breakpoints}>
   <Fieldset title="Clearance Dimensions">
      <div class="form">
         <div class="inputs">
            <InputLength bind:value={topToCarBeam} label="Car Beam" {metric} />

            <InputLength value={carTopClear} label="Car Clearance" invalid={carTopClearError} {metric} readonly>
               <svelte:fragment slot="helperText">
                  <HelperText validation>{toLengthString(minCarTopClear)} Required</HelperText>
               </svelte:fragment>
            </InputLength>

            <InputLength bind:value={clearOverhead} label="Clear Overhead" {metric} />

            <InputLength bind:value={railClear} label="Rail Clearance" {metric} readonly />

            <InputLength bind:value={topToCwtBeam} label="Counterweight Beam" {metric} />

            <InputLength value={cwtTopClear} label="Counterweight Clearance" invalid={cwtTopClearError} {metric} readonly>
               <svelte:fragment slot="helperText">
                  <HelperText validation>{toLengthString(minCwtTopClear)} Required</HelperText>
               </svelte:fragment>
            </InputLength>

            <InputLength bind:value={overTravel} label="Over Travel" {metric} readonly />
         </div>

         <div class="section-img">
            <img src={imgSrc} alt="Basement / Hoistway" />
         </div>
      </div>
   </Fieldset>
</div>

<style>
</style>
