<script>
   import * as gTables from '../../pages/calculator/modules/tables';

   // Components
   import Fieldset from 'components/common/Fieldset.svelte';
   import { InputLength, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   // Properties
   export let link = '';
   export let metric = false;
   export let pitch = 0;
   export let size = 0.375;
   export let qty = 0;

   export let o_pitch = false;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: pitchCalc = size + 0.25;

   // Events
   // Lifecycle
</script>

<Fieldset title="Ropes">
   <InputNumber bind:value={qty} label="Quantity" {link} min="4" />

   <Select bind:value={size} label="Size" {link} type="number">
      {#each gTables.ropeSizes as { name, value } (name)}
         <Option {value}>{name}</Option>
      {/each}
   </Select>

   <InputLength bind:value={pitch} bind:override={o_pitch} label="Pitch" calc={pitchCalc} {link} {metric} />
</Fieldset>

<style>
</style>
