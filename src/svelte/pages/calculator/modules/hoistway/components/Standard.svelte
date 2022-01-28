<script>
   import { onDestroy, onMount } from 'svelte';
   import { classList } from 'components/lib';

   import * as tables from '../tables';
   import { HoistwayLinks as Links } from '../../links';

   // Components
   import { Fieldset } from 'components/common';
   import { InputLength } from 'components/material/input';

   // Stores
   // Properties
   export let project;

   console.log(project);

   // Methods
   // Constants
   const { globals, modules } = project;

   Links.setProject(modules);

   // need cwt height

   // Variables
   // - Globals
   let carBufferComp = globals?.buffers?.car?.compression ?? 5;
   let carBufferStyle = 'Oil';

   let cwtBufferComp = globals?.buffers?.counterweight?.compression ?? 5;
   let cwtBufferHeight = globals?.buffers?.counterweight?.height ?? 0;
   let cwtBufferStyle = 'Oil';
   let cwtHeight = globals?.counterweight?.height ?? 114;

   let terminalSpeed = globals?.terminalSpeed ?? 0;

   // - Pit
   let carPitChan = 2.625;
   let cwtPitChan = 2.625;
   let carBufferGap = 6;
   let cwtBufferGap = 6;
   let pitDepth = 64;

   let carBrfGrpHeight = 0;
   let cwtBfrGrpHeight = 0;

   let floorToPlate = 18;

   let o_carBrfGrpHeight = false;
   let o_cwtBfrGrpHeight = false;

   // - UI
   let divEle;
   let Observer;
   let sizeClass = 'small';

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: pitSecitonClass = classList(['pit-section', sizeClass]);

   $: carBfrGrpHeightCalc = pitDepth - (carPitChan + carBufferGap + floorToPlate);

   // - Stoping Distance
   $: carStopDist = tables.getStopDist(carBufferStyle, terminalSpeed);
   $: cwtStopDist = tables.getStopDist(cwtBufferStyle, terminalSpeed);

   // - Minimum Top Clearance
   $: minCarTopClear = cwtBufferGap + cwtBufferComp + 24 + cwtStopDist;
   $: minCwtTopClear = carBufferGap + carBufferComp + 6 + carStopDist + 18;

   // - Top Clearance
   $: cwtTopClear = carBufferGap + carBufferComp - (cwtHeight + cwtBufferGap + cwtBfrGrpHeight + cwtPitChan);

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
   <div class={pitSecitonClass}>
      <div class="pit-section-title">
         <legend>Pit Dimensions</legend>
         <hr />
      </div>

      <fieldset class="pit-section-car">
         <legend>Car</legend>
         <hr />
         <InputLength bind:value={pitDepth} label="Pit Depth" />
         <InputLength bind:value={floorToPlate} label="Floor To Plate" />
         <InputLength bind:value={carBufferGap} label="Gap" />
         <InputLength bind:value={carBrfGrpHeight} bind:override={o_carBrfGrpHeight} label="Buffer Height" calc={carBfrGrpHeightCalc} />
         <InputLength bind:value={carBufferComp} label="Buffer Compression" link={Links.get('carBufferComp')} />
         <InputLength bind:value={carPitChan} label="Pit Channel" />
      </fieldset>

      <img src="/public/img/hoistway/hoistway-pit.svg" alt="Hoistway Pit" class="pit-section-img" />

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
