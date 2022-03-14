<script>
   import { onDestroy, onMount } from 'svelte';

   import { clone, deepMerge } from 'lib/main.mjs';

   // Components
   import { Fieldset } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { Checkbox } from 'components/material/checkbox';
   import { Dialog, Title } from 'components/material/dialog';
   import { OptGroup, Option, Select } from 'components/material/select';

   import SteelSet from './components/SteelSet.svelte';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {};

      const moduleData = {
         existing,
         supplied,
         steelSets,
         // reactLinks,
      };

      // project.globals = { ...project.globals, ...globalData };
      project.globals = deepMerge(project.globals, globalData);
      project.modules.overheadSteel = moduleData;
   };

   // Methods
   // Constants
   const { modules } = project;
   const { overheadSteel: module } = modules;

   // Variables

   let existing = module?.existing ?? false;
   let supplied = module?.existing ?? false;
   let steelSets = module?.steelSets ?? [];
   // let reactLinks = module?.reactLinks ?? [];

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events

   const onAddSet = () => {
      const id = `set-${Date.now()}`;

      const newSet = {
         show: false,
         axis: 'x',
         id,
         label: 'Unnamed Set',
         shape: '',
         name: '',
         members: [
            {
               i: 1,
               id: `member-${Date.now()}`,
               label: 'Unnamed Member',
               length: 0,
               lengthRb: 0,
               pointLoads: [],
               reactLoads: [],
               links: [],
               reactions: { rA: 0, rB: 0 },
               o_lengthRb: false,
            },
         ],
         reactions: { rA: 0, rB: 0 },
      };

      steelSets = [...steelSets, newSet];
   };

   const onDeleteSet = (event) => (steelSets = [...steelSets].filter((set) => set.id !== event.detail));

   // Lifecycle
   onMount(() => {
      const { modules } = project;
      const { overheadSteel: module } = modules;

      module.steelSets = module.steelSets.map((set, i) => {
         set.delay = i + 1 * 2000;
         return set;
      });
   });

   onDestroy(() => {
      updateModule();
   });
</script>

<div class="container">
   <Fieldset title="Properties">
      <div class="properties">
         <Checkbox bind:checked={existing} label="Existing Steel" disabled={supplied} />

         <Checkbox bind:checked={supplied} label="H-W Supplied Steel" disabled={existing} />
      </div>
   </Fieldset>
</div>

<div class="container">
   {#each steelSets as { axis, delay, id, name, shape, members, reactions, label } (id)}
      <SteelSet on:delete={onDeleteSet} bind:axis bind:label bind:members bind:name bind:shape {existing} {delay} {id} {supplied} />
   {/each}
</div>

<div class="container">
   <Button on:click={onAddSet} variant="contained">
      Add Steel
      <svelte:fragment slot="trailingIcon">
         <Icon>add</Icon>
      </svelte:fragment>
   </Button>
</div>

<style>
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      margin: 0.25em;
      gap: 0.25em;
   }

   .properties {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 0.5em;
      margin-right: 12px;
   }
</style>
