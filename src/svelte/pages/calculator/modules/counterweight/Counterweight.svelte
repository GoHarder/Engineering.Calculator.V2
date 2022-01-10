<script>
   import { onDestroy, onMount } from 'svelte';

   import { clone } from 'lib/main.mjs';
   import { ceil, floor, round, roundInc } from 'lib/math.mjs';

   import * as gTables from '../tables';
   import * as tables from './tables';
   import { CounterweightLinks as Links } from '../links';

   // Components
   import { DataList, Fieldset, InputImg, RopesInput, SafetyInput, StockStatusOptions, ShoeInput } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, Input, InputNumber, InputLength } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {};

      const moduleData = {
         model: cwtModel,
         equipment: {
            safety: {
               model: safetyModel,
            },
            shoe: {
               model: shoeModel,
            },
         },
      };

      project.globals = { ...project.globals, ...globalData };
      project.modules.counterweight = moduleData;
   };

   // Methods
   const getEngineeringData = async () => {
      const token = localStorage.getItem('token');

      // Run fetch
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/counterweight?speed=${speed}&capacity=${capacity}&roping=${roping}`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         cwtModels = [...body.models];
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   const getShoePlate = (shoePlates, shoe, mounting, railSize) => {
      let output = {
         weight: 5,
         thickness: 0.75,
      };

      if (shoePlates) {
         const plate = [...shoePlates].find((plate) => plate.shoes.includes(shoe));
         const mountsTo = plate?.mountsTo.find((nth) => nth.products.includes(mounting));
         const variant = mountsTo?.variants.find((nth) => nth.railSizes.includes(railSize));

         output = {
            weight: variant?.weight ?? 5,
            thickness: variant?.thickness ?? 0.75,
         };
      }

      return output;
   };

   // Constants
   const { globals, modules, metric } = project;
   const { capacity, counterbalance, loading, roping, seismic, speed } = globals;
   const { zone: seismicZone } = seismic;
   const { counterweight: module } = modules;
   Links.setProject(modules);

   console.log(project);
   // console.log(Links);

   // Variables

   // - Globals
   let carWeight = globals?.car?.weight ?? 0;
   let compType = globals?.compensation?.type ?? 'None';

   // -- Ropes
   let ropePitch = globals?.rope?.pitch ?? 0;
   let ropeSize = globals?.rope?.size ?? 0.375;
   let ropeQty = globals?.rope?.qty ?? 4;
   let o_ropePitch = globals?.rope?.o_pitch ?? false;

   // NOTE: unorganized here for convenience
   let sheaveModel = '';
   let sheaveOptions = [];
   let sheaveHangerModel = '';
   let cwtModel = module?.model ?? '';
   let sheaveHangerOptions = [];
   let dbg = 38.75;
   let weightWidth = 8;
   let railSize = '8#';
   let lead = false;
   let cwtWeight = 0;
   let useShoePlates = false;
   let safetySpacers = false;
   let blockQty = 0;
   let bufferPlate = false;
   let isStriker = true;
   let disableSafetySpacers = false;
   let sheaveHeight = 0;
   let gap = 24;
   let o_gap = false;
   let gapCalc = 24;
   let minGap = 16;
   let stackHeight = 0;
   let o_stackHeight = false;
   let stileChannel = '';

   let modelObj;
   let stileChannelObj;

   // -- Equipment

   // --- Safety
   let safetyHeight = module?.equipment?.safety?.height ?? 0;
   let safetyModel = module?.equipment?.safety?.model ?? 'None';
   let safetyWeight = module?.equipment?.safety?.weight ?? 0;

   // --- Shoe
   let shoeHeight = module?.equipment?.shoe?.height ?? 0;
   let shoeModel = module?.equipment?.shoe?.model ?? 'Other';
   let shoeWeight = module?.equipment?.shoe?.weight ?? 0;

   // - Database
   let cwtModels = [];
   let shoePlates = [];

   // Subscriptions
   // Contexts
   // Reactive Rules

   $: if (seismicZone >= 2) useShoePlates = true;

   $: modelOptions = clone(cwtModels).map((model) => {
      const row = tables.models[`_${model.name}`];

      const dbgCheck = row.dbg ? row.dbg !== dbg : false;
      const compCheck = model.comp.includes(compType);
      const modelCheck = row?.modelCheck(dbg + model.channelOffset, cwtWeight, model.crosshead.channel.modulusX);

      model.disabled = [dbgCheck, !compCheck, !modelCheck].some((test) => test);

      return model;
   });

   $: console.table(modelOptions);
   $: console.table(cwtModels);

   $: imgSearchString = [
      cwtModel.match(/\d{3}/)[0],
      roping > 1 && cwtModel !== '236' ? `-${sheaveHangerModel}` : '',
      blockQty > 0 ? '-block' : '',
      bufferPlate ? '-plate' : '',
      safetyModel !== 'None' ? '-safety' : '',
   ].join('');

   $: imgString = tables.dimensionImages.find((row) => row.name === imgSearchString).name || '230';

   // - Weight Calcs
   $: channelLength = roundInc(dbg + (modelObj?.channelOffset ?? 0));
   $: topChanHeight = modelObj?.crosshead?.channel.depth ?? 0;
   $: topChanWeight = ((modelObj?.crosshead?.channel.weight ?? 0) * channelLength + (modelObj?.crosshead?.gusset?.weight ?? 0)) * 2;
   $: botChanHeight = modelObj?.plank?.depth ?? 0;
   $: botChanWeight = (modelObj?.plank?.weight ?? 0) * channelLength * 2;

   // NOTE: That last number is stile depth plug that in
   $: steelFillerWeight = tables.models[`_${cwtModel}`]?.fillerWeight(dbg, weightWidth, 0.284, 8) ?? 0;
   $: leadFillerWeight = tables.models[`_${cwtModel}`]?.fillerWeight(dbg, weightWidth, 0.4096, 8) ?? 0;

   $: topShoePlate = getShoePlate(shoePlates, shoeModel, cwtModel, railSize);
   $: bottomShoePlate = getShoePlate(shoePlates, shoeModel, safetyModel !== 'None' ? safetyModel : cwtModel, railSize);

   $: miscWeight = modelObj?.miscWeight?.(cwtDBG) ?? 0;

   $: cwtWeight = round(carWeight + capacity * counterbalance, 2);

   // Events
   // Lifecycle
   onMount(() => {
      getEngineeringData();
   });

   onDestroy(() => {
      updateModule();
   });
</script>

<Fieldset title="Globals">
   <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} type="weight" />

   <InputNumber value={counterbalance * 100} label="Counterbalance" link="/Project/Requirements" suffix="%" />

   <Input value="{roping}:1" label="Roping" link="/Project/Requirements" />
</Fieldset>

<Fieldset title="Sling">
   <InputNumber bind:value={carWeight} label="Car Weight" link={Links.get('carWeight')} {metric} step={0.01} type="weight" />

   <Select bind:value={compType} label="Compensation" link={Links.get('compType')}>
      {#each gTables.compensation as { name } (name)}
         <Option value={name}>{name}</Option>
      {/each}
   </Select>
</Fieldset>

{#if roping > 1}
   <RopesInput bind:pitch={ropePitch} bind:size={ropeSize} bind:qty={ropeQty} bind:o_pitch={o_ropePitch} link={Links.get('ropeSize')} {metric} />

   <Fieldset title="Sheave">
      <Select bind:value={sheaveModel} label="Model">
         {#each sheaveOptions as { value, text, valid } (value)}
            <Option {value} {text} disabled={!valid} selected={sheaveModel === value} />
         {/each}
      </Select>

      {#if cwtModel !== '236'}
         <Select bind:value={sheaveHangerModel} label="Hanger Model">
            {#each sheaveHangerOptions as text (text)}
               <Option {text} />
            {/each}
         </Select>
      {/if}
   </Fieldset>
{/if}

<Fieldset title="Properties">
   <Select bind:value={cwtModel} bind:selected={modelObj} label="Model" options={modelOptions}>
      {#each modelOptions as { name, disabled } (name)}
         <Option value={name} {disabled}>{name}</Option>
      {/each}
   </Select>

   <InputLength bind:value={dbg} label="D.B.G." {metric}>
      <svelte:fragment slot="datalist" let:focused let:onChange>
         <DataList {focused} {onChange} let:onClick>
            <Option on:click={onClick} value="30.125">2' - 6.125"</Option>
            <Option on:click={onClick} value="38.75">3' - 2.75"</Option>
            <Option on:click={onClick} value="57.25">4' - 9.25</Option>
         </DataList>
      </svelte:fragment>
   </InputLength>

   <InputLength bind:value={weightWidth} label="Filler Weight Width" {metric}>
      <svelte:fragment slot="datalist" let:focused let:onChange>
         <DataList {focused} {onChange} let:onClick>
            <Option on:click={onClick} value="6">6"</Option>
            <Option on:click={onClick} value="8">8"</Option>
            <Option on:click={onClick} value="10">10"</Option>
         </DataList>
      </svelte:fragment>
   </InputLength>

   <Select bind:value={railSize} label="Rail Size">
      {#each gTables.railSizes as { name } (name)}
         <Option value={name}>{name}</Option>
      {/each}
   </Select>

   {#if ['235', '236'].includes(cwtModel)}
      <Select bind:value={stileChannel} bind:selected={stileChannelObj} label="Stile Channel" options={tables.stile235}>
         {#each tables.stile235 as { name } (name)}
            <Option value={name}>{name}</Option>
         {/each}
      </Select>
   {/if}

   <Checkbox bind:checked={lead} label="Lead Weights" />

   <InputNumber value={cwtWeight} label="Total Weight" {metric} readonly type="weight" />
</Fieldset>

<Fieldset title="Equipment">
   <ShoeInput bind:height={shoeHeight} bind:model={shoeModel} bind:weight={shoeWeight} {capacity} {railSize} {speed} />

   <SafetyInput bind:height={safetyHeight} bind:model={safetyModel} bind:weight={safetyWeight} optional {railSize} {speed} />

   <Checkbox bind:checked={useShoePlates} disabled={seismicZone >= 2} label="Shoe Plates" />

   {#if compType !== 'Rope'}
      {#if safetyModel !== 'None'}
         <Checkbox bind:checked={safetySpacers} disabled={disableSafetySpacers} label="Safety Spacers" />
      {:else}
         {#if !bufferPlate}
            <Select bind:value={blockQty} label={`${isStriker ? 'Striker' : 'Knock Off'} Block Quantity`} type="number">
               <Option value="0">0</Option>
               <Option value="1">1</Option>
               <Option value="2">2</Option>
               <Option value="3">3</Option>
            </Select>
         {/if}

         {#if blockQty === 0}
            <Checkbox bind:checked={bufferPlate} disabled={['235', '236'].includes(cwtModel)} label="Buffer Plate" />
         {:else}
            <Select bind:value={isStriker} label="Block Type" type="boolean">
               <Option value="false">Knock Off</Option>
               <Option value="true">Striker</Option>
            </Select>
         {/if}
      {/if}
   {/if}
</Fieldset>

<Fieldset title="Dimensions">
   {#if roping > 1 && cwtModel !== '236'}
      <InputLength bind:value={sheaveHeight} label="Sheave" />
   {/if}

   <InputLength value={topChanHeight} label="Top Channel" readonly {metric} />

   <!-- <InputLength
   bind:value={gap}
   bind:override={o_gap}
   calc={gapCalc}
   helperText={`Gap must be at least ${floor(minGap / 12)}'-${round(minGap % 12, 4)}"`}
   invalid={gap < minGap - 0.0001}
   label="Gap"
   reset
   {metric}
/> -->

   <InputLength bind:value={gap} bind:override={o_gap} label="Gap" calc={gapCalc} invalid={gap < minGap - 0.0001} {metric}>
      <svelte:fragment slot="helperText">
         <HelperText validation>Gap must be at least {floor(minGap / 12)}'-{round(minGap % 12, 4)}"</HelperText>
      </svelte:fragment>
   </InputLength>

   {#if !lead}
      <InputLength value={stackHeight} label="Weight Stack" readonly {metric} />
   {:else}
      <!-- <InputLength
      bind:value={stackHeight}
      bind:override={stackHeightOverride}
      calc={stackHeightCalc}
      helperText={`Stack is shorter than ${floor(stackHeightCalc / 12)}'-${round(stackHeightCalc % 12, 4)}"`}
      invalid={stackHeight < stackHeightCalc}
      label="Weight Stack"
      reset
      {metric}
   /> -->

      <!-- <InputLength value={steelStackHeight} display label="Steel Weight Stack" {metric} /> -->
      <!-- <InputLength value={leadStackHeight} display label="Lead Weight Stack" {metric} /> -->
   {/if}

   <!-- <InputLength value={plankHeight} display label="Bottom Channel" {metric} /> -->

   {#if safetyModel !== 'None' || bufferPlate || blockQty > 0}
      <!-- <InputLength value={bottomEquipHeight} display label={bottomEquipHeightString} {metric} /> -->
   {/if}

   <!-- <InputLength value={cwtHeight} display label="Overall Height" {metric} /> -->

   <img src="/public/img/counterweight/{imgString}.svg" alt="Counterweight Dimensions" />
</Fieldset>

<style>
</style>
