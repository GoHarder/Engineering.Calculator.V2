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
      const globalData = {};

      const moduleData = {};

      project.globals = { ...project.globals, ...globalData };
      project.modules.buffers = moduleData;
   };

   // Methods
   // Constants
   const { globals, modules, metric } = project;
   const { capacity, speed } = globals;
   Links.setProject(modules);

   console.log(project);

   // Variables
   // - Globals
   let carWeight = globals?.car?.weight ?? 0;
   let cwtWeight = globals?.counterweight?.weight ?? 0;

   // NOTE: For Convenience
   let speedDevice = false;
   let ratedSpeed = 0;
   let cwtWeightDisplay = false;

   let car = {
      style: 'Oil',
   };

   let counterweight = {
      style: 'Oil',
   };

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

<Fieldset title="Car Properties">
   <InputNumber bind:value={carWeight} label="Car Weight" link={Links.get('carWeight')} {metric} type="weight" />

   <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} type="weight" />
</Fieldset>

<Fieldset title="Counterweight Properties">
   <InputNumber bind:value={cwtWeight} label="Counterweight" link={Links.get('cwtWeight')} {metric} readonly={cwtWeightDisplay} type="weight" />
</Fieldset>

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

<BufferInput title="Car" grossLoad={carGrossLoad} {metric} {ratedSpeed} />
<BufferInput title="Counterweight" grossLoad={cwtGrossLoad} {metric} {ratedSpeed} />

<style>
</style>
