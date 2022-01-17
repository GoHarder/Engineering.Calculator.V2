<script>
   import { onDestroy } from 'svelte';

   // Components
   import { Fieldset } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { Checkbox } from 'components/material/checkbox';

   import SteelSet from './components/SteelSet.svelte';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {};

      const moduleData = {};

      project.globals = { ...project.globals, ...globalData };
      project.modules.overheadSteel = moduleData;
   };

   // Methods
   // Constants
   const { metric, modules } = project;
   const { overheadSteel: module } = modules;

   console.log(project);

   // Variables
   let existing = false;
   let supplied = false;
   let steelSets = [];

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onAddSet = () => {
      const id = `set-${Date.now()}`;

      const newSet = {
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
               pointLoads: [],
               reactLoads: [],
               links: [],
               reactions: { rA: 0, rB: 0 },
            },
         ],
         reactions: { rA: 0, rB: 0 },
      };

      steelSets = [...steelSets, newSet];
   };

   // Lifecycle
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
   {#each steelSets as { id, name, shape, members, reactions, label } (id)}
      <SteelSet bind:name bind:shape bind:members bind:label bind:reactions {id} {supplied} {existing} />
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
   }
</style>
