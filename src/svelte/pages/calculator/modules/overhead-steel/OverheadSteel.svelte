<script>
   import { onMount } from 'svelte';
   import { clone, deepMerge } from 'lib/main.mjs';
   import { floorInc } from 'lib/math.mjs';
   import { OverheadSteelLinks as Links } from '../links';

   // Components
   import { Fieldset } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { Checkbox } from 'components/material/checkbox';
   import { Dialog, Title } from 'components/material/dialog';
   import { Input, InputNumber } from 'components/material/input';

   import SteelSet from './components/SteelSet.svelte';

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
   const { roping } = globals;

   Links.setProject(modules);

   // Variables
   let Observer;
   let divEle;
   let sizeClass = 'large';

   // - Load Dialog
   let loadDialog = false;
   let loadEvent;
   let reactionOptions = [];

   // - Globals
   let carWeight = globals?.car?.weight ?? 0;
   let compWeight = globals?.compensation?.weight ?? 0;
   let cwtWeight = globals?.counterweight?.weight ?? 0;
   let ropeWeight = globals?.rope?.totalWeight ?? 0;

   // - Module
   let existing = module?.existing ?? false;
   let supplied = module?.existing ?? false;
   let steelSets = module?.steelSets ?? [];

   $: console.log(steelSets);

   // Subscriptions
   // Contexts
   // Reactive Rules
   // $: reactionOptions = clone(steelSets).reduce((output, set) => {
   //    const label = set.members.length === 1 ? set.members[0].label : set.label;
   //    const from = set.id;
   //    const option = { id: `link-${Date.now()}`, label, ...set.reactions, from };

   //    return output;
   // }, []);

   // Events
   const onAddSet = () => {
      const id = `set-${Date.now()}`;

      const newSet = {
         axis: 'x',
         id,
         label: 'Unnamed Set',
         shape: '',
         name: '',
         members: [
            {
               id: `member-${Date.now()}`,
               label: 'Unnamed Member',
               length: 0,
               lengthRb: 0,
               loads: [],
               reactions: { rA: 0, rB: 0 },
               o_lengthRb: false,
            },
         ],
         reactions: { rA: 0, rB: 0 },
      };

      steelSets = [...steelSets, newSet];
   };

   const onAddLoad = (event) => {
      const { setId, memberId } = event.detail;

      reactionOptions = clone(steelSets).reduce((output, set) => {
         if (set.id === setId) return output;

         console.log(set);

         // const label = set.members.length === 1 ? set.members[0].label : set.label;
         // const from = set.id;
         // const option = { id: `link-${Date.now()}`, label, ...set.reactions, from };

         // console.log(option);

         return output;
      }, []);

      loadDialog = true;
      loadEvent = event;
   };

   const onAddLoad1 = () => {
      const update = clone(steelSets);
      const { setId, memberId } = loadEvent.detail;
      const set = update.find((_set) => _set.id === setId);
      const member = set.members.find((_member) => _member.id === memberId);
      const newLoad = {
         id: `load-${Date.now()}`,
         type: 'load',
         label: `Load`,
         length: 0,
         liveLoad: 0,
         deadLoad: 0,
         show: true,
      };

      member.loads.push(newLoad);
      steelSets = update;
      loadEvent = undefined;
      loadDialog = false;
   };

   const onDeleteSet = (event) => {
      steelSets = [...steelSets].filter((set) => set.id !== event.detail);
   };

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
      // Observer = new ResizeObserver(onResize);
      // Observer.observe(divEle);
   });
</script>

<Dialog bind:show={loadDialog}>
   <svelte:fragment slot="title">
      <Title>Select Load Type</Title>
   </svelte:fragment>

   <div class="load-buttons">
      <Button on:click={onAddLoad1} variant="contained">General</Button>

      {#if reactionOptions.length !== 0}
         <Button variant="contained">Reaction</Button>
      {/if}

      <Button variant="contained">Sheave</Button>

      {#if roping > 1}
         <Button variant="contained">Dead End Hitch</Button>
      {/if}
   </div>

   <svelte:fragment slot="actions">
      <Button on:click={() => (loadDialog = false)} variant="outlined" color="secondary">Cancel</Button>
   </svelte:fragment>
</Dialog>

<div class="row-1">
   <Fieldset title="Globals" style="grid-row: span 2 / auto;">
      <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} type="weight" />

      <Input value="{roping}:1" label="Roping" link="/Project/Requirements" />

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
      <Button variant="contained" class="button-1">
         Load Template
         <svelte:fragment slot="trailingIcon">
            <Icon>file_open</Icon>
         </svelte:fragment>
      </Button>

      {#if steelSets.length === 0}
         <Button on:click={onAddSet} variant="contained" class="button-2">
            Add Steel
            <svelte:fragment slot="trailingIcon">
               <Icon>add</Icon>
            </svelte:fragment>
         </Button>
      {/if}
   </div>
</div>

<div bind:this={divEle} class="overhead-steel-sets {sizeClass}">
   {#each steelSets as set (set.id)}
      <SteelSet
         on:addLoad={onAddLoad}
         on:delete={onDeleteSet}
         bind:axis={set.axis}
         bind:label={set.label}
         bind:members={set.members}
         bind:name={set.name}
         bind:reactions={set.reactions}
         bind:shape={set.shape}
         id={set.id}
         {existing}
         {metric}
         {supplied}
      />
   {/each}
</div>

<div class="flex-row">
   {#if steelSets.length > 0}
      <Button on:click={onAddSet} variant="contained" class="button-2">
         Add Steel
         <svelte:fragment slot="trailingIcon">
            <Icon>add</Icon>
         </svelte:fragment>
      </Button>
   {/if}
</div>

<style lang="scss">
   .row-1 {
      display: grid;
      gap: 0.25em;
      margin: 0.25em;
      align-items: start;
      grid-template-columns: repeat(auto-fill, min(324px, 428px));
      grid-template-rows: 192px auto;
      max-width: 652px;
   }

   .overhead-steel-sets {
      margin: 0.25em;
   }

   .buttons {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.25em;
   }

   .load-buttons {
      display: grid;
      gap: 0.25em;
   }
</style>
