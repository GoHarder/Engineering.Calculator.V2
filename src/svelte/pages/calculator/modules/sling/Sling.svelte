<script>
   import { onDestroy } from 'svelte';

   import { SlingLinks } from '../links';

   import * as gTables from '../tables';

   // Components
   import { Fieldset, ShoeInput } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { Input, InputNumber, InputLength } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

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
   const { sling: module } = modules;

   SlingLinks.setProject(modules);

   const loadingValue = `${loadingType} ${freightClass}`.replace(/\sNone/, '');

   console.log(globals);

   // Variables
   // - Saved
   let platformThickness = globals?.platform?.thickness ?? 0;
   let platformWeight = globals?.platform?.weight ?? 0;

   let door1Weight = globals?.doors?.door1?.weight ?? 0;
   let door2Weight = globals?.doors?.door2?.weight ?? 0;

   let railSize = '15#';

   // -- Equipment
   let carTopWeight = 150;
   let doorOperatorWeight = door2Weight ? 300 : 150;
   let miscEquipmentWeight = 200;
   let railLock = false;

   // - Shoe
   let shoeModel = 'Other';
   let shoeHeight = 0;
   let shoeWeight = 0;

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
   <InputLength bind:value={platformThickness} label="Thickness" link={SlingLinks.get('platformThickness')} {metric} />

   <InputNumber bind:value={platformWeight} label="Weight" link={SlingLinks.get('platformWeight')} {metric} step="0.1" />
</Fieldset>

<Fieldset title="Equipment">
   <InputNumber bind:value={carTopWeight} label="Car Top Weight" {metric} type="weight" />

   <InputNumber bind:value={doorOperatorWeight} label="Door Operator Weight" {metric} type="weight" />

   <InputNumber bind:value={miscEquipmentWeight} label="Misc. Equipment Weight" {metric} type="weight" />

   <!-- <InputWeight
      bind:invalid={balanceWeightError}
      bind:value={balanceWeight}
      bind:override={balanceWeightOverride}
      calc={balanceWeightCalc}
      helperText={`Max Balance Weights ${round(rowBalanceWeight * 2, 2)}lbs`}
      label="Balance Weight"
      reset
      step={0.01}
      {metric}
   /> -->

   <!-- <Input value={ceil(balanceWeight / rowBalanceWeight)} display label="Balance Weight Rows" type="number" /> -->

   {#if ['12#', '15#'].includes(railSize)}
      <Checkbox bind:checked={railLock} label="Rail Locks" />
   {/if}

   <ShoeInput bind:height={shoeHeight} bind:model={shoeModel} bind:weight={shoeWeight} {capacity} {railSize} {speed} />

   <!-- <SelectSafety bind:safety bind:safetyHeight bind:safetyModel bind:safetyWeight {metric} railSize={carRailSize} {safeties} /> -->

   <!-- <InputWeight value={carWeight} display label="Car Weight" {metric} /> -->
</Fieldset>

<Fieldset title="Properties">
   <!-- <Select bind:value={slingModel} label="Model">
      {#each slingModelOptions as { disabled, text } (text)}
         <Option {disabled} {text} selected={slingModel === text} />
      {/each}
   </Select> -->

   <!-- <Checkbox bind:checked={apta} on:link={onLink} link={{ cmd: 'changeModule', location: SlingLinks.get('apta') }} label="APTA" /> -->

   <Select bind:value={railSize} label="Rail Size">
      {#each gTables.railSizes as { name } (name)}
         <Option value={name}>{name}</Option>
      {/each}
   </Select>

   <!-- <InputLength bind:value={carDBG} label="D.B.G." {metric} /> -->

   <!-- <InputLength bind:value={stilesBackToBack} bind:override={stilesBackToBackOverride} bind:calc={stilesBackToBackCalc} label="Back to Back of Stiles" reset {metric} /> -->

   <!-- <InputLength bind:value={underBeamHeight} label="Under Beam Height" {metric} /> -->

   <!-- <Select bind:value={compType} label="Compensation" on:link={onLink} link={{ cmd: 'changeModule', location: SlingLinks.get('compType') }}>
      {#each gTables.compensation as { name } (name)}
         <Option text={name} />
      {/each}
   </Select> -->

   <!-- <InputWeight value={slingWeight} display label="Total Weight" {metric} /> -->
</Fieldset>

<style>
</style>
