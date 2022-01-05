<script>
   import { onDestroy } from 'svelte';

   import { clone } from 'lib/main.mjs';
   import { ceil, floor, round, roundInc } from 'lib/math.mjs';

   import { CounterweightLinks as Links } from '../links';

   // Components
   import { Fieldset, InputImg, RopesInput, SafetyInput, StockStatusOptions, ShoeInput } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, Input, InputNumber, InputLength } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {};

      const moduleData = {};

      project.globals = { ...project.globals, ...globalData };
      project.modules.sling = moduleData;
   };

   // Methods
   // Constants
   const { globals, modules, metric } = project;
   const { capacity, counterbalance, loading, roping, speed } = globals;

   Links.setProject(modules);

   console.log(project);

   // Variables
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
   <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} type="weight" />

   <InputNumber value={counterbalance * 100} label="Counterbalance" link="/Project/Requirements" suffix="%" />

   <Input value="{roping}:1" label="Roping" link="/Project/Requirements" />
</Fieldset>

<style>
</style>
