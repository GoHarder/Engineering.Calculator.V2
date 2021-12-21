<script>
   import { onDestroy } from 'svelte';

   import { round } from 'lib/math.mjs';

   import * as tables from './tables';

   // Components
   import { Fieldset } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, Input, InputLength, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   import Door from './components/Door.svelte';
   import SteelPlatform from './components/SteelPlatform.svelte';
   import WoodPlatform from './components/WoodPlatform.svelte';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {
         apta,
         cab: {
            depth: cabDepth,
            height: cabHeight,
            weight: cabWeight,
            width: cabWidth,
         },
         doors: {
            door1: {
               weight: door1Weight,
               toeGuardWeight: toeGuard1Weight,
            },
            door2: {
               weight: door2Weight,
               toeGuardWeight: toeGuard2Weight,
            },
         },
         platform: {
            cornerPost,
            depth: platformDepth,
            frontToRail: platformFrontToRail,
            isolation,
            thickness: platformThickness,
            weight: platformWeight,
            width: platformWidth,
         },
      };

      const moduleData = {
         cab: {
            o_depth: o_cabDepth,
            o_width: o_cabWidth,
            o_weight: o_cabWeight,
         },
         doors: {
            qty: doorQty,

            door1: {
               height: door1Height,
               type: door1Type,
               width: door1Width,
               o_weight: o_door1Weight,
               o_toeGuardWeight: o_toeGuard1Weight,
            },
            door2: {
               height: door2Height,
               location: door2Location,
               type: door2Type,
               width: door2Width,
               o_weight: o_door2Weight,
               o_toeGuardWeight: o_toeGuard2Weight,
            },
         },
         finFloor: {
            area: finFloorArea,
            thickness: finFloorThickness,
            materialWeight: finFloorMaterialWeight,
            weight: finFloorWeight,
            o_weight: o_finFloorWeight,
         },
         isolatorCombo,
         material,
         plywood: {
            qty: plywoodQty,
            thickness: plywoodThickness,
         },
         steel: {
            backChannel: platformBackChannel,
            floorPlate: platformFloorPlate,
            frontChannel: platformFrontChannel,
            stringer: platformStringer,
            stringerQty: platformStringerQty,
            split,
            type: steelType,
            useSillChannel,
            o_backChannel: o_platformBackChannel,
            o_stringerQty: o_platformStringerQty,
         },
      };

      if (material === 'Wood') {
         delete moduleData.steel;

         if (project.modules.platform.steel) {
            delete project.modules.platform.steel;
         }
      }

      if (doorQty === 1) {
         delete globalData.doors.door2;
         delete moduleData.doors.door2;

         if (project.globals.doors) {
            delete project.globals.doors.door2;
         }

         if (project.modules.platform.doors) {
            delete project.modules.platform.doors.door2;
         }
      }

      project.globals = { ...project.globals, ...globalData };
      project.modules.platform = { ...project.modules.platform, ...moduleData };
   };

   // Methods
   // Constants
   const { globals, modules, metric } = project;
   const { capacity, loading } = globals;
   const { type: loadingType, freight: freightClass } = loading;
   const { platform: module } = modules;

   const loadingValue = `${loadingType} ${freightClass}`.replace(/\sNone/, '');

   // Variables

   // - Saved
   // -- General
   let apta = globals?.apta ?? false;
   let cornerPost = false;
   let isolation = globals?.platform?.isolation ?? false;
   let isolatorCombo = module?.isolatorCombo ?? '';
   let material = module?.material ?? 'Wood';
   let platformDepth = globals?.platform?.depth ?? 0;
   let platformFrontToRail = globals?.platform?.frontToRail ?? 0;
   let platformThickness = 0;
   let platformWeight = 0;
   let platformWidth = globals?.platform?.width ?? 0;

   // -- Steel
   let platformBackChannel = module?.steel?.backChannel ?? '';
   let platformFloorPlate = module?.steel?.floorPlate ?? '';
   let platformFrontChannel = module?.steel?.frontChannel ?? '';
   let platformStringer = module?.steel?.stringer ?? '';
   let platformStringerQty = module?.steel?.stringerQty ?? 0;
   let split = module?.steel?.split ?? false;
   let steelType = module?.steel?.type ?? 'ASTM A36';
   let useSillChannel = module?.steel?.useSillChannel ?? false;

   let o_platformBackChannel = module?.steel?.o_backChannel ?? false;
   let o_platformStringerQty = module?.steel?.o_stringerQty ?? false;

   // -- Cab
   let cabDepth = globals?.cab?.depth ?? 0;
   let cabHeight = globals?.cab?.height ?? 96;
   let cabWidth = globals?.cab?.width ?? 0;
   let cabWeight = globals?.cab?.weight ?? 0;

   let o_cabDepth = module?.cab?.o_depth ?? false;
   let o_cabWidth = module?.cab?.o_width ?? false;
   let o_cabWeight = module?.cab?.o_weight ?? false;

   // -- Doors
   let doorQty = module?.doors?.qty ?? 1;

   let door1Height = module?.doors?.door1?.height ?? 84;
   let door1Type = module?.doors?.door1?.type ?? 'Single Speed';
   let door1Weight = globals?.doors?.door1?.weight ?? 0;
   let door1Width = module?.doors?.door1?.width ?? 54;
   let toeGuard1Weight = globals?.doors?.door1?.toeGuardWeight ?? 0;

   let o_door1Weight = module?.doors?.door1?.o_weight ?? false;
   let o_toeGuard1Weight = module?.doors?.door1?.o_toeGuardWeight ?? false;

   let door2Height = module?.doors?.door2?.height ?? 84;
   let door2Location = module?.doors?.door2?.location ?? 'Back';
   let door2Type = module?.doors?.door2?.type ?? 'Single Speed';
   let door2Weight = globals?.doors?.door2?.weight ?? 0;
   let door2Width = module?.doors?.door2?.width ?? 54;
   let toeGuard2Weight = globals?.doors?.door2?.toeGuardWeight ?? 0;

   let o_door2Weight = module?.doors?.door2?.o_weight ?? false;
   let o_toeGuard2Weight = module?.doors?.door2?.o_toeGuardWeight ?? false;

   // -- Finished Flooring
   let finFloorArea = module?.finFloor?.area ?? 'Inside Cab';
   let finFloorThickness = module?.finFloor?.thickness ?? 0.25;
   let finFloorMaterialWeight = module?.finFloor?.materialWeight ?? 0;
   let finFloorWeight = module?.finFloor?.weight ?? 0;

   let o_finFloorWeight = module?.finFloor?.o_weight ?? false;

   // -- Plywood
   let plywoodQty = module?.plywood?.qty ?? 0;
   let plywoodThickness = module?.plywood?.thickness ?? 0.25;

   // - Calculated
   let assemblyThickness = 0;
   let assemblyWeight = 0;
   let door1Thickness = 0;
   let door2Thickness = 0;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: cornerPost = doorQty === 2 && door2Location !== 'Back';
   $: designCapacity = capacity * (apta ? 1.5 : 1);
   $: platformArea = platformWidth * platformDepth;
   $: plywoodWeight = round(platformWidth * platformDepth * plywoodThickness * plywoodQty * 0.02083, 2); // 1" plywood weight = 3 lbs per square foot

   // - Code Requirements
   $: maxPlatformArea = tables.getMaxPlatformArea(designCapacity);
   $: maxPlatformAreaPlus = maxPlatformArea * 1.05;
   $: minFreightCapacity = round(tables.freight[freightClass].capacityRatio * cabArea);

   // - Value Defaults
   $: finFloorWeightCalc = round((finFloorArea === 'Inside Cab' ? cabArea : platformArea) * finFloorMaterialWeight);

   // - Cab
   $: cabArea = cabWidth * cabDepth;
   $: cabDepthCalc = platformDepth - (door1Thickness + (door2Location === 'Back' ? door2Thickness : 2));
   $: cabWeightCalc = round(cabWallWeight + cabCeilingWeight + handRailWeight + coveLightWeight);
   $: cabWidthCalc = platformWidth - (door2Location !== 'Back' ? door2Thickness + 2 : 4);

   // -- Estimated Weights
   $: cabCeilingWeight = cabArea * (4.64 / 144);
   $: cabWallArea = (cabDepth + cabWidth) * 2 * cabHeight;
   $: doorArea = door1Width * door1Height + (doorQty === 2 ? door2Width * door2Height : 0);
   $: cabWallWeight = (cabWallArea - doorArea) * ((designCapacity <= 3500 ? 7.21 : 8.9) / 144);
   $: handRailWeight = cabWidth + cabDepth * 2 * (2.5 / 144);
   $: coveLightWeight = cabWidth + cabDepth * 2 * (5 / 144);

   // - Isolation
   $: isolationWeight = isolation ? round((platformDepth - 3) * 0.55 + platformWidth * 0.34167, 2) : 0;
   $: isolatorCombos = tables.getIsolatorCombos(platformWeight);

   // - Totals
   $: platformThickness = assemblyThickness + finFloorThickness + plywoodThickness * plywoodQty + (isolation ? 2 : 0);
   $: platformWeight = assemblyWeight + isolationWeight + plywoodWeight + finFloorWeight;

   // - UI
   $: disableIsolation = ['None', 'A'].includes(freightClass) === false || split;

   // Events
   // Lifecycle
   onDestroy(() => {
      updateModule();
   });
</script>

<div class="container">
   <Fieldset title="Globals">
      <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} readonly type="weight" />

      <Input value={loadingValue} label="Loading" link="/Project/Requirements" readonly />
   </Fieldset>
</div>

<div class="container">
   <Fieldset title="Properties">
      <Select bind:value={material} label="Material">
         <Option value="Wood">Wood</Option>
         <Option value="Steel">Steel</Option>
      </Select>

      <InputLength bind:value={platformWidth} label="Width" {metric} />

      <InputLength bind:value={platformDepth} label="Depth" {metric} />

      <InputLength bind:value={platformFrontToRail} label="Front To Rail" {metric} />

      <InputLength bind:value={platformThickness} label="Thickness" {metric} readonly />

      <InputNumber value={platformArea} label="Area" {metric} step="0.01" readonly type="area" />

      <InputNumber value={platformWeight} label="Weight" {metric} readonly type="weight" />

      <div class="checkboxes">
         <Checkbox bind:checked={apta} label="APTA" />

         <Checkbox bind:checked={isolation} label="Isolation" disabled={disableIsolation} />
      </div>

      {#if isolation}
         <Select bind:value={isolatorCombo} label="Isolators">
            {#each isolatorCombos as { name } (name)}
               <Option {name}>{name}</Option>
            {/each}
         </Select>
      {/if}
   </Fieldset>

   {#if material === 'Wood'}
      <WoodPlatform bind:assemblyThickness bind:assemblyWeight {designCapacity} {platformDepth} {platformWidth} />
   {:else}
      <SteelPlatform
         bind:assemblyThickness
         bind:assemblyWeight
         bind:platformBackChannel
         bind:platformFloorPlate
         bind:platformFrontChannel
         bind:platformStringer
         bind:platformStringerQty
         bind:split
         bind:steelType
         bind:useSillChannel
         bind:o_platformBackChannel
         bind:o_platformStringerQty
         {designCapacity}
         {doorQty}
         {freightClass}
         {isolation}
         {platformDepth}
         {platformFrontToRail}
         {platformWidth}
      />
   {/if}
</div>

<div class="container">
   <Fieldset title="Cab">
      <InputLength bind:value={cabHeight} label="Height" {metric} />

      <InputLength bind:value={cabWidth} bind:override={o_cabWidth} label="Width" calc={cabWidthCalc} {metric} />

      <InputLength bind:value={cabDepth} bind:override={o_cabDepth} label="Depth" calc={cabDepthCalc} {metric} />

      <InputNumber value={cabArea} label="Area" {metric} readonly step="0.01" type="area" />

      <InputNumber bind:value={cabWeight} bind:override={o_cabWeight} label="Weight" calc={cabWeightCalc} {metric} type="weight" />

      <Select bind:value={doorQty} label="Door Quantity" type="number">
         <Option value="1">1</Option>
         <Option value="2">2</Option>
      </Select>
   </Fieldset>

   <Fieldset title="Front Door">
      <Door
         bind:height={door1Height}
         bind:thickness={door1Thickness}
         bind:toeGuardWeight={toeGuard1Weight}
         bind:type={door1Type}
         bind:weight={door1Weight}
         bind:width={door1Width}
         bind:o_toeGuardWeight={o_toeGuard1Weight}
         bind:o_weight={o_door1Weight}
         {metric}
      />
   </Fieldset>

   {#if doorQty === 2}
      <Fieldset title="{door2Location} Door">
         <Select bind:value={door2Location} label="Location">
            <Option value="Back">Back</Option>
            <Option value="Left">Left</Option>
            <Option value="Right">Right</Option>
         </Select>

         <Door
            bind:height={door2Height}
            bind:thickness={door2Thickness}
            bind:toeGuardWeight={toeGuard2Weight}
            bind:type={door2Type}
            bind:weight={door2Weight}
            bind:width={door2Width}
            bind:o_toeGuardWeight={o_toeGuard2Weight}
            bind:o_weight={o_door2Weight}
            {metric}
         />
      </Fieldset>
   {/if}
</div>

<div class="container">
   <Fieldset title="Finished Flooring">
      <InputLength bind:value={finFloorThickness} label="Thickness" {metric} />

      {#if !o_finFloorWeight}
         <InputNumber bind:value={finFloorMaterialWeight} label="Material Weight" {metric} step="0.01" type="pressure" />

         <Select bind:value={finFloorArea} label="Area">
            <Option value="Inside Cab">Inside Cab</Option>
            <Option value="Full Platform">Full Platform</Option>
         </Select>
      {/if}

      <InputNumber bind:value={finFloorWeight} bind:override={o_finFloorWeight} label="Weight" calc={finFloorWeightCalc} {metric} type="weight" />
   </Fieldset>

   <Fieldset title="Plywood">
      <InputNumber bind:value={plywoodQty} label="Layers" />

      {#if plywoodQty > 0}
         <Select bind:value={plywoodThickness} label="Thickness" type="number">
            <Option value="0.25">1/4"</Option>
            <Option value="0.375">3/8"</Option>
            <Option value="0.5">1/2"</Option>
            <Option value="0.625">5/8"</Option>
            <Option value="0.75">3/4"</Option>
         </Select>

         <InputNumber value={plywoodWeight} label="Weight" readonly step="0.1" type="weight" />
      {/if}
   </Fieldset>
</div>

<div class="container">
   <Fieldset title="Code Requirements">
      {#if loadingType === 'Passenger'}
         <InputNumber value={maxPlatformArea} label="Max Inside Platform Area" {metric} readonly step="0.01" type="area" />

         <InputNumber value={maxPlatformAreaPlus} label="Max Inside Platform Area + 5%" invalid={cabArea > maxPlatformAreaPlus} {metric} readonly step="0.01" type="area">
            <svelte:fragment slot="helperText">
               <HelperText validation>Interior area exceeds max area + 5%</HelperText>
            </svelte:fragment>
         </InputNumber>
      {/if}

      {#if freightClass !== 'None'}
         <InputNumber value={minFreightCapacity} label="Min. Freight Capacity" invalid={minFreightCapacity > designCapacity} {metric} readonly type="weight">
            <svelte:fragment slot="helperText">
               <HelperText validation>Capacity is below required minimum</HelperText>
            </svelte:fragment>
         </InputNumber>
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

   .checkboxes {
      width: 300px;
      height: 56px;
      display: grid;
      grid-template-columns: 1fr 1fr;
   }
</style>
