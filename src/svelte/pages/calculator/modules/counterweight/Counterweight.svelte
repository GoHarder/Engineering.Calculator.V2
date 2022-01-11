<script>
   import { onDestroy, onMount } from 'svelte';

   import { clone } from 'lib/main.mjs';
   import { ceil, floor, round, roundInc } from 'lib/math.mjs';

   import * as gTables from '../tables';
   import * as tables from './tables';
   import { CounterweightLinks as Links } from '../links';

   // Components
   import { DataList, Fieldset, RopesInput, SafetyInput, ShoeInput } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, Input, InputNumber, InputLength } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {
         car: {
            weight: carWeight,
         },
         compensation: {
            type: compType,
         },
         counterweight: {
            weight: cwtWeight,
         },
         rope: {
            pitch: ropePitch,
            size: ropeSize,
            qty: ropeQty,
            o_pitch: o_ropePitch,
         },
      };

      const moduleData = {
         dbg,
         gap,
         equipment: {
            blockQty,
            bufferPlate,
            isStriker,

            safety: {
               model: safetyModel,
               height: safetyHeight,
               weight: safetyWeight,
               spacers: safetySpacers,
            },
            sheave: {
               model: sheaveModel,
               height: sheaveHeight,
               hangerModel: sheaveHangerModel,
            },
            shoe: {
               model: shoeModel,

               height: shoeHeight,

               weight: shoeWeight,
               useShoePlates,
            },
         },
         lead,
         model: cwtModel,
         railSize,
         stackHeight,
         stileChannel,
         weightWidth,
         o_gap,
         o_stackHeight,
      };

      if (roping === 1) delete moduleData.equipment.sheave;

      if (safetyModel !== 'Other') {
         delete moduleData.equipment.safety.height;
         delete moduleData.equipment.safety.weight;
      }

      if (shoeModel !== 'Other') {
         delete moduleData.equipment.shoe.height;
         delete moduleData.equipment.shoe.weight;
      }

      if (safetyModel === 'None') delete moduleData.equipment.safety;

      if (!lead) {
         delete moduleData.stackHeight;
         delete moduleData.o_stackHeight;
      }

      if (!['235', '236'].includes(cwtModel)) delete moduleData.stileChannel;

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
         sheaves = [...body.sheaves];
         shoePlates = [...body.shoePlates];
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

   // Variables

   // - Globals
   let carWeight = globals?.car?.weight ?? 0;
   let compType = globals?.compensation?.type ?? 'None';

   // -- Ropes
   let ropePitch = globals?.rope?.pitch ?? 0;
   let ropeSize = globals?.rope?.size ?? 0.375;
   let ropeQty = globals?.rope?.qty ?? 4;
   let o_ropePitch = globals?.rope?.o_pitch ?? false;

   // - General
   let cwtModel = module?.model ?? '230';
   let dbg = module?.dbg ?? 38.75;
   let gap = module?.gap ?? 24;
   let lead = module?.lead ?? false;
   let railSize = module?.railSize ?? '8#';
   let stackHeight = module?.stackHeight ?? 0;
   let stileChannel = module?.stileChannel ?? 'MC8X22.8';
   let weightWidth = module?.weightWidth ?? 8;

   let o_gap = module?.o_gap ?? false;
   let o_stackHeight = module?.o_stackHeight ?? false;

   // -- Equipment

   // --- Safety
   let safetyHeight = module?.equipment?.safety?.height ?? 0;
   let safetyModel = module?.equipment?.safety?.model ?? 'None';
   let safetyWeight = module?.equipment?.safety?.weight ?? 0;
   let safetySpacers = module?.equipment?.safety?.spacers ?? false;

   // --- Sheave
   let sheaveHeight = module?.equipment?.sheave?.height ?? 0;
   let sheaveHangerModel = module?.equipment?.sheave?.hangerModel ?? '341';
   let sheaveModel = module?.equipment?.sheave?.model ?? '';

   // --- Shoe
   let shoeHeight = module?.equipment?.shoe?.height ?? 0;
   let shoeModel = module?.equipment?.shoe?.model ?? 'Other';
   let shoeWeight = module?.equipment?.shoe?.weight ?? 0;
   let useShoePlates = module?.equipment?.shoe?.useShoePlates ?? false;

   // --- Misc
   let blockQty = module?.equipment?.blockQty ?? 0;
   let bufferPlate = module?.equipment?.bufferPlate ?? false;
   let isStriker = module?.equipment?.isStriker ?? true;

   // - Calculated
   let botEquipHeight = 0;
   let botEquipWeight = 0;
   let botEquipHeightLabel = '';
   let disableSafetySpacers = false;

   // - Object
   let modelObj = {};
   let safetyObj = {};
   let stileChannelObj = {};
   let sheaveObj = {};
   let sheaveHangerObj = {};
   let shoeObj = {};

   // - Database
   let cwtModels = [];
   let shoePlates = [];
   let sheaves = [];

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (seismicZone >= 2) useShoePlates = true;

   $: if (!lead) stackHeight = ceil(stackWeight / steelSectionWeight);

   $: if (['235', '236'].includes(cwtModel) && safetyModel === 'None') {
      bufferPlate = true;
      botEquipHeightLabel = 'Plate';
      botEquipHeight = 1;
   }

   $: if (safetyObj?.cwt?.spacers) {
      disableSafetySpacers = true;
      safetySpacers = true;
      botEquipHeight = safety.cwt.extLength;
   } else {
      disableSafetySpacers = false;
      botEquipHeight = round(safetyHeight + (safetySpacers ? 6 : 0));
   }

   $: if (safetyModel !== 'None') {
      blockQty = 0;
      bufferPlate = false;

      botEquipWeight = safetyWeight + (safetySpacers ? block.weight * 2 : 0);
      botEquipHeightLabel = 'Extension Height';
   } else if (bufferPlate) {
      botEquipHeightLabel = 'Plate';
      botEquipHeight = 1;
      botEquipWeight = plateWeight;
   } else if (blockQty > 0) {
      botEquipHeightLabel = 'Block Height';
      botEquipHeight = blockQty * block.height;
      botEquipWeight = blockQty * block.weight;
   } else {
      botEquipHeight = 0;
      botEquipWeight = 0;
   }

   // - Option Arrays
   $: modelOptions = clone(cwtModels).map((model) => {
      const row = tables.models[`_${model.name}`];

      const dbgCheck = row.dbg ? row.dbg !== dbg : false;
      const compCheck = model.comp.includes(compType);
      const modelCheck = row?.modelCheck(dbg + model.channelOffset, cwtWeight, model.crosshead.channel.modulusX);

      model.disabled = [dbgCheck, !compCheck, !modelCheck].some((test) => test);

      return model;
   });

   $: sheaveOptions = clone(sheaves).map((sheave) => {
      const reqWidth = round((ropeQty - 1) * ropePitch + ropeSize + 0.625, 4);
      const reqDiameter = round(ropeSize * 40, 3);

      sheave.disabled = sheave.diameter < reqDiameter && sheave.rimWidth < reqWidth;
      sheave.displayName = `${sheave.name} (Ø${floor(sheave.diameter)}")`;

      return sheave;
   });

   $: sheaveHangerOptions = modelObj?.sheaveHangers ?? [];

   // - Dimension Image

   $: imgSearchString = [
      cwtModel.match(/\d{3}/)[0],
      roping > 1 && cwtModel !== '236' ? `-${sheaveHangerModel}` : '',
      blockQty > 0 ? '-block' : '',
      bufferPlate ? '-plate' : '',
      safetyModel !== 'None' ? '-safety' : '',
   ].join('');

   $: imgString = tables.dimensionImages.find((row) => row.name === imgSearchString)?.name || '230';

   // - Weight And  Height Calcs
   $: minGap = cwtModel !== '236' ? modelObj?.minGap ?? 0 : (sheaveObj?.diameter ?? 0) + 17;
   $: gapCalc = minGap > 24 ? minGap : 24;

   // - Steel
   $: channelLength = roundInc(dbg + (modelObj?.channelOffset ?? 0));
   $: topChanHeight = modelObj?.crosshead?.channel.depth ?? 0;
   $: topChanWeight = ((modelObj?.crosshead?.channel.weight ?? 0) * channelLength + (modelObj?.crosshead?.gusset?.weight ?? 0)) * 2;
   $: botChanHeight = modelObj?.plank?.depth ?? 0;
   $: botChanWeight = (modelObj?.plank?.weight ?? 0) * channelLength * 2;
   $: stileWeight = modelObj?.stileWeight ?? stileChannelObj.weight;

   // - Filler Weights
   $: steelFillerWeight = tables.models[`_${cwtModel}`]?.fillerWeight(dbg, weightWidth, 0.284, stileChannelObj?.depth ?? 8) ?? 0;
   $: leadFillerWeight = tables.models[`_${cwtModel}`]?.fillerWeight(dbg, weightWidth, 0.4096, stileChannelObj?.depth ?? 8) ?? 0;

   // - Shoe Plates
   $: topShoePlate = getShoePlate(shoePlates, shoeModel, cwtModel, railSize);
   $: botShoePlate = getShoePlate(shoePlates, shoeModel, safetyModel !== 'None' ? safetyModel : cwtModel, railSize);

   // - Sheave Hanger
   $: sheaveHangerPlateLength = topChanHeight + 3.5 - ((sheaveObj?.diameter ?? 1) / 2 + 5);
   $: sheaveHangerPlateWeight = sheaveHangerObj?.plateWeight?.(sheaveHangerPlateLength) ?? 0;
   $: sheaveHangerChannelWeight = sheaveHangerObj?.channel?.find((nth) => nth.stock).weight;
   $: sheaveHangerWeight = round(sheaveHangerObj.miscWeight + sheaveHangerChannelWeight + sheaveHangerPlateWeight * 2, 2);

   // - Rope Mounting
   $: sheaveAsmWeight = (cwtModel !== '236' ? sheaveHangerWeight : 0) + (sheaveObj?.weight ?? 0);
   $: hitchPlateWeight = modelObj?.hitchPlateWeight ?? 0;
   $: ropeMountingWeight = roping === 1 ? hitchPlateWeight : sheaveAsmWeight;

   // - Misc Parts
   $: plateLength = roundInc(dbg - ((shoeObj?.railToBack ?? 8) + 0.25), 0.25);
   $: plateWidth = round((modelObj?.stileGap ?? stileChannelObj.depth) + modelObj?.plank?.flangeWidth * 2);
   $: plateWeight = plateLength * plateWidth * 0.2836;

   $: block = tables.blocks.find((block) => block.striker === isStriker && block.depth <= weightWidth);

   $: miscWeight = modelObj?.miscWeight?.(dbg) ?? 0;

   // - Weight Calcs
   $: staticStyleWeight = (topChanHeight + botChanHeight + (modelObj?.stileOffset ?? 0)) * stileWeight;
   $: staticTieRodWeight = botChanHeight + (['235', '236'].includes(cwtModel) ? 0 : topChanHeight) + (modelObj?.tieRodOffset ?? 0);

   $: staticWeight =
      miscWeight +
      ropeMountingWeight +
      topChanWeight +
      shoeWeight * 4 +
      (useShoePlates ? topShoePlate.weight : 0) * 2 +
      (useShoePlates ? botShoePlate.weight : 0) * 2 +
      staticStyleWeight +
      staticTieRodWeight +
      botChanWeight +
      botEquipWeight;

   $: stileSectionWeight = round(stileWeight * 2, 2);
   $: gapSectionWeight = stileSectionWeight + 0.1742;
   $: steelSectionWeight = steelFillerWeight + gapSectionWeight;
   $: leadSectionWeight = leadFillerWeight + gapSectionWeight;

   $: gapWeight = ['235', '236'].includes(cwtModel) ? (gap - 12) * stileSectionWeight + 12 * gapSectionWeight : gap * gapSectionWeight;

   $: stackWeight = round(cwtWeight - (staticWeight + gapWeight), 2);

   $: stackHeightCalc = ceil(stackWeight / leadSectionWeight);

   $: steelStackHeight = o_stackHeight ? floor((stackWeight - leadSectionWeight * stackHeight) / (steelSectionWeight - leadSectionWeight)) : 0;
   $: leadStackHeight = stackHeight - steelStackHeight;

   $: cwtWeight = round(carWeight + capacity * counterbalance, 2);

   $: cwtHeight = roundInc(sheaveHeight + topChanHeight + gap + stackHeight + botChanHeight + botEquipHeight);

   // Events
   // Lifecycle
   onMount(() => {
      getEngineeringData();
   });

   onDestroy(() => {
      updateModule();
   });
</script>

<div class="container">
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
</div>

{#if roping > 1}
   <div class="container">
      <RopesInput bind:pitch={ropePitch} bind:size={ropeSize} bind:qty={ropeQty} bind:o_pitch={o_ropePitch} link={Links.get('ropeSize')} {metric} />

      <Fieldset title="Sheave">
         <Select bind:value={sheaveModel} bind:selected={sheaveObj} label="Model" options={sheaveOptions}>
            {#each sheaveOptions as { disabled, displayName, name } (name)}
               <Option value={name} {disabled}>{displayName}</Option>
            {/each}
         </Select>

         {#if cwtModel !== '236'}
            <Select bind:value={sheaveHangerModel} bind:selected={sheaveHangerObj} label="Hanger Model" options={sheaveHangerOptions}>
               {#each sheaveHangerOptions as name (name)}
                  <Option value={name}>{name}</Option>
               {/each}
            </Select>
         {/if}
      </Fieldset>
   </div>
{/if}

<div class="container">
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

      <InputNumber value={cwtWeight} label="Total Weight" {metric} readonly step="0.01" type="weight" />
   </Fieldset>

   <Fieldset title="Equipment">
      <ShoeInput bind:height={shoeHeight} bind:model={shoeModel} bind:weight={shoeWeight} bind:shoeObj {capacity} {railSize} {speed} />

      <SafetyInput bind:height={safetyHeight} bind:model={safetyModel} bind:weight={safetyWeight} bind:safetyObj optional {railSize} {speed} />

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
</div>

<div class="container">
   <Fieldset title="Dimensions">
      <div class="dimensions">
         <div>
            {#if roping > 1 && cwtModel !== '236'}
               <InputLength bind:value={sheaveHeight} label="Sheave" />
            {/if}

            <InputLength value={topChanHeight} label="Top Channel" readonly {metric} />

            <InputLength bind:value={gap} bind:override={o_gap} label="Gap" calc={gapCalc} invalid={gap < minGap - 0.0001} {metric}>
               <svelte:fragment slot="helperText">
                  <HelperText validation>Gap must be at least {floor(minGap / 12)}'-{round(minGap % 12, 4)}"</HelperText>
               </svelte:fragment>
            </InputLength>

            {#if !lead}
               <InputLength value={stackHeight} label="Weight Stack" readonly {metric} />
            {:else}
               <InputLength
                  bind:value={stackHeight}
                  bind:override={o_stackHeight}
                  label="Weight Stack"
                  calc={stackHeightCalc}
                  invalid={stackHeight < stackHeightCalc}
                  {metric}
               >
                  <svelte:fragment slot="helperText">
                     <HelperText validation>Stack is shorter than {floor(stackHeightCalc / 12)}'-{round(stackHeightCalc % 12, 4)}"</HelperText>
                  </svelte:fragment>
               </InputLength>

               <InputLength value={steelStackHeight} label="Steel Weight Stack" {metric} readonly />

               <InputLength value={leadStackHeight} label="Lead Weight Stack" {metric} readonly />
            {/if}

            <InputLength value={botChanHeight} label="Bottom Channel" {metric} readonly />

            {#if safetyModel !== 'None' || bufferPlate || blockQty > 0}
               <InputLength value={botEquipHeight} label={botEquipHeightLabel} {metric} readonly />
            {/if}

            <InputLength value={cwtHeight} label="Overall Height" {metric} readonly />
         </div>

         <img src="/public/img/counterweight/{imgString}.svg" alt="Counterweight Dimensions" />
      </div>
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

   .dimensions {
      display: flex;
   }
</style>
