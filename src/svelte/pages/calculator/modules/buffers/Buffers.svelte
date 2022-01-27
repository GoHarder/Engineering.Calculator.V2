<script>
   import { onDestroy } from 'svelte';

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
            },
            counterweight: {
               compression: cwtCompression,
            },
         },
         car: {
            weight: carWeight,
         },
         counterweight: {
            weight: cwtWeight,
         },
         terminalSpeed,
      };

      const moduleData = {
         speedDevice,
         car: {
            bufferQty: carBufferQty,
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
         <InputNumber bind:value={terminalSpeed} label="Reduced Speed" max={speed} {metric} type="speed">
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
      {terminalSpeed}
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
      {terminalSpeed}
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
