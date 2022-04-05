<script>
   import { onMount } from 'svelte';

   import { deepMerge } from 'lib/main.mjs';
   import * as tables from './tables';

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

   // console.log(project);

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

   // - UI
   let divEle;
   let Observer;
   let sizeClass = 'large';

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
   const onResize = (event) => {
      const width = event[0].contentRect.width + (metric ? 0 : 210);

      if (width < 910) {
         sizeClass = 'small';
         return;
      }

      if (width < 1270) {
         sizeClass = 'medium';
         return;
      }

      sizeClass = 'large';
   };

   // Lifecycle
   onMount(() => {
      Observer = new ResizeObserver(onResize);
      Observer.observe(divEle);
   });
</script>

<div bind:this={divEle} class="container">
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

<div class="container">
   <div class="pit-section {sizeClass}">
      <div class="pit-section-title">
         <legend>Pit Dimensions</legend>
         <hr />
      </div>

      <fieldset class="pit-section-car">
         <legend>Car</legend>

         <hr />

         <InputLength bind:value={pitDepth} label="Pit Depth" />

         <InputLength bind:value={carBufferGap} label="Gap" />

         <InputLength bind:value={carBfrGrpHeight} bind:override={o_carBfrGrpHeight} label="Buffer Height" calc={carBfrGrpHeightCalc} />

         <InputLength bind:value={carBufferComp} label="Buffer Compression" link={Links.get('carBufferComp')} />

         <InputLength bind:value={carPitChan} label="Pit Channel" />
      </fieldset>

      <img src="/public/img/hoistway/pit.svg" alt="Hoistway Pit" class="pit-section-img" />

      <fieldset class="pit-section-cwt">
         <legend>Counterweight</legend>

         <hr />

         <InputLength bind:value={cwtHeight} label="Height" link={Links.get('cwtHeight')} />

         <InputLength bind:value={cwtBufferGap} label="Gap" />

         <InputLength bind:value={cwtBfrGrpHeight} bind:override={o_cwtBfrGrpHeight} label="Buffer Height" calc={cwtBufferHeight} />

         <InputLength bind:value={cwtBufferComp} label="Buffer Compression" link={Links.get('cwtBufferComp')} />

         <InputLength bind:value={cwtPitChan} label="Pit Channel" />
      </fieldset>
   </div>
</div>

<style lang="scss">
   @use './src/scss/theme' as vantage;
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      margin: 0.25em;
      gap: 0.25em;
   }

   .pit-section {
      @include vantage.paper;

      fieldset {
         border: none;
         @include vantage.fieldset-legend;
      }

      .pit-section-title {
         @include vantage.fieldset-legend(vantage.$primary);
         grid-area: title;
         padding: 5.6px 12px 0px;
         width: 100%;
      }

      .pit-section-car {
         grid-area: car;
      }

      .pit-section-img {
         grid-area: img;
         object-fit: contain;
      }

      .pit-section-cwt {
         grid-area: cwt;
      }

      &.small {
         display: grid;
         grid-template: {
            columns: 456px;
            areas: 'title' 'img' 'car' 'cwt';
         }

         .pit-section-img {
            width: 100%;
         }
      }

      &.medium {
         display: grid;
         grid-template: {
            columns: auto max-content;
            areas: 'title title' 'car img' 'cwt img';
         }

         .pit-section-img {
            width: auto;
         }
      }

      &.large {
         display: flex;

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
   }
</style>
