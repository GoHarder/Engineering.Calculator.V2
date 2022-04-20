<script>
   import * as gTables from '../tables';
   import { RailBracketLinks as Links } from '../links';

   // Components
   import { Fieldset } from 'components/common';
   import { Input, InputNumber, InputLength } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {};

   // Methods
   // Constants
   const { globals, modules, metric } = project;
   const { capacity, loading } = globals;
   const { type: loadingType, freight: freightClass } = loading;

   Links.setProject(modules);

   const freightClassFormulas = gTables.freightClasses.find((fClass) => fClass.name === freightClass);
   const { loadingR1: lR1, loadingR2: lR2, runningR1: rR1, runningR2: rR2 } = freightClassFormulas;
   const loadingValue = `${loadingType} ${freightClass}`.replace(/\sNone/, '');

   console.log(globals);

   // Variables
   // - Globals
   let cabWidth = globals?.cab?.width ?? 0;

   let carRailSize = globals?.car?.railSize ?? '15#';

   let cwtRailSize = globals?.counterweight?.railSize ?? '8#';

   let platformDepth = globals?.platform?.depth ?? 0;
   let platformFrontToRail = globals?.platform?.frontToRail ?? 0;

   let cenToCenOfShoes = globals?.sling?.cenToCenOfShoes ?? 0;
   let safetyType = globals?.sling?.safetyType ?? 'B';

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: platformBackToRail = platformDepth - platformFrontToRail;
   $: platformDimA = Math.max(platformFrontToRail, platformBackToRail);

   // - Rail Loads
   $: loadingR1 = lR1(capacity, cabWidth, cenToCenOfShoes);
   $: loadingR2 = lR2(capacity, platformDimA, cenToCenOfShoes);
   $: runningR1 = rR1(capacity, cabWidth, cenToCenOfShoes);
   $: runningR2 = rR2(capacity, platformDimA, cenToCenOfShoes);
   $: safetyR1 = runningR1 * (safetyType === 'A' ? 4 : 2);
   $: safetyR2 = runningR2 * (safetyType === 'A' ? 4 : 2);

   // Events
   // Lifecycle
</script>

<div class="container">
   <Fieldset title="Globals">
      <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} type="weight" />

      <Input value={loadingValue} label="Loading" link="/Project/Requirements" />
   </Fieldset>

   <Fieldset title="Platform">
      <InputLength bind:value={cabWidth} label="Cab Width" link={Links.get('cabWidth')} {metric} />

      <InputLength bind:value={platformDepth} label="Platform Depth" link={Links.get('platformDepth')} {metric} />

      <InputLength bind:value={platformFrontToRail} label="Platform Front To Rail" link={Links.get('platformFrontToRail')} {metric} />
   </Fieldset>

   <Fieldset title="Sling">
      <InputLength bind:value={cenToCenOfShoes} label="Center To Center Of Shoes" link={Links.get('cenToCenOfShoes')} {metric} />

      <Select bind:value={safetyType} label="Safety Type" link={Links.get('cenToCenOfShoes')}>
         <Option value="A">A</Option>
         <Option value="B">B</Option>
      </Select>
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
