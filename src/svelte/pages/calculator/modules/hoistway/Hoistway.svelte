<script>
   import { onMount } from 'svelte';

   import * as tables from './tables';

   import { HoistwayLinks as Links } from '../links';

   // Components
   import { Fieldset } from 'components/common';
   import { InputLength, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   import BlockUp from './components/BlockUp.svelte';
   import Standard from './components/Standard.svelte';

   import ParallelOverslung from './components/ParallelOverslung.svelte';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {};

      const moduleData = {
         clearOverhead,
         comp1Name,
         pitDepth,
         topToBeam,
         cornerPostBrace,
         toeGuardLen,
         railHeight,
         car: {
            bufferGap: carBufferGap,
            bufferGroupHeight: carBfrGrpHeight,
            equipOffset: carEquipOffset,
            pitChan: carPitChan,
            o_bufferGroupHeight: o_carBfrGrpHeight,
         },
         counterweight: {
            bufferGap: cwtBufferGap,
            bufferGroupHeight: cwtBfrGrpHeight,
            equipOffset: cwtEquipOffset,
            pitChan: cwtPitChan,
            o_bufferGroupHeight: o_cwtBfrGrpHeight,
         },
      };

      project.globals = { ...project.globals, ...globalData };
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
   ];

   // console.log(project);

   // Variables
   // - Globals
   let terminalSpeed = globals?.terminalSpeed ?? 0;

   let cabHeight = globals?.cab?.height ?? 96;

   let cornerPost = globals?.platform?.cornerPost ?? false;
   let platformThickness = globals?.platform?.thickness ?? 0;

   let botChanDepth = globals?.sling?.botChanDepth ?? 8;
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

   // - Module
   let clearOverhead = module?.clearOverhead ?? 240;
   let comp1Name = module?.comp1Name ?? 'Block Up';
   let pitDepth = module?.pitDepth ?? 72;
   let topToBeam = module?.topToBeam ?? 14;
   let cornerPostBrace = module?.cornerPostBrace ?? 0;
   let toeGuardLen = module?.toeGuardLen ?? 50.625;
   let railHeight = module?.railHeight ?? 42;

   let carBufferGap = module?.car?.bufferGap ?? 6;
   let carBfrGrpHeight = module?.car?.bufferGroupHeight ?? 0;
   let carEquipOffset = module?.car?.equipOffset ?? 17.5;
   let carPitChan = module?.car?.pitChan ?? 2.625;

   let cwtBufferGap = module?.cwt?.bufferGap ?? 6;
   let cwtBfrGrpHeight = module?.cwt?.bufferGroupHeight ?? 0;
   let cwtEquipOffset = module?.cwt?.equipOffset ?? 0;
   let cwtPitChan = module?.cwt?.pitChan ?? 2.625;

   let o_carBfrGrpHeight = module?.car?.o_bufferGroupHeight ?? false;
   let o_cwtBfrGrpHeight = module?.cwt?.o_bufferGroupHeight ?? false;

   let carBufferStyle = 'Oil';
   let cwtBufferStyle = 'Oil';

   // - Calculated
   let floorToPlate = 0;
   let floorToShoe = 0;
   let beamUnderside = 0;

   // - UI
   let divEle;
   let Observer;
   let sizeClass = 'large';

   // - Objects
   let comp1Obj;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: carBfrCompressHeight = carBfrGrpHeight - carBufferComp;
   // $: cwtBfrCompressHeight = cwtBfrGrpHeight - cwtBufferComp;

   $: carStopDist = tables.getStopDist(carBufferStyle, terminalSpeed);
   $: cwtStopDist = tables.getStopDist(cwtBufferStyle, terminalSpeed);

   $: minCarTopClear = cwtBufferGap + cwtBufferComp + 24 + cwtStopDist;
   $: minCwtTopClear = carBufferGap + carBufferComp + 6 + carStopDist + 18;

   $: carTopClear = beamUnderside - (topChanDepth + underBeamHeight + cornerPostBrace);
   $: cwtTopClear = pitDepth + beamUnderside - (cwtHeight + cwtBufferComp + cwtBfrGrpHeight + cwtPitChan);

   $: overTravel = cwtBufferGap + cwtBufferComp + cwtStopDist;

   $: railClear = beamUnderside + carEquipOffset - (cabHeight + railHeight + overTravel + 6);

   // - Calcs
   $: carBfrGrpHeightCalc = Math.max(pitDepth - (carPitChan + carBufferGap + floorToPlate), carBufferHeight);

   // - Errors
   $: toeGuardError = toeGuardLen + 1 - floorToPlate > carBfrCompressHeight + carPitChan;

   $: carShoeError = floorToShoe - floorToPlate + 0.5 > carBfrCompressHeight + carPitChan;

   // Events
   const onResize = (event) => {
      const width = event[0].contentRect.width;

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
      <Select bind:value={comp1Name} bind:selected={comp1Obj} label="Type" options={overheadComps}>
         <Option value="Standard" disabled>Overhead Standard</Option>
         <Option value="Block Up">Overhead Block-Up</Option>
         <Option value="Back Roped" disabled>Overhead Back Roped</Option>
         <Option value="Basement" disabled>Basement / Hoistway</Option>
         <Option value="MRL Over" disabled>MRL Overslung</Option>
         <Option value="MRL Under" disabled>MRL Underslung</Option>
      </Select>

      <InputNumber bind:value={terminalSpeed} label="Terminal Speed" link={Links.get('terminalSpeed')} />
   </Fieldset>

   {#if !Links.get('underBeamHeight')}
      <Fieldset title="Sling Equipment">
         <InputLength bind:value={carSafetyHeight} label="Safety Height" />
         <InputLength bind:value={carShoeHeight} label="Car Shoe Height" />
         <InputLength bind:value={carShoePlateThick} label="Car Shoe Plate Thickness" />
      </Fieldset>
   {/if}
</div>

<svelte:component
   this={comp1Obj?.comp ?? Standard}
   bind:beamUnderside
   bind:clearOverhead
   bind:carEquipOffset
   bind:cwtEquipOffset
   bind:topToBeam
   {carTopClear}
   {cwtTopClear}
   {metric}
   {minCarTopClear}
   {minCwtTopClear}
   {overTravel}
   {railClear}
/>

<ParallelOverslung
   bind:botChanDepth
   bind:cabHeight
   bind:cornerPost
   bind:floorToPlate
   bind:floorToShoe
   bind:platformThickness
   bind:railHeight
   bind:safetyHeight={carSafetyHeight}
   bind:shoeHeight={carShoeHeight}
   bind:shoePlateThick={carShoePlateThick}
   bind:strikePlateThick
   bind:toeGuardLen
   bind:topChanDepth
   bind:underBeamHeight
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
