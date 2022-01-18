<script>
   import { onDestroy } from 'svelte';

   import { clone } from 'lib/main.mjs';

   // Components
   import { Fieldset } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { Checkbox } from 'components/material/checkbox';
   import { Dialog, Title } from 'components/material/dialog';
   import { OptGroup, Option, Select } from 'components/material/select';

   import SteelSet from './components/SteelSet.svelte';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {};

      const moduleData = {
         existing,
         supplied,
         steelSets,
         reactLinks,
      };

      project.globals = { ...project.globals, ...globalData };
      project.modules.overheadSteel = moduleData;
   };

   // Methods
   const getEngineeringData = async (supplied) => {
      const token = localStorage.getItem('token');

      // Run fetch
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/overhead-steel?supplied=${supplied}`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         steel = clone(body);
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Constants
   const { metric, modules } = project;
   const { overheadSteel: module } = modules;

   // Variables
   let existing = module?.existing ?? false;
   let supplied = module?.existing ?? false;
   let steelSets = module?.steelSets ?? [];
   let reactLinks = module?.reactLinks ?? [];

   // - UI
   let member1 = '';
   let reaction = '';
   let showReactDialog = false;

   // - Database information
   let steel = {
      cChannels: [],
      mcChannels: [],
      sBeams: [],
      wBeams: [],
   };

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: getEngineeringData(supplied);

   $: reactOpts = [];

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

   const onDeleteSet = (event) => (steelSets = [...steelSets].filter((set) => set.id !== event.detail));

   // Lifecycle
   onDestroy(() => {
      updateModule();
   });
</script>

<Dialog bind:open={showReactDialog}>
   <svelte:fragment slot="title">
      <Title>Add Reaction</Title>
   </svelte:fragment>

   <Select bind:value={reaction} label="Reaction">
      {#each reactOpts as { id, label, reactions, label, from, to }}
         <OptGroup {label}>
            <Option value={JSON.stringify({ id, label, from, to, point: 'rA' })}>Ra {reactions.rA}lb</Option>
            <Option value={JSON.stringify({ id, label, from, to, point: 'rB' })}>Rb {reactions.rB}lb</Option>
         </OptGroup>
      {/each}
   </Select>

   <svelte:fragment slot="actions">
      <Button color="secondary" variant="contained">Cancel</Button>
      <Button variant="contained" disabled={!reaction}>Create</Button>
   </svelte:fragment>
</Dialog>

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
      <SteelSet on:delete={onDeleteSet} bind:name bind:shape bind:members bind:label bind:reactions {id} {steel} {supplied} {existing} />
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
