<script>
   import { onMount } from 'svelte';
   import { clone, deepMerge } from 'lib/main.mjs';
   import { floorInc } from 'lib/math.mjs';
   import { OverheadSteelLinks as Links } from '../links';

   // Components
   import { Fieldset } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { Checkbox } from 'components/material/checkbox';
   import { InputNumber } from 'components/material/input';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {
         car: {
            weight: carWeight,
         },
         compensation: {
            weight: compWeight,
         },
         counterweight: {
            weight: cwtWeight,
         },
         rope: {
            totalWeight: ropeWeight,
         },
      };

      const moduleData = {
         existing,
         supplied,
         steelSets,
      };

      // project.globals = { ...project.globals, ...globalData };
      project.globals = deepMerge(project.globals, globalData);
      project.modules.overheadSteel = moduleData;
   };

   // Methods
   // Constants
   const { globals, metric, modules } = project;
   const { overheadSteel: module } = modules;
   const { capacity } = globals;

   Links.setProject(modules);

   // Variables
   let Observer;
   let divEle;
   let sizeClass = 'large';

   // - Globals
   let carWeight = globals?.car?.weight ?? 0;
   let compWeight = globals?.compensation?.weight ?? 0;
   let cwtWeight = globals?.counterweight?.weight ?? 0;
   let ropeWeight = globals?.rope?.totalWeight ?? 0;

   // - Module
   let existing = module?.existing ?? false;
   let supplied = module?.existing ?? false;
   let steelSets = module?.steelSets ?? [];

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events

   const onResize = (event) => {
      // const width = event[0].contentRect.width + (metric ? 0 : 210);
      const width = event[0].contentRect.width;
      console.log(width);

      // if (width < 910) {
      //    sizeClass = 'small';
      //    return;
      // }

      // if (width < 1270) {
      //    sizeClass = 'medium';
      //    return;
      // }

      sizeClass = 'large';
   };

   // Lifecycle

   onMount(() => {
      Observer = new ResizeObserver(onResize);
      Observer.observe(divEle);
   });
</script>

<div bind:this={divEle} class="overhead-steel {sizeClass}">
   <div class="row-1">
      <Fieldset title="Globals" style="grid-row: span 2 / auto;">
         <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} type="weight" />

         <InputNumber bind:value={carWeight} label="Car Weight" link={Links.get('carWeight')} {metric} type="weight" />

         <InputNumber bind:value={cwtWeight} label="Counterweight Weight" link={Links.get('cwtWeight')} {metric} type="weight" />

         <InputNumber bind:value={compWeight} label="Compensation Weight" link={Links.get('compWeight')} {metric} type="weight" />

         <InputNumber bind:value={ropeWeight} label="Rope Weight" link={Links.get('totalRopeWeight')} {metric} type="weight" />
      </Fieldset>

      <Fieldset title="Properties">
         <Checkbox bind:checked={existing} label="Existing Steel" disabled={supplied} />

         <Checkbox bind:checked={supplied} label="H-W Supplied Steel" disabled={existing} />
      </Fieldset>

      <div class="buttons">
         {#if steelSets.length === 0}
            <Button variant="contained" class="button-1">
               Load Template
               <svelte:fragment slot="trailingIcon">
                  <Icon>file_open</Icon>
               </svelte:fragment>
            </Button>
         {/if}

         <Button variant="contained" class="button-2">
            Add Steel
            <svelte:fragment slot="trailingIcon">
               <Icon>add</Icon>
            </svelte:fragment>
         </Button>
      </div>
   </div>
</div>

<style lang="scss">
   .row-1 {
      display: grid;
      gap: 0.25em;
      margin: 0.25em;
      align-items: start;
      grid-template-columns: repeat(auto-fill, min(324px, 428px));
      grid-template-rows: 186px auto;
      max-width: 652px;
   }

   .buttons {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.25em;
   }

   // 628 836

   // :global {

   // .overhead-steel {
   //    .row-1 {
   //       .globals {
   //          grid-area: gl;
   //       }
   //       .properties {
   //          grid-area: pr;
   //       }

   //       .buttons {
   //          grid-area: bt;
   //          display: grid;
   //          grid-template-columns: 1fr 1fr;
   //          gap: 0.25em;
   //       }
   //    }

   // &.small {
   //    .row-1 {
   //       display: grid;
   //       gap: 0.25em;
   //       margin: 0.25em;
   // grid-template: {
   //    columns: 324px min(0px, 104);
   //    rows: auto;
   //    // areas: 'gl gl' 'pr .' 'bt .';
   // }
   // }
   // }

   // &.large {
   //    .row-1 {
   //       display: grid;
   //       gap: 0.25em;
   //       margin: 0.25em;
   //       // grid-template: {
   //       //    columns:  ;
   //       //    // rows: auto;
   //       //    // areas: 'gl gl' 'pr .' 'bt .';
   //       // }
   //    }
   // }
   // }
   // }
</style>
