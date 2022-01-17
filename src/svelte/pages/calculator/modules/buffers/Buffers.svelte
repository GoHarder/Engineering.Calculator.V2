<script>
   import { round } from 'lib/math.mjs';

   import { BufferLinks as Links } from '../links';

   // Components
   import { Fieldset } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, InputNumber } from 'components/material/input';

   import BufferInput from './components/BufferInput.svelte';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {
         car: {
            weight: carWeight,
         },
         counterweight: {
            weight: cwtWeight,
         },
      };

      const moduleData = {
         ratedSpeed,
         speedDevice,
         car: {
            bufferQty: carBufferQty,
            compression: carCompression,
            oilModel: carOilModel,
            spaceBelow: carSpaceBelow,
            springModel: carSpringModel,
            springQty: carSpringQty,
            style: carStyle,
            o_compression: o_carCompression,
            o_springQty: o_carSpringQty,
         },
         counterweight: {
            bufferQty: cwtBufferQty,
            compression: cwtCompression,
            oilModel: cwtOilModel,
            spaceBelow: cwtSpaceBelow,
            springModel: cwtSpringModel,
            springQty: cwtSpringQty,
            style: cwtStyle,
            o_compression: o_cwtCompression,
            o_springQty: o_cwtSpringQty,
         },
      };

      project.globals = { ...project.globals, ...globalData };
      project.modules.buffers = moduleData;
   };

   // Methods
   // Constants
   const { globals, modules, metric } = project;
   const { capacity, speed } = globals;
   const { buffers: module } = modules;
   Links.setProject(modules);

   // Variables
   // - Globals
   let carWeight = globals?.car?.weight ?? 0;
   let cwtWeight = globals?.counterweight?.weight ?? 0;

   // - General
   let speedDevice = module?.speedDevice ?? false;
   let ratedSpeed = module?.ratedSpeed ?? 0;

   // - Location Specific
   // -- Car
   let carBufferQty = 1;
   let carCompression = 0;
   let carOilModel = '500';
   let carSpaceBelow = false;
   let carSpringModel = '400-008';
   let carSpringQty = 1;
   let carStyle = 'Spring';

   let o_carCompression = false;
   let o_carSpringQty = false;

   // -- Cwt
   let cwtBufferQty = 1;
   let cwtCompression = 0;
   let cwtOilModel = '500';
   let cwtSpaceBelow = false;
   let cwtSpringModel = '400-008';
   let cwtSpringQty = 1;
   let cwtStyle = 'Spring';

   let o_cwtCompression = false;
   let o_cwtSpringQty = false;

   // - UI
   let cwtWeightDisplay = false;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (!Links.get('carWeight') && !Links.get('cwtWeight')) {
      cwtWeight = round(carWeight * capacity * counterbalance);
      cwtWeightDisplay = true;
   }

   $: if (!speedDevice) ratedSpeed = speed;

   $: carGrossLoad = round(carWeight + capacity, 2);
   $: cwtGrossLoad = cwtWeight;

   // Events
   // Lifecycle
</script>

<div class="container">
   <Fieldset title="Car Properties">
      <InputNumber bind:value={carWeight} label="Car Weight" link={Links.get('carWeight')} {metric} type="weight" />

      <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} type="weight" />
   </Fieldset>

   <Fieldset title="Counterweight Properties">
      <InputNumber bind:value={cwtWeight} label="Counterweight" link={Links.get('cwtWeight')} {metric} readonly={cwtWeightDisplay} type="weight" />
   </Fieldset>
</div>

<div class="container">
   <Fieldset title="Properties">
      <Checkbox bind:checked={speedDevice} label="Terminal Speed Reducing Device" />

      {#if speedDevice}
         <InputNumber bind:value={ratedSpeed} label="Reduced Speed" max={speed} {metric} type="speed">
            <svelte:fragment slot="helperText">
               <HelperText>Speed must be between 0 and {speed}</HelperText>
            </svelte:fragment>
         </InputNumber>
      {/if}
   </Fieldset>
</div>

<div class="container">
   <BufferInput
      title="Car"
      bind:bufferQty={carBufferQty}
      bind:compression={carCompression}
      bind:oilModel={carOilModel}
      bind:spaceBelow={carSpaceBelow}
      bind:springModel={carSpringModel}
      bind:springQty={carSpringQty}
      bind:style={carStyle}
      bind:o_compression={o_carCompression}
      bind:o_springQty={o_carSpringQty}
      grossLoad={carGrossLoad}
      {metric}
      {ratedSpeed}
   />

   <BufferInput
      title="Counterweight"
      bind:bufferQty={cwtBufferQty}
      bind:compression={cwtCompression}
      bind:oilModel={cwtOilModel}
      bind:spaceBelow={cwtSpaceBelow}
      bind:springModel={cwtSpringModel}
      bind:springQty={cwtSpringQty}
      bind:style={cwtStyle}
      bind:o_compression={o_cwtCompression}
      bind:o_springQty={o_cwtSpringQty}
      grossLoad={cwtGrossLoad}
      {metric}
      {ratedSpeed}
   />
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
