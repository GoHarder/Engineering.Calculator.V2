<script>
   import { clone } from 'lib/main.mjs';
   import { floor, round, toFraction } from 'lib/math.mjs';

   import * as tables from '../tables';

   // Components
   import { Fieldset, StockStatusOptions } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, Input, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let assemblyThickness = 0;
   export let assemblyWeight = 0;
   export let designCapacity = 0;
   export let doorQty = 1;
   export let freightClass = '';
   export let isolation = false;
   export let platformBackChannel = '';
   export let platformDepth = 0;
   export let platformFloorPlate = '';
   export let platformFrontChannel = '';
   export let platformFrontToRail = 0;
   export let platformStringer = '';
   export let platformStringerQty = 0;
   export let platformWidth = 0;
   export let split = false;
   export let steelType = 'ASTM A36';
   export let useSillChannel = false;

   export let o_platformBackChannel = false;
   export let o_platformStringerQty = false;

   // Methods
   const getChannel = async (steelType) => {
      const token = localStorage.getItem('token');

      // Run fetch
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/platform/steel/${steelType}`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         channels = [...body];
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   const getChannelOptions = (channels, sectionModulus, momentOfInertia) => {
      return clone(channels).map((channel) => {
         channel.disabled = [channel.modulusX < sectionModulus, channel.inertiaX < momentOfInertia].some((test) => test);

         return channel;
      });
   };

   // Constants
   const freightClassObj = tables.freight[freightClass];

   // Variables
   let disableSplit = false;
   let channels = [];

   let backChannelObj = {};
   let floorPlateObj = {};
   let frontChannelObj = {};
   let steelTypeObj = {};
   let stringerChannelObj = {};

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: getChannel(steelType);

   $: if (platformWidth > 92 && platformDepth > 92) {
      split = true;
      disableSplit = true;
   } else {
      disableSplit = false;
   }

   $: platformBackToRail = round(platformDepth - platformFrontToRail, 4);

   // - Steel Calculations
   $: load = freightClassObj.load(designCapacity);
   $: tensileStrengthRatio = round((steelTypeObj?.tensileStrength ?? 0) / 58, 3);

   // - Stringer
   $: isolatedStringerSectionModulus = round((load * platformDepth) / (8 * 14000 * tensileStrengthRatio), 2);
   $: unIsolatedStringerSectionModulus = round((Math.max(platformFrontToRail, platformBackToRail) * 13 * load) / (64 * 14000 * tensileStrengthRatio), 2);
   $: stringerSectionModulus = ['None', 'A'].includes(freightClass) && isolation ? isolatedStringerSectionModulus : unIsolatedStringerSectionModulus;

   $: isolatedStringerMomentOfInertia = round((960 * load * platformDepth ** 2) / (192 * (steelTypeObj?.elasticModulus ?? 1)), 2);
   $: unIsolatedStringerMomentOfInertia = round(
      (load * Math.max(platformFrontToRail, platformBackToRail) ** 3) / (66 * (steelTypeObj?.elasticModulus ?? 1) * (platformDepth / 960)),
      2
   );
   $: stringerMomentOfInertia = ['None', 'A'].includes(freightClass) && isolation ? isolatedStringerMomentOfInertia : unIsolatedStringerMomentOfInertia;

   $: stringerChannels = getChannelOptions(channels, stringerSectionModulus, stringerMomentOfInertia);
   $: stringerQtyCalc = floor((platformWidth / (split ? 2 : 1) - (sideChannelObj?.flangeWidth ?? 0) * 2) / ((stringerChannelObj?.flangeWidth ?? 0) + 14)) * (split ? 2 : 1);

   $: stringerLength =
      platformDepth -
      ((sillChannelObj?.flangeWidth ?? 0) * doorQty +
         (useSillChannel ? 3.375 : frontChannelObj?.flangeWidth ?? 0) +
         (useSillChannel && doorQty === 2 ? 3.375 : backChannelObj?.flangeWidth ?? 0));

   $: stringerWeight = round(stringerLength * (stringerChannelObj?.weight ?? 0) * platformStringerQty, 2);

   $: stringerSpacing = round(
      (platformWidth - ((sideChannelObj?.flangeWidth ?? 0) * (split ? 4 : 2) + (stringerChannelObj?.flangeWidth ?? 0) * platformStringerQty)) / (platformStringerQty + 1),
      4
   );

   // - Side Channel
   $: sideChannels = channels?.filter((row) => ['MC4X13.8', 'MC6X12', 'MC8X18.7'].includes(row.name)) ?? [];
   $: sideChannelObj = isolation ? sideChannels.find((channel) => channel.depth >= stringerChannelObj?.depth ?? 0) : stringerChannelObj;
   $: sideChannelLength = platformDepth - ((frontChannelObj?.flangeWidth ?? 0) + (backChannelObj?.flangeWidth ?? 0));
   $: sideChannelWeight = sideChannelLength * (split ? 4 : 2) * (sideChannelObj?.weight ?? 0);

   // - Sill Channel
   $: sillChannelObj = useSillChannel && stringerChannelObj ? stringerChannelObj : {};
   $: sillChannelLength = platformWidth - (sideChannelObj?.webThickness ?? 0) * 2;
   $: sillChannelWeight = sillChannelLength * (sillChannelObj?.weight ?? 0) * doorQty * (split ? 2 : 1);

   // - Front Channel
   $: frontChannelSectionModulus = freightClassObj.frontChannelFormula.sX(load, platformWidth, tensileStrengthRatio);
   $: frontChannelMomentOfInertia = freightClassObj.frontChannelFormula.iX(load, platformWidth, steelTypeObj?.elasticModulus ?? 1);
   $: frontChannels = getChannelOptions(channels, frontChannelSectionModulus, frontChannelMomentOfInertia);
   $: frontChannelWeight = platformWidth * (frontChannelObj?.weight ?? 0);

   // - Back Channel
   $: backChannels = split || doorQty === 2 ? [frontChannelObj] : channels.filter((channel) => (stringerChannelObj?.depth ?? 0) === channel.depth);
   $: backChannelCalc = split || doorQty === 2 ? platformFrontChannel : platformStringer;
   $: backChannelWeight = platformWidth * (backChannelObj?.weight ?? 0);

   // - Splice Plate
   $: splicePlateWeight = split ? 48 * (frontChannelObj?.depth - 3) * 2.55 * 2 : 0;

   // - Floor Plate
   $: floorPlates = clone(tables.steelPlate).map((plate) => {
      const fraction = toFraction(plate.thickness);
      const sX = round((plate.thickness ** 2 * stringerSpacing) / 6, 2);
      const iX = round((plate.thickness ** 3 * stringerSpacing) / 12, 6);
      const stressCheck = 14000 * tensileStrengthRatio > ((load / 2) * stringerSpacing) / (8 * sX);
      const deflectionCheck = round(platformDepth / 1666, 3) > round(((load / 2) * stringerSpacing ** 3) / (192 * iX * (steelTypeObj?.elasticModulus ?? 1)), 3);

      plate.name = `${fraction.numerator}/${fraction.denominator}" ${plate.type}`;
      plate.disabled = !(stressCheck && deflectionCheck);

      return plate;
   });

   $: floorPlateLength = platformDepth - (useSillChannel ? 3.5 * doorQty : 0);
   $: floorPlateWeight = (floorPlateObj?.thickness ?? 0) * platformWidth * floorPlateLength * 0.283;

   // - Totals
   $: assemblyWeight = round(
      (frontChannelWeight + backChannelWeight + sideChannelWeight + splicePlateWeight + sillChannelWeight + stringerWeight + floorPlateWeight) * 1.03,
      1
   );
   $: assemblyThickness = (sideChannelObj?.depth ?? 0) + (floorPlateObj?.thickness ?? 0);

   // Events
   // Lifecycle

   $: console.log(backChannelObj);
</script>

<Fieldset title="Steel">
   <Select bind:value={steelType} bind:selected={steelTypeObj} label="Type" options={tables.steelTypes}>
      {#each tables.steelTypes as { name } (name)}
         <Option value={name}>{name}</Option>
      {/each}
   </Select>

   <div class="checkboxes">
      <Checkbox bind:checked={split} disabled={disableSplit} label="Split" />

      <Checkbox bind:checked={useSillChannel} label="Sill Channel" />
   </div>

   <Select bind:value={platformStringer} bind:selected={stringerChannelObj} label="Stringer" options={stringerChannels}>
      <StockStatusOptions options={stringerChannels} />
   </Select>

   <InputNumber
      bind:value={platformStringerQty}
      bind:override={o_platformStringerQty}
      calc={stringerQtyCalc}
      label="Stringer Quantity"
      min={stringerQtyCalc}
      max={stringerQtyCalc + 2}
   >
      <svelte:fragment slot="helperText">
         <HelperText validation>{`Platform can have between ${stringerQtyCalc} and ${stringerQtyCalc + 2} channels`}</HelperText>
      </svelte:fragment>
   </InputNumber>

   <Input value={sideChannelObj?.name ?? ''} label="Side Channel" readonly />

   {#if useSillChannel}
      <Input value={sillChannelObj?.name ?? ''} label="Sill Channel" readonly />
   {/if}

   <Select bind:value={platformFrontChannel} bind:selected={frontChannelObj} label="Front Channel" options={frontChannels}>
      <StockStatusOptions options={frontChannels} />
   </Select>

   <Select
      bind:value={platformBackChannel}
      bind:override={o_platformBackChannel}
      bind:selected={backChannelObj}
      label="Back Channel"
      calc={backChannelCalc}
      options={backChannels}
   >
      <StockStatusOptions options={backChannels} />
   </Select>

   <Select bind:value={platformFloorPlate} bind:selected={floorPlateObj} label="Floor Plate" options={floorPlates}>
      {#each floorPlates as { disabled, name } (name)}
         <Option {disabled} value={name}>{name}</Option>
      {/each}
   </Select>
</Fieldset>

<style>
   .checkboxes {
      width: 300px;
      height: 56px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin-bottom: 19px;
   }
</style>
