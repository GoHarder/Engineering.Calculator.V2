<script>
   import { onMount } from 'svelte';

   import { HoistwayLinks as Links } from '../links';

   // Components
   import { Fieldset } from 'components/common';
   import { HelperText, InputLength, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   import ParallelOverslung from './components/ParallelOverslung.svelte';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {};

      const moduleData = {};

      project.globals = { ...project.globals, ...globalData };
      project.modules.hoistway = moduleData;
   };

   // Methods
   // Constants
   const { globals, metric, modules } = project;
   const { overallTravel } = globals;

   Links.setProject(modules);
   console.log(project);

   // Variables
   let terminalSpeed = globals?.terminalSpeed ?? 0;

   let cabHeight = globals?.cab?.height ?? 96;

   let cornerPost = globals?.platform?.cornerPost ?? false;
   let platformThickness = globals?.platform?.thickness ?? 0;

   let botChanDepth = globals?.sling?.botChanDepth ?? 8;
   let strikePlateThick = globals?.sling?.strikePlateThick ?? 1;
   let topChanDepth = globals?.sling?.topChanDepth ?? 8;
   let underBeamHeight = globals?.sling?.underBeamHeight ?? 114;

   let cwtHeight = globals?.counterweight?.height ?? 114;

   let carBufferHeight = globals?.buffers?.car?.height ?? 0;
   let cwtBufferHeight = globals?.buffers?.counterweight?.height ?? 0;

   let carBufferComp = globals?.buffers?.car?.compression ?? 5;
   let cwtBufferComp = globals?.buffers?.counterweight?.compression ?? 5;

   let compName = 'Standard';
   let toeGuardLen = 50.625;
   let railHeight = 42;
   let carPitChan = 2.625;
   let cwtPitChan = 2.625;
   let carBufferGap = 6;
   let cwtBufferGap = 6;

   let carBfrGrpHeight = 0;
   let cwtBfrGrpHeight = 0;

   let o_carBfrGrpHeight = false;
   let o_cwtBfrGrpHeight = false;

   // - Calculated
   let floorToPlate = 0;

   // - UI
   let divEle;
   let Observer;
   let sizeClass = 'large';
   let pitDepth = 64;

   // Subscriptions
   // Contexts
   // Reactive Rules

   $: carBfrGrpHeightCalc = Math.max(pitDepth - (carPitChan + carBufferGap + floorToPlate), carBufferHeight);

   $: carBfrCompressHeight = carBfrGrpHeight - carBufferComp;
   // $: cwtBfrCompressHeight = cwtBfrGrpHeight - cwtBufferComp;

   $: toeGuardError = toeGuardLen + 1 - floorToPlate > carBfrCompressHeight + carPitChan;

   $: console.table({
      toeGuardLen,
      floorToPlate,
      carBfrCompressHeight,
      carPitChan,
   });

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
      <Select bind:value={compName} label="Type">
         <Option value="Standard">Overhead Standard</Option>
         <Option value="Block Up" disabled>Overhead Block-Up</Option>
         <Option value="Back Roped" disabled>Overhead Back Roped</Option>
         <Option value="Basement" disabled>Basement / Hoistway</Option>
         <Option value="MRL Over" disabled>MRL Overslung</Option>
         <Option value="MRL Under" disabled>MRL Underslung</Option>
      </Select>

      <InputNumber bind:value={terminalSpeed} label="Terminal Speed" link={Links.get('terminalSpeed')} />
   </Fieldset>
</div>

<ParallelOverslung
   bind:botChanDepth
   bind:cabHeight
   bind:cornerPost
   bind:floorToPlate
   bind:platformThickness
   bind:railHeight
   bind:strikePlateThick
   bind:toeGuardLen
   bind:topChanDepth
   bind:underBeamHeight
   {Links}
   {metric}
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
         <InputLength bind:value={pitDepth} label="Pit Depth" invalid={toeGuardError}>
            <svelte:fragment slot="helperText">
               <HelperText validation>Toe Guard Is Hitting The Floor</HelperText>
            </svelte:fragment>
         </InputLength>
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
