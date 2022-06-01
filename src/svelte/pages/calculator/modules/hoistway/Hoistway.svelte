<script>
   import { deepMerge } from 'lib/main.mjs';
   import * as tables from './tables';
   import { containerQuery } from 'components/lib.js';

   import { HoistwayLinks as Links } from '../links';

   // Components
   import { Fieldset } from 'components/common';
   import { InputLength, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   import BackRoped from './components/BackRoped.svelte';
   import Basement from './components/Basement.svelte';
   import BlockUp from './components/BlockUp.svelte';
   import Overslung from './components/Overslung.svelte';
   import Standard from './components/Standard.svelte';
   import Underslung from './components/Underslung.svelte';

   import DiagonalOverslung from './components/DiagonalOverslung.svelte';
   import DiagonalUnderslung from './components/DiagonalUnderslung.svelte';
   import ParallelOverslung from './components/ParallelOverslung.svelte';
   import ParallelUnderslung from './components/ParallelUnderslung.svelte';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {
         cab: {
            height: cabHeight,
         },
         platform: {
            cornerPost,
            thickness: platformThickness,
         },
         sling: {
            botChanDepth,
            safetyHeight: carSafetyHeight,
            sheaveArrangement,
            sheaveChanDepth,
            sheaveLocation,
            shoeHeight: carShoeHeight,
            shoePlateThickness: carShoePlateThick,
            strikePlateThick,
            topChanDepth,
            underBeamHeight,
         },
         counterweight: {
            height: cwtHeight,
         },
         buffers: {
            car: {
               height: carBufferHeight,
               compression: carBufferComp,
            },
            counterweight: {
               height: cwtBufferHeight,
               compression: cwtBufferComp,
            },
            tripSpeed,
         },
      };

      const moduleData = {
         clearOverhead,
         comp1Name,
         pitDepth,

         cornerPostBrace,
         toeGuardLen,
         railHeight,
         car: {
            bufferGap: carBufferGap,
            bufferGroupHeight: carBfrGrpHeight,
            equipOffset: carEquipOffset,
            pitChan: carPitChan,
            topToBeam: topToCarBeam,
            o_bufferGroupHeight: o_carBfrGrpHeight,
         },
         counterweight: {
            bufferGap: cwtBufferGap,
            bufferGroupHeight: cwtBfrGrpHeight,
            equipOffset: cwtEquipOffset,
            pitChan: cwtPitChan,
            topToBeam: topToCwtBeam,
            o_bufferGroupHeight: o_cwtBfrGrpHeight,
         },
      };

      // project.globals = { ...project.globals, ...globalData };
      project.globals = deepMerge(project.globals, globalData);
      project.modules.hoistway = moduleData;
   };

   // Methods
   // Constants
   const { globals, metric, modules } = project;
   const { overallTravel } = globals;
   const { hoistway: module } = modules;

   Links.setProject(modules);

   const overheadComps = [
      { name: 'Standard', comp: Standard },
      { name: 'Block Up', comp: BlockUp },
      { name: 'Back Roped', comp: BackRoped },
      { name: 'Basement', comp: Basement },
      { name: 'MRL Over', comp: Overslung },
      { name: 'MRL Under', comp: Underslung },
   ];

   const slingComps = {
      ParallelOverslung,
      DiagonalOverslung,
      ParallelUnderslung,
      DiagonalUnderslung,
   };

   const breakpoints = {
      808: ['small'],
      1266: ['medium'],
      5000: ['large'],
   };

   // Variables
   // - Globals
   let tripSpeed = globals?.buffers?.tripSpeed ?? 0;

   let cabHeight = globals?.cab?.height ?? 96;

   let cornerPost = globals?.platform?.cornerPost ?? false;
   let platformThickness = globals?.platform?.thickness ?? 0;

   let botChanDepth = globals?.sling?.botChanDepth ?? 8;
   let bufferBlockUpDepth = globals?.sling?.bufferBlockUpDepth ?? 0;
   let strikePlateThick = globals?.sling?.strikePlateThick ?? 1;
   let topChanDepth = globals?.sling?.topChanDepth ?? 8;
   let underBeamHeight = globals?.sling?.underBeamHeight ?? 114;
   let carSafetyHeight = globals?.sling?.safetyHeight ?? 0;
   let carShoeHeight = globals?.sling?.shoeHeight ?? 0;
   let carShoePlateThick = globals?.sling?.shoePlateThickness ?? 0;

   let cwtHeight = globals?.counterweight?.height ?? 114;

   let carBufferHeight = globals?.buffers?.car?.height ?? 0;
   let cwtBufferHeight = globals?.buffers?.counterweight?.height ?? 0;

   let carBufferComp = globals?.buffers?.car?.compression ?? 5;
   let cwtBufferComp = globals?.buffers?.counterweight?.compression ?? 5;

   let sheaveArrangement = globals?.sling?.sheaveArrangement ?? 'Parallel';
   let sheaveLocation = globals?.sling?.sheaveLocation ?? 'Overslung';
   let sheaveChanDepth = globals?.sling?.sheaveChanDepth ?? 8;
   let sheaveDia = globals?.sling?.sheaveDia ?? 0;

   // - Module
   let clearOverhead = module?.clearOverhead ?? 240;
   let comp1Name = module?.comp1Name ?? 'Standard';
   let pitDepth = module?.pitDepth ?? 72;
   let cornerPostBrace = module?.cornerPostBrace ?? 0;
   let toeGuardLen = module?.toeGuardLen ?? 50.625;
   let railHeight = module?.railHeight ?? 42;

   let carBufferGap = module?.car?.bufferGap ?? 6;
   let carBfrGrpHeight = module?.car?.bufferGroupHeight ?? 0;
   let carEquipOffset = module?.car?.equipOffset ?? 0;
   let carPitChan = module?.car?.pitChan ?? 2.625;
   let topToCarBeam = module?.car?.topToBeam ?? 14;

   let cwtBufferGap = module?.cwt?.bufferGap ?? 6;
   let cwtBfrGrpHeight = module?.cwt?.bufferGroupHeight ?? 0;
   let cwtEquipOffset = module?.cwt?.equipOffset ?? 17.5;
   let cwtPitChan = module?.cwt?.pitChan ?? 2.625;
   let topToCwtBeam = module?.car?.topToBeam ?? 14;

   let o_carBfrGrpHeight = module?.car?.o_bufferGroupHeight ?? false;
   let o_cwtBfrGrpHeight = module?.cwt?.o_bufferGroupHeight ?? false;

   let carBufferStyle = 'Oil';
   let cwtBufferStyle = 'Oil';

   // - Calculated
   let carBeamUnderside = 0;
   let cwtBeamUnderside = 0;

   // -- From sling
   let floorToPlate = 0;
   let floorToRail = 0;
   let floorToShoe = 0;
   let floorToTop = 0;

   // - Objects
   let comp1Obj;
   let comp2Obj;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: comp1Obj = overheadComps.find((row) => row.name === comp1Name);
   $: comp2Obj = slingComps[`${sheaveArrangement}${sheaveLocation}`];

   $: carBfrCompressHeight = carBfrGrpHeight - carBufferComp;
   // $: cwtBfrCompressHeight = cwtBfrGrpHeight - cwtBufferComp;

   $: carStopDist = tables.getStopDist(carBufferStyle, tripSpeed); // check
   $: cwtStopDist = tables.getStopDist(cwtBufferStyle, tripSpeed); // check

   $: minCarTopClear = cwtBufferGap + cwtBufferComp + 24 + cwtStopDist; // check
   $: minCwtTopClear = carBufferGap + carBufferComp + 6 + carStopDist + 18; // check

   $: carTopClear = carBeamUnderside - floorToTop;
   $: cwtTopClear = cwtBeamUnderside + pitDepth - (cwtEquipOffset + cwtHeight + cwtBufferComp + cwtBfrGrpHeight + cwtPitChan);

   $: overTravel = cwtBufferGap + cwtBufferComp + cwtStopDist; // check

   $: railClear = carBeamUnderside + carEquipOffset - (floorToRail + overTravel + 6);

   // - Calcs
   $: carBfrGrpHeightCalc = Math.max(pitDepth - (carPitChan + carBufferGap + floorToPlate), carBufferHeight);

   // - Errors
   $: toeGuardError = toeGuardLen + 1 - floorToPlate > carBfrCompressHeight + carPitChan; // check

   $: carShoeError = floorToShoe - floorToPlate + 0.5 > carBfrCompressHeight + carPitChan; // check

   // Events

   // Lifecycle
</script>

<div class="flex-row">
   <Fieldset title="Globals">
      <InputLength value={overallTravel} label="Overall Travel" link="/Project/Requirements" />
   </Fieldset>

   <Fieldset title="Properties">
      <Select bind:value={comp1Name} label="Type">
         <Option value="Standard">Overhead Standard</Option>
         <Option value="Block Up">Overhead Block-Up</Option>
         <Option value="Back Roped">Overhead Back Roped</Option>
         <Option value="Basement">Basement / Hoistway</Option>
         <Option value="MRL Over">MRL Overslung</Option>
         <Option value="MRL Under">MRL Underslung</Option>
      </Select>

      <InputNumber bind:value={tripSpeed} label="Trip Speed" link={Links.get('tripSpeed')} />
   </Fieldset>

   <Fieldset title="Sling Properties">
      <Select bind:value={sheaveArrangement} label="Sheave Arrangement" link={Links.get('sheaveArrangement')}>
         <Option value="Parallel">Parallel</Option>
         <Option value="Diagonal">Diagonal</Option>
      </Select>

      <Select bind:value={sheaveLocation} label="Sheave Mounting" link={Links.get('sheaveLocation')}>
         <Option value="Overslung">Overslung</Option>
         <Option value="Underslung">Underslung</Option>
      </Select>

      {#if !Links.get('underBeamHeight')}
         <InputLength bind:value={carSafetyHeight} label="Safety Height" />
         <InputLength bind:value={carShoeHeight} label="Car Shoe Height" />
         <InputLength bind:value={carShoePlateThick} label="Car Shoe Plate Thickness" />
      {/if}
   </Fieldset>
</div>

<svelte:component
   this={comp1Obj?.comp ?? Standard}
   bind:carBeamUnderside
   bind:cwtBeamUnderside
   bind:clearOverhead
   bind:carEquipOffset
   bind:cwtEquipOffset
   bind:topToCarBeam
   bind:topToCwtBeam
   {carTopClear}
   {cwtTopClear}
   {metric}
   {minCarTopClear}
   {minCwtTopClear}
   {overTravel}
   {railClear}
/>

<svelte:component
   this={comp2Obj || ParallelOverslung}
   bind:botChanDepth
   bind:cabHeight
   bind:cornerPost
   bind:cornerPostBrace
   bind:floorToPlate
   bind:floorToRail
   bind:floorToShoe
   bind:floorToTop
   bind:platformThickness
   bind:railHeight
   bind:safetyHeight={carSafetyHeight}
   bind:shoeHeight={carShoeHeight}
   bind:shoePlateThick={carShoePlateThick}
   bind:strikePlateThick
   bind:toeGuardLen
   bind:topChanDepth
   bind:underBeamHeight
   bind:sheaveDia
   bind:sheaveChanDepth
   bind:bufferBlockUpDepth
   {carShoeError}
   {Links}
   {metric}
   {toeGuardError}
/>

<div class="flex-row small medium large" use:containerQuery={breakpoints}>
   <div class="pit-section">
      <div class="pit-section-title">
         <legend>Pit Dimensions</legend>
         <hr />
      </div>

      <div class="form">
         <fieldset class="pit-section-car">
            <legend>Car</legend>
            <hr />

            <InputLength bind:value={pitDepth} label="Pit Depth" {metric} />

            <InputLength bind:value={carBufferGap} label="Gap" {metric} />

            <InputLength bind:value={carBfrGrpHeight} bind:override={o_carBfrGrpHeight} label="Buffer Height" calc={carBfrGrpHeightCalc} {metric} />

            <InputLength bind:value={carBufferComp} label="Buffer Compression" link={Links.get('carBufferComp')} {metric} />

            <InputLength bind:value={carPitChan} label="Pit Channel" {metric} />
         </fieldset>

         <div class="pit-section-img">
            <img src="/img/hoistway/pit.svg" alt="Hoistway Pit" />
         </div>

         <!-- <div class="pit-section-img" style="background-image: url({'img/hoistway/pit.svg'});" /> -->

         <fieldset class="pit-section-cwt">
            <legend>Counterweight</legend>
            <hr />

            <InputLength bind:value={cwtHeight} label="Height" link={Links.get('cwtHeight')} {metric} />

            <InputLength bind:value={cwtBufferGap} label="Gap" {metric} />

            <InputLength bind:value={cwtBfrGrpHeight} bind:override={o_cwtBfrGrpHeight} label="Buffer Height" calc={cwtBufferHeight} {metric} />

            <InputLength bind:value={cwtBufferComp} label="Buffer Compression" link={Links.get('cwtBufferComp')} {metric} />

            <InputLength bind:value={cwtPitChan} label="Pit Channel" {metric} />
         </fieldset>
      </div>
   </div>
</div>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .pit-section {
      @include vantage.paper;
      @include vantage.fieldset-legend(vantage.$primary);

      fieldset {
         border: none;
         @include vantage.fieldset-legend;
      }
   }

   .pit-section-title {
      @include vantage.fieldset-legend(vantage.$primary);
      padding: 5.6px 12px 0px;
      width: 100%;
   }

   .pit-section-car {
      grid-area: car;
   }

   .pit-section-img {
      grid-area: img;
      img {
         max-width: 100%;
         max-height: 100%;
      }
   }

   .pit-section-cwt {
      grid-area: cwt;
   }

   .large {
      .form {
         display: flex;
         flex-wrap: wrap;
      }

      .pit-section-title {
         display: none;
      }

      .pit-section-img {
         height: 400px;
      }

      fieldset {
         @include vantage.fieldset-legend(vantage.$primary);
      }
   }

   .medium {
      .form {
         display: grid;

         grid-template: {
            columns: repeat(auto-fill, minmax(324px, 432px));
            areas: 'car img' 'cwt img';
         }
      }

      .pit-section-img {
         width: auto;
         object-fit: cover;
      }
   }

   .small {
      .form {
         display: grid;

         grid-template: {
            columns: repeat(auto-fill, minmax(324px, 432px));
            areas: 'img' 'car' 'cwt';
         }
      }

      .pit-section-img {
         object-fit: cover;
      }
   }
</style>
