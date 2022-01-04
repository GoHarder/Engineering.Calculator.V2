<script>
   import { onDestroy, onMount } from 'svelte';

   import { clone } from 'lib/main.mjs';
   import { ceil, floor, round, roundInc } from 'lib/math.mjs';
   import { toCamelCase } from 'lib/string.mjs';

   import * as gTables from '../tables';
   import * as tables from './tables';
   import { SlingLinks } from '../links';

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
      const globalData = {
         car: {
            weight: carWeight,
         },
         compensation: {
            type: compType,
            weight: compWeight,
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
         equipment: {
            balanceWeight: {
               weight: balanceWeight,
               railToBalance,
               balanceLocation,
               o_balanceWeight,
            },

            carTopWeight,
            doorOperatorWeight,
            miscWeight,
            railLock,
            safety: {
               height: safetyHeight,
               model: safetyModel,
               weight: safetyWeight,
            },
            shoe: {
               height: shoeHeight,
               model: shoeModel,
               weight: shoeWeight,
            },
         },
         model: slingModel,
         railSize,
         sheaves: {
            arrangement: sheaveArrangement,
            location: sheaveLocation,
            model: sheaveModel,
            mounting: sheaveMounting,
            offset: sheaveOffset,
            qty: sheaveQty,
         },
         steel: {
            bottomChannel: botChannel,
            braceQty,
            bufferBlockUp,
            bufferBlockUpLength,
            cornerPostBrace,
            plateMounting,
            safetyBlockUp,
            safetyBlockUpLength,
            sheaveChannel,
            sheaveChannelLength,
            spacerLength,
            stileChannel,
            strikePlateOffset,
            strikePlateQty,
            topChannel,
            o_braceQty,
         },
         stilesBackToBack,
         underBeamHeight,
         o_stilesBackToBack,
      };

      if (roping === 1) {
         delete moduleData.sheaves;
         delete moduleData.steel.sheaveChannel;
         delete moduleData.steel.sheaveChannelLength;
      }

      if (safetyModel !== 'Other') {
         delete moduleData.equipment.safety.height;
         delete moduleData.equipment.safety.weight;
      }

      if (shoeModel !== 'Other') {
         delete moduleData.equipment.shoe.height;
         delete moduleData.equipment.shoe.weight;
      }

      if (!cornerPost) delete moduleData.steel.cornerPostBrace;

      if (sheaveConfig !== 'parallelUnderslung') delete moduleData.steel.plateMounting;

      if (sheaveConfig !== 'diagonalUnderslung') {
         delete moduleData.steel.spacerLength;
         delete moduleData.steel.safetyBlockUp;
         delete moduleData.steel.safetyBlockUpLength;
         delete moduleData.steel.bufferBlockUp;
         delete moduleData.steel.bufferBlockUpLength;
      }

      project.globals = { ...project.globals, ...globalData };
      project.modules.sling = moduleData;
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

         channels = [...body.channels];
         sheaves = [...body.sheaves];
         shoePlates = [...body.shoePlates];
         slingModels = [...body.models];
         topChannels = [...body.topChannels];
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
   const { capacity, counterbalance, loading, roping, speed } = globals;
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
   let compType = globals?.compensation?.type ?? 'None';
   let compWeight = globals?.compensation?.weight ?? 0;
   let cornerPost = globals?.platform?.cornerPost ?? false;
   let door1Weight = globals?.doors?.door1?.weight ?? 0;
   let door2Weight = globals?.doors?.door2?.weight ?? 0;
   let platformDepth = globals?.platform?.depth ?? 0;
   let platformFrontToRail = globals?.platform?.frontToRail ?? 0;
   let platformIsolation = globals?.platform?.isolation ?? false;
   let platformThickness = globals?.platform?.thickness ?? 0;
   let platformWeight = globals?.platform?.weight ?? 0;
   let platformWidth = globals?.platform?.width ?? 0;
   let toeGuard1Weight = globals?.doors?.door1?.toeGuardWeight ?? 0;
   let toeGuard2Weight = globals?.doors?.door2?.toeGuardWeight ?? 0;

   // -- General
   let dbg = module?.dbg ?? 0;
   let railSize = module?.railsize ?? '15#';
   let slingModel = module?.model ?? '';

   // -- Dimensions
   let stilesBackToBack = module?.stilesBackToBack ?? 0;
   let underBeamHeight = module?.underBeamHeight ?? 114;
   let o_stilesBackToBack = module?.o_stilesBackToBack ?? false;

   // -- Ropes
   let ropePitch = globals?.rope?.pitch ?? 0;
   let ropeSize = globals?.rope?.size ?? 0.375;
   let ropeQty = globals?.rope?.qty ?? 4;
   let o_ropePitch = globals?.rope?.o_pitch ?? false;

   // -- Sheaves
   let sheaveArrangement = module?.sheaves?.arrangement ?? 'Parallel';
   let sheaveLocation = module?.sheaves?.location ?? 'Overslung';
   let sheaveModel = module?.sheaves?.model ?? '';
   let sheaveMounting = module?.sheaves?.mounting ?? 'Support Plate';
   let sheaveOffset = module?.sheaves?.offset ?? 0;
   let sheaveQty = module?.sheaves?.qty ?? 1;

   // -- Equipment
   let carTopWeight = module?.equipment?.carTopWeight ?? 150;
   let doorOperatorWeight = module?.equipment?.doorOperatorWeight ?? door2Weight ? 300 : 150;
   let miscWeight = module?.equipment?.miscWeight ?? 200;
   let railLock = module?.equipment?.railLock ?? false;

   // --- Safety
   let safetyHeight = module?.equipment?.safety?.height ?? 0;
   let safetyModel = module?.equipment?.safety?.model ?? 'Other';
   let safetyWeight = module?.equipment?.safety?.weight ?? 0;

   // --- Shoe
   let shoeHeight = module?.equipment?.shoe?.height ?? 0;
   let shoeModel = module?.equipment?.shoe?.model ?? 'Other';
   let shoeWeight = module?.equipment?.shoe?.weight ?? 0;

   let balanceWeight = module?.equipment?.balanceWeight?.weight ?? 0;
   let railToBalance = module?.equipment?.balanceWeight?.railToBalance ?? 0;
   let balanceLocation = module?.equipment?.balanceWeight?.balanceLocation ?? 1;
   let o_balanceWeight = module?.equipment?.balanceWeight?.o_balanceWeight ?? false;

   // -- Steel
   let botChannel = module?.steel?.bottomChannel ?? '';
   let cornerPostBrace = module?.steel?.cornerPostBrace ?? '';
   let sheaveChannel = module?.steel?.sheaveChannel ?? '';
   let sheaveChannelLength = module?.steel?.sheaveChannelLength ?? 0;
   let stileChannel = module?.steel?.stileChannel ?? '';
   let topChannel = module?.steel?.topChannel ?? '';

   // -- Strike Plates
   let strikePlateOffset = module?.steel?.strikePlateOffset ?? 0;
   let strikePlateQty = module?.steel?.strikePlateQty ?? 1;

   // -- Braces
   let braceQty = module?.steel?.braceQty ?? 0;
   let o_braceQty = module?.steel?.o_braceQty ?? false;

   // -- Parallel Underslung
   let plateMounting = module?.steel?.plateMounting ?? '';

   // -- Diagonal Underslung
   let bufferBlockUp = module?.steel?.bufferBlockUp ?? '';
   let bufferBlockUpLength = module?.steel?.bufferBlockUpLength ?? 0;
   let safetyBlockUp = module?.steel?.safetyBlockUp ?? '';
   let safetyBlockUpLength = module?.steel?.safetyBlockUpLength ?? 0;
   let spacerLength = module?.steel?.spacerLength ?? 0;

   // - Calculated
   let balanceWeightCalc = 0;
   let braceQtyCalc = 4;
   let frontToBalance = 0;
   let sheaveMountingWeight = 0;

   // - UI
   let sheaveChannelLabel = 'Sheave Channels';

   // - Database
   let channels = [];
   let sheaves = [];
   let shoePlates = [];
   let slingModels = [];
   let topChannels = [];

   // - Objects
   let botChannelObj = {};
   let bufferBlockUpObj = {};
   let cornerPostBraceObj = {};
   let modelObj = { top: null, bottom: null };
   let plateMountingObj = {};
   let safetyBlockUpObj = {};
   let sheaveObj = {};
   let sheaveChannelObj = {};
   let stileChannelObj = {};
   let topChannelObj = {};

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: designCapacity = capacity * (apta ? 1.5 : 1);
   $: cwtWeight = round(carWeight + capacity * counterbalance, 2);
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

   $: if (cornerPost) {
      braceQtyCalc = 2;
   } else if (platformDepth < 121) {
      braceQtyCalc = 4;
   } else if (platformDepth < 228) {
      braceQtyCalc = 8;
   } else {
      braceQtyCalc = 12;
   }

   $: if (sheaveConfig === 'parallelUnderslung') {
      sheaveChannelLabel = 'Inner Sheave / Safety Channel';
   } else {
      sheaveChannelLabel = 'Sheave Channels';
   }

   // - Parts
   $: topShoePlate = getShoePlate(shoePlates, shoeModel, slingModel, railSize);
   $: botShoePlate = getShoePlate(shoePlates, shoeModel, safetyModel, railSize);
   $: strikePlate = modelObj?.strikePlate;
   $: gusset = topChannelObj?.slingGusset;
   $: sheaveOptions = clone(sheaves).map((sheave) => {
      const reqWidth = round((ropeQty - 1) * ropePitch + ropeSize + 0.625, 4);
      const reqDiameter = round(ropeSize * 40, 3);

      sheave.disabled = ![sheave.rimWidth >= reqWidth, sheave.diameter >= reqDiameter].every((test) => test);
      sheave.displayName = `${sheave.name} (Ø${floor(sheave.diameter)}")`;

      return sheave;
   });

   // - Stiles
   $: stileSy = round((turningMoment * underBeamHeight) / (4 * dimH * 14000), 2);
   $: stileIy = round((turningMoment * underBeamHeight ** 3) / (18 * modulusOfElasticity * dimH), 2);
   $: stileLength = roundInc(
      (topChannelObj?.depth ?? 0) +
         underBeamHeight +
         platformThickness +
         (botChannelObj?.depth ?? 0) +
         (sheaveConfig === 'parallelUnderslung' ? sheaveChannel?.depth ?? 0 : 0) +
         (sheaveConfig === 'diagonalUnderslung' ? bufferBlockUpChannel?.depth ?? 0 : 0)
   );
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
   $: sheaveChannelSx = tables.sheaveConfig[sheaveConfig].sheaveChanSx(overallWeight, sheaveOffset, botChannelLength);
   $: sheaveChannelWeight = (sheaveChannelObj?.weight ?? 0) * sheaveChannelLength * 2;
   $: sheaveChannelOpts = getChannelOptions(channels, sheaveChannelSx);
   $: sheaveOffsetImg = tables.sheaveConfig[sheaveConfig].sheaveOffsetImg;

   // - Braces
   $: braceLength = ceil(Math.sqrt((platformDepth / 2 - 10 - (stileChannelObj?.depth ?? 0) / 2) ** 2 + (underBeamHeight - 39.5) ** 2));
   $: braceWeight = ((stileChannelObj?.weight ?? 0) >= 1.9 ? 0.5 : 0.375) * 2 * braceLength * 0.2833 * braceQty;
   $: cornerPostBraceLength = roundInc(Math.sqrt(platformWidth ** 2 * platformDepth ** 2));
   $: braceAssemblyWeight = (cornerPost ? cornerPostBraceLength * cornerPostBraceObj.weight : 0) + braceWeight;

   // - Parallel Underslung
   $: reinforcementPlate1Weight = (sheaveChannelObj?.depth ?? 0) * 2 * 2.55;
   $: outerSheaveChannelWeight = botChannelWeight / 2;
   $: supoortPlate = botChannelLength * (['7T', '7T-SPL'].includes(slingModel) ? 1.025 : 1.167);
   $: reinforcementPlate2Weight = 14;
   $: plateMountingWeight = botChannelLength * (plateMountingObj?.weight ?? 0);
   $: parallelUnderslungWeight =
      sheaveMounting === 'Channel' ? outerSheaveChannelWeight : reinforcementPlate1Weight + supoortPlate + reinforcementPlate2Weight + plateMountingWeight;

   // - Diagonal Underslung
   $: channelSpacerWeight = spacerLength * (botChannelObj?.weight ?? 0) * 2;
   $: safetyBlockUpWeight = safetyBlockUpLength * (safetyBlockUpObj?.weight ?? 0) * 2;
   $: bufferBlockUpWeight = bufferBlockUpLength * (bufferBlockUpObj?.weight ?? 0) * 2;
   $: diagonalUnderslungWeight = channelSpacerWeight + safetyBlockUpWeight + bufferBlockUpWeight;

   // - Balance Weights
   $: balanceChannelLength = roundInc(platformWidth - (platformIsolation ? 4 : 1));
   $: balanceChannelWeight = round(balanceChannelLength * 0.9, 2);
   $: balanceWeightMountLength = roundInc(balanceChannelLength - 1.9375);
   $: balanceWeightQty = floor(balanceWeightMountLength / 3);
   $: rowBalanceWeight = round(balanceChannelWeight + balanceWeightQty * 9, 2);
   $: balanceWeightRows = ceil(balanceWeight / rowBalanceWeight);

   // - Balance Moments
   $: distributedMoment = round(distributedWeight * (platformDepth / 2), 2);
   $: slingMoment = round(slingMomentWeight * platformFrontToRail, 2);
   $: sheaveMountingMoment = (sheaveConfig === 'parallelUnderslung' ? parallelUnderslungWeight : 0) * ((sheaveObj?.rimWidth ?? 0) / 2 + 1 + frontToBalance);
   $: door1Moment = (doorOperatorWeight / roping + door1Weight) * 9;
   $: door2Moment = (doorOperatorWeight / 2 + door2Weight) * (platformDepth - 9);
   // toeGuard1Moment = toeGuard1WEight * 0
   $: toeGuard2Moment = toeGuard2Weight * platformDepth;
   $: totalMoments = distributedMoment + slingMoment + sheaveMountingMoment + door1Moment + door2Moment + toeGuard2Moment;

   // Assume r1 = 0 Then solve for r2
   // r2 = Σfy / platformDepth
   // r1 = unbalancedCarWeight - r2
   $: r2 = round(totalMoments / platformDepth, 2);
   $: r1 = round(unbalancedCarWeight - r2, 2);
   $: backToBalance = platformDepth - frontToBalance;

   // Positive number means its leaning forward
   $: totalTorque = round(r1 * frontToBalance - r2 * backToBalance, 2);
   $: balanceChannelLocation = totalTorque > 0 ? backToBalance - (door2Weight ? 9.625 : 4.125) : frontToBalance - 9.625;
   $: requiredBalanceWeight = round(Math.abs(totalTorque) / balanceChannelLocation);

   $: if (!cornerPost) {
      if (requiredBalanceWeight < rowBalanceWeight) {
         balanceWeightCalc = round(rowBalanceWeight, 2);
      } else if (requiredBalanceWeight < rowBalanceWeight * 2) {
         balanceWeightCalc = round(rowBalanceWeight * 2, 2);
      } else {
         balanceWeightCalc = round(requiredBalanceWeight, 2);
      }
   }

   // - Tie down slings
   $: if (slingModel === '6TS-TD-LD') {
      topChannel = 'C10X25';
      botChannel = 'C10X25';
   }

   $: if (slingModel === '8TS-TD-LD-OH') {
      topChannel = 'MC8X21.4';
      botChannel = 'MC8X21.4';
   }

   // - Weights
   $: switch (sheaveConfig) {
      case 'parallelUnderslung':
         sheaveMountingWeight = parallelUnderslungWeight;
         frontToBalance = platformFrontToRail + railToBalance * balanceLocation;
         break;

      case 'diagonalUnderslung':
         sheaveMountingWeight = diagonalUnderslungWeight;
         frontToBalance = platformFrontToRail;
         break;

      default:
         sheaveMountingWeight = sheaveChannelWeight;
         frontToBalance = platformFrontToRail;
         break;
   }

   $: slingWeight = round(
      (topChannelWeight +
         stileWeight +
         botChannelWeight +
         braceAssemblyWeight +
         (gusset?.weight ?? 0) * 4 +
         (strikePlate?.weight ?? 0) * strikePlateQty +
         compWeight +
         (roping === 1 ? 28 : sheaveMountingWeight) +
         (slingModel === '6TS-TD-LD' ? 29.11 : 0) +
         (slingModel === '8TS-TD-LD' ? 278.639 : 0)) *
         1.03,
      2
   );

   $: distributedWeight = platformWeight + cabWeight + carTopWeight + miscWeight + (sheaveObj?.weight ?? 0) * sheaveQty;

   $: unbalancedCarWeight = round(
      slingWeight + distributedWeight + door1Weight + door2Weight + toeGuard1Weight + toeGuard2Weight + shoeWeight * 4 + safetyWeight + doorOperatorWeight,
      2
   );

   $: carWeight = round(unbalancedCarWeight + balanceWeight, 2);

   $: overallWeight = carWeight + designCapacity;

   $: slingMomentWeight = slingWeight - (sheaveConfig === 'parallelUnderslung' ? parallelUnderslungWeight : 0);

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
      <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} readonly type="weight" />

      <InputNumber value={speed} label="Car Speed" link="/Project/Requirements" {metric} readonly type="speed" />

      <Input value={loadingValue} label="Loading" link="/Project/Requirements" readonly />

      <Input value="{roping}:1" label="Roping" link="/Project/Requirements" readonly />
   </Fieldset>

   <Fieldset title="Platform">
      <InputLength bind:value={platformWidth} link={SlingLinks.get('platformWidth')} label="Width" {metric} />

      <InputLength bind:value={platformDepth} link={SlingLinks.get('platformDepth')} label="Depth" {metric} />

      <InputLength bind:value={platformFrontToRail} link={SlingLinks.get('platformFrontToRail')} label="Front To Rail" {metric} />

      <InputLength bind:value={platformThickness} label="Thickness" link={SlingLinks.get('platformThickness')} {metric} />

      <InputNumber bind:value={platformWeight} label="Weight" link={SlingLinks.get('platformWeight')} {metric} step="0.1" type="weight" />
   </Fieldset>
</div>

<div class="container">
   <Fieldset title="Cab">
      <InputLength bind:value={cabWidth} label="Width" link={SlingLinks.get('cabWidth')} {metric} />

      <InputNumber bind:value={cabWeight} label="Weight" link={SlingLinks.get('cabWeight')} {metric} step="0.1" type="weight" />
   </Fieldset>
</div>

<div class="container">
   {#if roping > 1}
      <!-- TODO: 12-20-2021 9:28 AM - Add link when machine is done -->
      <RopesInput bind:pitch={ropePitch} bind:size={ropeSize} bind:qty={ropeQty} bind:o_pitch={o_ropePitch} {metric} />

      <Fieldset title="Sheaves">
         <InputNumber bind:value={sheaveQty} label="Quantity" />

         <Select bind:value={sheaveModel} bind:selected={sheaveObj} label="Model" options={sheaveOptions}>
            {#each sheaveOptions as { displayName, disabled, name } (name)}
               <Option {disabled} value={name}>{displayName}</Option>
            {/each}
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

            <InputImg src={sheaveOffsetImg} alt="Strike Plate Offset" width="300">
               <InputLength bind:value={sheaveOffset} label="Sheave Offset" {metric} />
            </InputImg>

            {#if sheaveConfig === 'parallelUnderslung'}
               <InputLength bind:value={railToBalance} label="Rail To Sheaves" {metric} />

               <Select bind:value={balanceLocation} label="Sheave Location" type="number">
                  <Option value="1">Behind the Rail</Option>
                  <Option value="-1">Front of the Rail</Option>
               </Select>
            {/if}
         {/if}
      </Fieldset>
   {/if}

   <Fieldset title="Equipment">
      <InputNumber bind:value={carTopWeight} label="Car Top Weight" {metric} type="weight" />

      <InputNumber bind:value={doorOperatorWeight} label="Door Operator Weight" {metric} type="weight" />

      <InputNumber bind:value={miscWeight} label="Misc. Weight" {metric} step="0.01" type="weight" />

      <InputNumber
         bind:value={balanceWeight}
         bind:override={o_balanceWeight}
         label="Balance Weight"
         calc={balanceWeightCalc}
         invalid={balanceWeightRows > 2}
         step={0.01}
         {metric}
         type="weight"
      >
         <svelte:fragment slot="helperText">
            <HelperText validation>Max Balance Weights {round(rowBalanceWeight * 2, 2)}lbs</HelperText>
         </svelte:fragment>
      </InputNumber>

      <InputNumber value={balanceWeightRows} label="Balance Weight Rows" invalid={balanceWeightRows > 2} readonly>
         <svelte:fragment slot="helperText">
            <HelperText validation>Platform Can Hold 2 Rows</HelperText>
         </svelte:fragment>
      </InputNumber>

      {#if ['12#', '15#'].includes(railSize)}
         <Checkbox bind:checked={railLock} label="Rail Locks" />
      {/if}

      <ShoeInput bind:height={shoeHeight} bind:model={shoeModel} bind:weight={shoeWeight} {capacity} {railSize} {speed} />

      <SafetyInput bind:height={safetyHeight} bind:model={safetyModel} bind:weight={safetyWeight} {railSize} {speed} />

      <!-- TODO: 12-20-2021 8:52 AM - Add link when machine is done -->
      <Select bind:value={compType} label="Compensation">
         {#each gTables.compensation as { name } (name)}
            <Option value={name}>{name}</Option>
         {/each}
      </Select>

      {#if compType !== 'None'}
         <InputNumber bind:value={compWeight} label="Compensation Weight" step={0.01} {metric} type="weight" />
      {/if}

      <InputNumber value={carWeight} label="Car Weight" {metric} readonly step="0.01" type="weight" />
   </Fieldset>
</div>

<div class="container">
   <Fieldset title="Properties">
      <Select bind:value={slingModel} bind:selected={modelObj} label="Model" options={modelOptions}>
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

      <InputNumber value={slingWeight} label="Total Weight" {metric} readonly step="0.01" type="weight" />
   </Fieldset>

   <Fieldset title="Steel">
      <Select bind:value={topChannel} bind:selected={topChannelObj} label="Top Channels" options={topChannelOpts}>
         {#if modelObj?.top !== null}
            <Option value={modelObj.top}>{modelObj.top}</Option>
         {:else}
            <StockStatusOptions options={topChannelOpts} />
         {/if}
      </Select>

      <Select bind:value={stileChannel} bind:selected={stileChannelObj} label="Stiles" options={stileOptions}>
         {#if modelObj?.stiles?.length === 1}
            <Option value={modelObj?.stiles[0].name}>{modelObj?.stiles[0].name}</Option>
         {:else}
            <StockStatusOptions options={stileOptions} />
         {/if}
      </Select>

      <Select bind:value={botChannel} bind:selected={botChannelObj} label="Bottom Channels" options={botChannelOpts}>
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

         {#if sheaveConfig === 'parallelUnderslung'}
            <Select bind:value={sheaveMounting} label="Outer Sheave Mounting">
               <Option value="Support Plate">Support Plate</Option>
               <Option value="Channel">Channel</Option>
            </Select>

            {#if sheaveMounting === 'Support Plate'}
               <Select bind:value={plateMounting} bind:selected={plateMountingObj} label="Plate Mounting" options={tables.plateMounting}>
                  {#each tables.plateMounting as { name } (name)}
                     <Option value={name}>{name}</Option>
                  {/each}
               </Select>
            {/if}
         {:else}
            <InputLength bind:value={sheaveChannelLength} label="Sheave Channel Length" {metric} />
         {/if}

         {#if sheaveConfig === 'diagonalUnderslung'}
            <InputLength bind:value={spacerLength} label="Channel Spacer Length" {metric} />

            <Select bind:value={safetyBlockUp} bind:selected={safetyBlockUpObj} label="Safety Block Up" options={channels}>
               <StockStatusOptions options={channels} />
            </Select>

            <InputLength bind:value={safetyBlockUpLength} label="Safety Block Up Length" {metric} />

            <Select bind:value={bufferBlockUp} bind:selected={bufferBlockUpObj} label="Buffer Block Up" options={channels}>
               <StockStatusOptions options={channels} />
            </Select>

            <InputLength bind:value={bufferBlockUpLength} label="Buffer Block Up Length" {metric} />
         {/if}
      {/if}

      {#if cornerPost}
         <Select bind:value={cornerPostBrace} bind:selected={cornerPostBraceObj} label="Brace Steel" options={tables.cornerPostBrace}>
            {#each tables.cornerPostBrace as { name } (name)}
               <Option value={name}>{name}</Option>
            {/each}
         </Select>
      {:else}
         <InputNumber bind:value={braceQty} bind:override={o_braceQty} label="Brace Quantity" calc={braceQtyCalc} />
      {/if}

      <InputNumber bind:value={strikePlateQty} label="Strike Plate Quantity" min={1} max={10} />

      {#if strikePlateQty > 1}
         <InputImg src="/public/img/sling/strike-plate.svg" alt="Strike Plate Offset" width="300">
            <InputLength bind:value={strikePlateOffset} label="Strike Plate Offset" {metric} />
         </InputImg>
      {/if}
   </Fieldset>
</div>

<style lang="scss">
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      margin: 0.25em;
      gap: 0.25em;
   }
</style>
