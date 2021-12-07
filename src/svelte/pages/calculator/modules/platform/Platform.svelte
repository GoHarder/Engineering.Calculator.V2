<script>
   import { onDestroy } from 'svelte';

   // Components
   import { Fieldset } from 'components/common';
   import { Input, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      const moduleData = {
         material,
      };

      project.modules.platform = { ...project.modules.platform, ...moduleData };
   };

   // Methods
   // Constants
   const { globals, modules, metric } = project;
   const { capacity, loading } = globals;
   const { type: loadingType, freight: freightClass } = loading;
   const { platform: module } = modules;

   const loadingValue = `${loadingType} ${freightClass}`.replace(/\sNone/, '');

   // Variables
   let material = module?.material ?? 'Wood';

   // console.log(project);

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
   onDestroy(() => {
      updateModule();
   });
</script>

<Fieldset title="Globals">
   <InputNumber value={capacity} label="Capacity" type="weight" link="/Project/Requirements" readonly {metric} />
   <Input value={loadingValue} label="Loading" link="/Project/Requirements" readonly />
</Fieldset>

<Fieldset title="Properties">
   <Select bind:value={material} label="Material">
      <Option value="Wood">Wood</Option>
      <Option value="Steel">Steel</Option>
   </Select>
</Fieldset>

<style>
</style>
