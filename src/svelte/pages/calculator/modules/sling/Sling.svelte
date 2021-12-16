<script>
   import { onDestroy } from 'svelte';

   import { SlingLinks } from '../links';

   // Components
   import { Fieldset } from 'components/common';
   import { Input, InputNumber, InputLength } from 'components/material/input';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      console.log('Update Sling Module');
   };

   // Methods
   // Constants
   const { globals, modules, metric } = project;
   const { capacity, loading, roping, speed } = globals;
   const { type: loadingType, freight: freightClass } = loading;
   SlingLinks.setProject(modules);

   const loadingValue = `${loadingType} ${freightClass}`.replace(/\sNone/, '');

   // Variables
   // - Saved
   let platformThickness = globals?.platform?.thickness ?? 0;
   let platformWeight = 0;

   console.log(project);
   console.log(SlingLinks);

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
   <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} readonly type="weight" />

   <InputNumber value={speed} label="Car Speed" link="/Project/Requirements" {metric} readonly type="speed" />

   <Input value={loadingValue} label="Loading" link="/Project/Requirements" readonly />

   <Input value="{roping}:1" label="Roping" link="/Project/Requirements" readonly />
</Fieldset>

<Fieldset title="Platform">
   <InputLength bind:value={platformThickness} label="Thickness" {metric} readonly />

   <InputNumber bind:value={platformWeight} label="Weight" {metric} readonly />
</Fieldset>

<style>
</style>
