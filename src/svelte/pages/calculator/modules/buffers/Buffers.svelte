<script>
   import { onDestroy } from 'svelte';

   import { deepMerge } from 'lib/main.mjs';
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
         buffers: {
            car: {
               compression: carCompression,
               style: carStyle,
            },
            counterweight: {
               compression: cwtCompression,
               height: cwtHeight,
               style: cwtStyle,
            },
            tripSpeed: carTripSpeed, // Car should trip first
         },
         car: {
            weight: carWeight,
         },
         counterweight: {
            weight: cwtWeight,
         },
      };

      const moduleData = {
         speedDevice,
         car: {
            bufferQty: carBufferQty,
            oilModel: carOilModel,
            spaceBelow: carSpaceBelow,
            springModel: carSpringModel,
            springQty: carSpringQty,
            o_compression: o_carCompression,
            o_springQty: o_carSpringQty,
         },
         counterweight: {
            bufferQty: cwtBufferQty,
            oilModel: cwtOilModel,
            spaceBelow: cwtSpaceBelow,
            springModel: cwtSpringModel,
            springQty: cwtSpringQty,
            o_compression: o_cwtCompression,
            o_springQty: o_cwtSpringQty,
         },
         terminalSpeed,
      };

      // project.globals = { ...project.globals, ...globalData };
      project.globals = deepMerge(project.globals, globalData);
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
   let terminalSpeed = module?.terminalSpeed ?? 0;

   // - Location Specific
   // -- Car
   let carBufferQty = module?.car?.bufferQty ?? 1;
   let carCompression = module?.car?.compression ?? 0;
   let carOilModel = module?.car?.oilModel ?? '500';
   let carSpaceBelow = module?.car?.spaceBelow ?? false;
   let carSpringModel = module?.car?.springModel ?? '400-008';
   let carSpringQty = module?.car?.springQty ?? 1;
   let carStyle = module?.car?.style ?? 'Spring';

   let o_carCompression = module?.car?.o_compression ?? false;
   let o_carSpringQty = module?.car?.o_springQty ?? false;

   // -- Cwt
   let cwtBufferQty = module?.counterweight?.bufferQty ?? 1;
   let cwtCompression = module?.counterweight?.compression ?? 0;
   let cwtOilModel = module?.counterweight?.oilModel ?? '500';
   let cwtSpaceBelow = module?.counterweight?.spaceBelow ?? false;
   let cwtSpringModel = module?.counterweight?.springModel ?? '400-008';
   let cwtSpringQty = module?.counterweight?.springQty ?? 1;
   let cwtStyle = module?.counterweight?.style ?? 'Spring';

   let o_cwtCompression = module?.counterweight?.o_compression ?? false;
   let o_cwtSpringQty = module?.counterweight?.o_springQty ?? false;

   // - Calculated
   let carHeight = 0;
   let cwtHeight = 0;
   let carTripSpeed = 0;
   let cwtTripSpeed = 0;

   // - UI
   let cwtWeightDisplay = false;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (!Links.get('carWeight') && !Links.get('cwtWeight')) {
      cwtWeight = round(carWeight * capacity * counterbalance);
      cwtWeightDisplay = true;
   }

   $: if (!speedDevice) terminalSpeed = speed;

   $: carGrossLoad = round(carWeight + capacity, 2);
   $: cwtGrossLoad = cwtWeight;

   // Events
   // Lifecycle
   onDestroy(() => {
      updateModule();
   });
</script>

<div class="flex-row">
   <Fieldset title="Car Properties">
      <InputNumber bind:value={carWeight} label="Car Weight" link={Links.get('carWeight')} {metric} step="0.01" type="weight" />

      <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} type="weight" />
   </Fieldset>

   <Fieldset title="Counterweight Properties">
      <InputNumber bind:value={cwtWeight} label="Counterweight" link={Links.get('cwtWeight')} {metric} readonly={cwtWeightDisplay} step="0.01" type="weight" />
   </Fieldset>
</div>

<div class="flex-row">
   <Fieldset title="Properties">
      <Checkbox bind:checked={speedDevice} label="Terminal Speed Reducing Device" />

      {#if speedDevice}
         <InputNumber bind:value={terminalSpeed} label="Reduced Speed" max={speed} {metric} type="speed">
            <svelte:fragment slot="helperText">
               <HelperText>Speed must be between 0 and {speed}</HelperText>
            </svelte:fragment>
         </InputNumber>
      {/if}
   </Fieldset>
</div>

<div class="flex-row">
   <BufferInput
      title="Car"
      bind:bufferQty={carBufferQty}
      bind:compression={carCompression}
      bind:height={carHeight}
      bind:oilModel={carOilModel}
      bind:spaceBelow={carSpaceBelow}
      bind:springModel={carSpringModel}
      bind:springQty={carSpringQty}
      bind:style={carStyle}
      bind:tripSpeed={carTripSpeed}
      bind:o_compression={o_carCompression}
      bind:o_springQty={o_carSpringQty}
      grossLoad={carGrossLoad}
      {metric}
      {terminalSpeed}
   />

   <BufferInput
      title="Counterweight"
      bind:bufferQty={cwtBufferQty}
      bind:compression={cwtCompression}
      bind:height={cwtHeight}
      bind:oilModel={cwtOilModel}
      bind:spaceBelow={cwtSpaceBelow}
      bind:springModel={cwtSpringModel}
      bind:springQty={cwtSpringQty}
      bind:style={cwtStyle}
      bind:tripSpeed={cwtTripSpeed}
      bind:o_compression={o_cwtCompression}
      bind:o_springQty={o_cwtSpringQty}
      grossLoad={cwtGrossLoad}
      {metric}
      {terminalSpeed}
   />
</div>

<style>
</style>
