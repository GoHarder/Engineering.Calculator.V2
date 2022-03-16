<script>
   import { onDestroy, onMount } from 'svelte';

   import { clone, deepMerge } from 'lib/main.mjs';
   import { floorInc } from 'lib/math.mjs';

   // Components
   import { Fieldset } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { Checkbox } from 'components/material/checkbox';
   import { Dialog, Title } from 'components/material/dialog';
   import { Item, List, SubHeader } from 'components/material/list';

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
         reactLinks,
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
   let reactLinks = module?.reactLinks ?? [];

   // - Reaction dialog
   let reactionDialog = false;
   let member1 = undefined;
   let reaction = undefined;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: reactOptions = clone(steelSets).reduce((output, set) => {
      const label = set.members.length === 1 ? set.members[0].label : set.label;
      const from = set.id;
      const members = set.members.map((member) => member.id);
      const option = { id: `link-${Date.now()}`, label, ...set.reactions, from, to: member1 };

      if (!members.includes(member1?.member ?? '')) output.push(option);

      return output;
   }, []);

   $: if (reactLinks.length > 0) {
      const update = clone(steelSets);
      const toDelete = [];

      reactLinks.forEach((link) => {
         const from = update.find((set) => set.id === link.from);
         const toSet = update.find((set) => set.id === link.to.set);
         const toMember = toSet?.members.find((member) => member.id === link.to.member);
         const reactLoad = toMember?.reactLoads.find((load) => load.id === link.id);

         if (!toMember) toDelete.push(link.id);

         if (reactLoad) {
            reactLoad.weight = from.reactions[link.use];
            reactLoad.label = `${link.label} ${link.use === 'rA' ? 'Ra' : 'Rb'}`;
         } else {
            const newLoad = {
               id: link.id,
               label: `${link.label} ${link.use === 'rA' ? 'Ra' : 'Rb'}`,
               weight: from.reactions[link.use],
               length: 0,
               show: true,
               type: 'Dead',
            };

            toMember?.reactLoads.push(newLoad);
         }
      });

      if (toDelete.length > 0) {
         reactLinks = [...reactLinks].filter((link) => !toDelete.includes(link.id));
      }

      steelSets = update;
   }

   // Events
   const onAddSet = () => {
      const id = `set-${Date.now()}`;

      const newSet = {
         delay: 0,
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
               reactions: { rA: 0, rB: 0 },
               o_lengthRb: false,
            },
         ],
         reactions: { rA: 0, rB: 0 },
      };

      steelSets = [...steelSets, newSet];
   };

   const onAddReaction1 = (event) => {
      member1 = event.detail;
      reactionDialog = true;
   };

   const onAddReaction2 = () => {
      reactLinks = [...reactLinks, reaction];
      member1 = undefined;
      reaction = undefined;
      reactionDialog = false;
   };

   const onDeleteSet = (event) => {
      reactLinks = [...reactLinks].filter((link) => link.to.set !== event.detail);
      steelSets = [...steelSets].filter((set) => set.id !== event.detail);
   };

   const onDeleteReaction = (event) => {
      reactLinks = [...reactLinks].filter((link) => link.id !== event.detail);
   };

   const onSelectReact = (event) => {
      const { index } = event.detail;
      const option = reactOptions[floorInc(index, 2)];
      option.use = index % 2 === 0 ? 'rA' : 'rb';
      reaction = option;
   };

   // Lifecycle
   onMount(() => {
      const { modules } = project;
      const { overheadSteel: module } = modules;

      module.steelSets = module.steelSets.map((set, i) => {
         set.delay = (i + 1) * 2000;
         return set;
      });
   });

   onDestroy(() => {
      updateModule();
   });
</script>

<Dialog bind:show={reactionDialog}>
   <svelte:fragment slot="title">
      {#if reactOptions.length > 0}
         <Title>Add Reaction</Title>
      {:else}
         <Title class="error">No Reactions</Title>
      {/if}
   </svelte:fragment>

   {#if reactOptions.length === 0}
      <p>No reactions are available</p>
   {:else}
      <List on:action={onSelectReact} dense singleSelection>
         {#each reactOptions as { label, rA, rB }}
            <SubHeader {label}>
               <Item>Ra {rA}lb</Item>
               <Item>Rb {rB}lb</Item>
            </SubHeader>
         {/each}
      </List>
   {/if}

   <svelte:fragment slot="actions">
      <Button on:click={() => (reactionDialog = false)} variant="outlined" color="secondary">Cancel</Button>

      {#if reactOptions.length > 0 && reaction}
         <Button on:click={onAddReaction2} variant="outlined" color="secondary">Ok</Button>
      {/if}
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
   {#each steelSets as { axis, delay, id, name, shape, members, reactions, label } (id)}
      <SteelSet
         on:addReaction={onAddReaction1}
         on:deleteReaction={onDeleteReaction}
         on:delete={onDeleteSet}
         bind:axis
         bind:label
         bind:members
         bind:name
         bind:reactions
         bind:shape
         {existing}
         {delay}
         {id}
         {supplied}
      />
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
