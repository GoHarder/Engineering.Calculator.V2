<script>
   import { onDestroy, onMount } from 'svelte';

   import { clone } from 'lib/main.mjs';
   import { ceil, round, roundInc } from 'lib/math.mjs';
   import { toCamelCase } from 'lib/string.mjs';

   import * as gTables from '../tables';
   import * as tables from './tables';
   import { SlingLinks } from '../links';

   // Components
   import { Fieldset, RopesInput, SafetyInput, StockStatusOptions, ShoeInput } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { Input, InputNumber, InputLength } from 'components/material/input';
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
         counterWeight: {
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
         model,
         railSize,
      };

      project.globals = { ...project.globals, ...globalData };
      project.modules.sling = { ...project.modules.sling, ...moduleData };
   };

   // Methods
   const getEngineeringData = async () => {
      const token = localStorage.getItem('token');

      // Run fetch
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/sling`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         shoePlates = [...body.shoePlates];
         slingModels = [...body.models];
         topChannels = [...body.topChannels];
         channels = [...body.channels];
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   const getShoePlate = (plates, shoe, mounting, railSize) => {
      let output = {
         weight: 25,
         thickness: 0.75,
      };

      if (plates) {
         const plate = clone(plates).find((plate) => plate.shoes.includes(shoe));
         const mountsTo = plate?.mountsTo.find((nth) => nth.products.includes(mounting));
         const variant = mountsTo?.variants.find((nth) => nth.railSizes.includes(railSize));

         output = {
            weight: variant?.weight ?? 25,
            thickness: variant?.thickness ?? 0.75,
         };
      }

      return output;
   };

   const getChannelOptions = (channels, sectionModulus) => {
      if (channels.length > 0) {
         return clone(channels).map((channel) => {
            channel.disabled = channel.modulusX < sectionModulus;
            return channel;
         });
      }

      return [];
   };

   // Constants
   const { globals, modules, metric } = project;
   const { capacity, counterBalance, loading, roping, speed } = globals;
   const { type: loadingType, freight: freightClass } = loading;
   const { sling: module } = modules;
   const modulusOfElasticity = 29000000;

   SlingLinks.setProject(modules);

   const loadingValue = `${loadingType} ${freightClass}`.replace(/\sNone/, '');

   // Variables
   // - Saved

   // -- Globals
   let apta = globals?.apta ?? false;
   let cabWeight = globals?.cab?.weight ?? 0;
   let cabWidth = globals?.cab?.width ?? 0;
   let cornerPost = globals?.platform?.cornerPost ?? false;
   let door1Weight = globals?.doors?.door1?.weight ?? 0;
   let door2Weight = globals?.doors?.door2?.weight ?? 0;
   let platformDepth = globals?.platform?.depth ?? 0;
   let platformThickness = globals?.platform?.thickness ?? 0;
   let platformWeight = globals?.platform?.weight ?? 0;
   let platformWidth = globals?.platform?.width ?? 0;
   let toeGuard1Weight = globals?.doors?.door1?.toeGuardWeight ?? 0;
   let toeGuard2Weight = globals?.doors?.door2?.toeGuardWeight ?? 0;

   // -- General
   let dbg = module?.dbg ?? 0;
   let railSize = module?.railsize ?? '15#';
   let stileModel = module?.model ?? '';

   // -- Dimensions
   let stilesBackToBack = 0;
   let underBeamHeight = 114;

   let o_stilesBackToBack = false;

   // -- Ropes
   let ropePitch = globals?.rope?.pitch ?? 0;
   let ropeSize = globals?.rope?.size ?? 0.375;
   let ropeQty = globals?.rope?.qty ?? 4;
   let o_ropePitch = globals?.rope?.o_pitch ?? false;

   // -- Safety
   let safetyHeight = 0;
   let safetyModel = 'Other';
   let safetyWeight = 0;

   // -- Shoe
   let shoeHeight = 0;
   let shoeModel = 'Other';
   let shoeWeight = 0;

   // -- Sheaves
   let sheaveQty = 1;
   let sheaveModel = '';
   let sheaveArrangement = 'Parallel';
   let sheaveLocation = 'Overslung';
   let sheaveMounting = 'Support Plate';
   let sheaveOffset = 0;

   // -- Equipment
   let carTopWeight = 150;
   let doorOperatorWeight = door2Weight ? 300 : 150;
   let miscWeight = 200;
   let railLock = false;

   // -- Steel
   let topChannel = '';
   let botChannel = '';
   let stileChannel = '';
   let sheaveChannel = '';

   // -- Strike Plates
   let strikePlateQty = 1;
   let strikePlateOffset = 0;

   // -- Braces
   let braceQty = 0;
   let o_braceQty = false;
   let braceQtyCalc = 0;

   // NOTE: Threw these for busy work
   let slingWeight = 0;
   let carWeight = 0;
   let balanceWeight = 0;
   let rowBalanceWeight = 1;
   let compType = 'None';
   let railToBalance = 0;
   let balanceLocation = '';
   let sheaveChannelLength = 0;

   // - UI
   let sheaveChannelLabel = 'Sheave Channels';

   // - Database
   let channels = [];
   let shoePlates = [];
   let sheaves = [];
   let slingModels = [];
   let topChannels = [];

   // - Objects
   let botChannelObj = {};
   let cornerPostBraceObj = {};
   let modelObj = { top: null, bottom: null };
   let sheaveObj = {};
   let sheaveChannelObj = {};
   let stileChannelObj = {};
   let topChannelObj = {};

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: designCapacity = capacity * (apta ? 1.5 : 1);
   $: cwtWeight = round(carWeight + capacity * counterBalance, 2);
   $: turningMoment = tables.turningMoment[freightClass](designCapacity, cabWidth);
   $: dimH = roundInc(shoeHeight * 2 + (railLock ? 2.5 : 0) + topShoePlate.thickness + stileLength + safetyHeight + botShoePlate.thickness);

   $: modelOptions = clone(slingModels).map((model) => {
      const validComp = model.comp.includes(compType);
      const validModulus = model.stiles.some((stile) => stile.modulusY >= stileSy);
      const validInertia = model.stiles.some((stile) => stile.inertiaY >= stileIy);
      let validTopChannel = true;
      let validBottomChannel = true;

      if (topChannel && model?.top) validTopChannel = topChannel === model.top;
      if (botChannel && model?.bottom) validBottomChannel = botChannel === model.bottom;

      model.disabled = ![validComp, validModulus, validInertia, validTopChannel, validBottomChannel].every((test) => test);

      return model;
   });

   $: if (sheaveConfig === 'parallelUnderslung') {
      sheaveChannelLabel = 'Inner Sheave / Safety Channel';
   } else {
      sheaveChannelLabel = 'Sheave Channels';
   }

   // - Parts
   $: topShoePlate = getShoePlate(shoePlates, shoeModel, stileModel, railSize);
   $: botShoePlate = getShoePlate(shoePlates, shoeModel, safetyModel, railSize);
   $: strikePlate = model?.strikePlate;
   $: gusset = topChannel?.slingGusset;

   // - Stiles
   $: stileSy = round((turningMoment * underBeamHeight) / (4 * dimH * 14000), 2);
   $: stileIy = round((turningMoment * underBeamHeight ** 3) / (18 * modulusOfElasticity * dimH), 2);
   $: stileLength = roundInc((topChannelObj?.depth ?? 0) + underBeamHeight + platformThickness + (botChannelObj?.depth ?? 0));
   $: stileWeight = (stileChannelObj?.weight ?? 0) * stileLength * 2;
   $: stilesBackToBackCalc = dbg - 1.5;
   $: stileOptions = clone(modelObj?.stiles ?? []).map((channel) => {
      const validModulus = channel.modulusY >= stileSy;
      const validInertia = channel.inertiaY >= stileIy;
      channel.disabled = ![validModulus, validInertia].every((test) => test);
      return channel;
   });

   // - Top Channel
   $: topChannelSx = tables.sheaveConfig[sheaveConfig].topChanSx(overallWeight, topChannelLength, sheaveQty, sheaveOffset);
   $: topChannelLength = stilesBackToBack + (stileChannelObj?.flangeWidth ?? 0) * 2;
   $: topChannelWeight = (topChannelObj?.weight ?? 0) * topChannelLength * 2;
   $: topChannelOpts = getChannelOptions(topChannels, topChannelSx);

   // - Bottom Channel
   $: botChannelSx = tables.sheaveConfig[sheaveConfig].botChanSx(overallWeight, botChannelLength, strikePlateQty, strikePlateOffset);
   $: botChannelLength = stilesBackToBack + (stileChannelObj?.flangeWidth ?? 0) * 2;
   $: botChannelWeight = (botChannelObj?.weight ?? 0) * botChannelLength * 2;
   $: botChannelOpts = getChannelOptions(channels, botChannelSx);

   // - Sheave Channel
   $: sheaveConfig = toCamelCase(`${sheaveArrangement}${sheaveLocation}`);
   $: sheaveChannelSx = tables.sheaveConfig[sheaveConfig].sheaveChannelSx(overallWeight, sheaveOffset, botChannelLength);
   $: sheaveChannelWeight = (sheaveChannelObj?.weight ?? 0) * slingSheaveChannelLength * 2;
   $: sheaveChannelOpts = getChannelOptions(channels, sheaveSx);

   // - Braces
   $: braceLength = ceil(Math.sqrt((platformDepth / 2 - 10 - (stileChannelObj?.depth ?? 0) / 2) ** 2 + (underBeamHeight - 39.5) ** 2));
   $: braceWeight = ((stileChannelObj?.weight ?? 0) >= 1.9 ? 0.5 : 0.375) * 2 * braceLength * 0.2833 * braceQty;
   $: cornerPostBraceLength = roundInc(Math.sqrt(platformWidth ** 2 * platformDepth ** 2));
   $: braceAssemblyWeight = (cornerPost ? cornerPostBraceLength * cornerPostBraceObj.weight : 0) + braceWeight;

   // - Tie down slings
   $: if (stileModel === '6TS-TD-LD') {
      topChannel = 'C10X25';
      botChannel = 'C10X25';
   }

   $: if (stileModel === '8TS-TD-LD-OH') {
      topChannel = 'MC8X21.4';
      botChannel = 'MC8X21.4';
   }

   // - Weights
   $: slingWeight = round(
      (topChannelWeight +
         stileWeight +
         botChannelWeight +
         braceAssemblyWeight +
         (gusset?.weight ?? 0) * 4 +
         (strikePlate?.weight ?? 0) * strikePlateQty +
         // Comp Weight
         // Rope Mounting Weight (carRoping === 1 ? 28 : sheaveChannelWeight)
         (slingModel === '6TS-TD-LD' ? 29.11 : 0) +
         (slingModel === '8TS-TD-LD' ? 278.639 : 0)) *
         1.03,
      2
   );

   $: unbalancedCarWeight = round(
      slingWeight +
         platformWeight +
         cabWeight +
         door1Weight +
         door2Weight +
         toeGuard1Weight +
         toeGuard2Weight +
         shoeWeight * 4 +
         safetyWeight +
         carTopWeight +
         doorOperatorWeight +
         (sheaveObj?.weight ?? 0) * sheaveQty +
         miscWeight,
      2
   );

   $: carWeight = round(unbalancedCarWeight + balanceWeight, 2);

   $: overallWeight = carWeight + designCapacity;

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
   <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} readonly type="weight" />

   <InputNumber value={speed} label="Car Speed" link="/Project/Requirements" {metric} readonly type="speed" />

   <Input value={loadingValue} label="Loading" link="/Project/Requirements" readonly />

   <Input value="{roping}:1" label="Roping" link="/Project/Requirements" readonly />
</Fieldset>

<Fieldset title="Platform">
   <InputLength bind:value={platformWidth} link={SlingLinks.get('platformWidth')} label="Width" {metric} />

   <InputLength bind:value={platformDepth} link={SlingLinks.get('platformDepth')} label="Depth" {metric} />

   <InputLength bind:value={platformThickness} label="Thickness" link={SlingLinks.get('platformThickness')} {metric} />

   <InputNumber bind:value={platformWeight} label="Weight" link={SlingLinks.get('platformWeight')} {metric} step="0.1" type="weight" />

   <InputLength bind:value={cabWidth} label="Cab Width" link={SlingLinks.get('cabWidth')} {metric} />
</Fieldset>

{#if roping > 1}
   <!-- TODO: 12-20-2021 9:28 AM - Add link when machine is done -->
   <RopesInput bind:pitch={ropePitch} bind:size={ropeSize} bind:qty={ropeQty} bind:o_pitch={o_ropePitch} {metric} />

   <Fieldset title="Sheaves">
      <InputNumber bind:value={sheaveQty} label="Quantity" />

      <Select bind:value={sheaveModel} label="Model">
         <Option value="TODO">TODO</Option>
      </Select>

      {#if sheaveQty > 1}
         <Select bind:value={sheaveArrangement} label="Arrangement">
            <Option value="Parallel">Parallel</Option>
            <Option value="Diagonal">Diagonal</Option>
         </Select>

         <Select bind:value={sheaveLocation} label="Mounting">
            <Option value="Overslung">Overslung</Option>
            <Option value="Underslung">Underslung</Option>
         </Select>
      {/if}
   </Fieldset>
{/if}

<Fieldset title="Equipment">
   <InputNumber bind:value={carTopWeight} label="Car Top Weight" {metric} type="weight" />

   <InputNumber bind:value={doorOperatorWeight} label="Door Operator Weight" {metric} type="weight" />

   <InputNumber bind:value={miscWeight} label="Misc. Equipment Weight" {metric} type="weight" />

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

   <InputNumber value={ceil(balanceWeight / rowBalanceWeight)} label="Balance Weight Rows" readonly />

   {#if ['12#', '15#'].includes(railSize)}
      <Checkbox bind:checked={railLock} label="Rail Locks" />
   {/if}

   <ShoeInput bind:height={shoeHeight} bind:model={shoeModel} bind:weight={shoeWeight} {capacity} {railSize} {speed} />

   <SafetyInput bind:height={safetyHeight} bind:model={safetyModel} bind:weight={safetyWeight} {railSize} {speed} />

   <InputNumber value={carWeight} label="Car Weight" {metric} readonly type="weight" />
</Fieldset>

<Fieldset title="Properties">
   <Select bind:value={stileModel} bind:selected={modelObj} label="Model" options={modelOptions}>
      {#each modelOptions as { disabled, name } (name)}
         <Option {disabled} value={name}>{name}</Option>
      {/each}
   </Select>

   <Checkbox bind:checked={apta} label="APTA" link={SlingLinks.get('apta')} />

   <Select bind:value={railSize} label="Rail Size">
      {#each gTables.railSizes as { name } (name)}
         <Option value={name}>{name}</Option>
      {/each}
   </Select>

   <InputLength bind:value={dbg} label="D.B.G." {metric} />

   <InputLength bind:value={stilesBackToBack} bind:override={o_stilesBackToBack} label="Back to Back of Stiles" calc={stilesBackToBackCalc} {metric} />

   <InputLength bind:value={underBeamHeight} label="Under Beam Height" {metric} />

   <!-- TODO: 12-20-2021 8:52 AM - Add link when machine is done -->
   <Select bind:value={compType} label="Compensation">
      {#each gTables.compensation as { name } (name)}
         <Option value={name}>{name}</Option>
      {/each}
   </Select>

   <InputNumber value={slingWeight} label="Total Weight" {metric} readonly type="weight" />
</Fieldset>

<Fieldset title="Steel">
   <Select bind:value={topChannel} bind:selected={topChannelObj} label="Top Channels" options={topChannelOpts}>
      {#if modelObj?.top !== null}
         <Option value={modelObj.top}>{modelObj.top}</Option>
      {:else}
         <StockStatusOptions options={topChannelOpts} />
      {/if}
   </Select>

   <Select bind:value={stileChannel} label="Stiles">
      {#if modelObj?.stiles?.length === 1}
         <Option value={modelObj?.stiles[0].name}>{modelObj?.stiles[0].name}</Option>
      {:else}
         <StockStatusOptions options={stileOptions} />
      {/if}
   </Select>

   <Select bind:value={botChannel} label="Bottom Channels">
      {#if modelObj?.bottom !== null}
         <Option value={modelObj.bottom}>{modelObj.bottom}</Option>
      {:else}
         <StockStatusOptions options={botChannelOpts} />
      {/if}
   </Select>

   {#if sheaveChannelSx > 0}
      <Select bind:value={sheaveChannel} bind:selected={sheaveChannelObj} label={sheaveChannelLabel} options={sheaveChannelOpts}>
         <StockStatusOptions options={sheaveChannelOpts} />
      </Select>
   {/if}

   {#if cornerPost}
      <!-- ding -->
   {:else}
      <InputNumber bind:value={braceQty} bind:override={o_braceQty} label="Brace Quantity" calc={braceQtyCalc} />
   {/if}
</Fieldset>

<style>
</style>
