<script>
   import { round } from 'lib/math.mjs';

   // Components
   import { InputLength, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   // Properties
   export let height = 0;
   export let metric = false;
   export let thickness = 0;
   export let toeGuardWeight = 0;
   export let type = 'Single Speed';
   export let weight = 0;
   export let width = 0;

   export let o_toeGuardWeight = false;
   export let o_weight = false;

   // Methods
   const getToeGuardWeightCalc = (doorWidth) => {
      const width = doorWidth - 4;
      const sheetQty = width > 78 ? 2 : 1;
      const sheetWidth = width / sheetQty;
      const braceQty = sheetWidth <= 56 ? 3 : 4;
      const braceWeight = 19.12 * braceQty * sheetQty;
      const mountingWeight = 4.41 * braceQty * sheetQty;
      const sheetWeight = 0.1617 * width;

      return round(braceWeight + mountingWeight + sheetWeight, 2);
   };

   // Constants
   const doorTypes = [
      { name: 'Single Speed', thickness: 7 },
      { name: 'Two Speed', thickness: 9 },
      { name: 'Three Speed', thickness: 9 },
      { name: 'Gate', thickness: 3 },
   ];

   // Variables
   let doorTypeObj = {};

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: thickness = doorTypeObj?.thickness ?? 0;

   $: doorWeightCalc = round(width * 7.167);

   $: toeGuardWeightCalc = getToeGuardWeightCalc(width);

   // Events
   // Lifecycles
</script>

<Select bind:value={type} bind:selected={doorTypeObj} label="Type" {metric} options={doorTypes}>
   {#each doorTypes as { name } (name)}
      <Option value={name}>{name}</Option>
   {/each}
</Select>

<InputLength bind:value={width} label="Width" {metric} />

<InputLength bind:value={height} label="Height" {metric} />

<InputNumber bind:value={weight} bind:override={o_weight} label="Weight" calc={doorWeightCalc} {metric} type="weight" />

<InputNumber bind:value={toeGuardWeight} bind:override={o_toeGuardWeight} label="Toe Guard Weight" calc={toeGuardWeightCalc} {metric} step="0.01" type="weight" />

<style>
</style>
