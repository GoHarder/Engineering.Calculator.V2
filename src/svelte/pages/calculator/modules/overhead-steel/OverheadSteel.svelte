<script>
   import { onDestroy, onMount } from 'svelte';

   import { clone, deepMerge } from 'lib/main.mjs';
   import { floorInc } from 'lib/math.mjs';

   import { OverheadSteelLinks as Links } from '../links';

   // Components
   import { Fieldset } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { Checkbox } from 'components/material/checkbox';
   import { Dialog, Title } from 'components/material/dialog';
   import { InputNumber } from 'components/material/input';
   import { ImageList, Item as ImageListItem } from 'components/material/image-list';
   import { Item, List, SubHeader } from 'components/material/list';

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
         reactLinks,
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

   console.log(project);

   // // OH Loading 1:1 2 car sheaves 2 cwt sheaves

   // const sheaveLoad1_1 = roping === 1 ? 2 * (carWeight + capacity + 0.5 * ropeWeight + 0.5 * compWeight) + sheaveWeight1 : 'Job is 2:1';
   // const sheaveLoad2_1 = roping === 1 ? 2 * (carWeight + capacity + 0.5 * ropeWeight + 0.5 * compWeight) + sheaveWeight2 : 'Job is 2:1';
   // const sheaveLoad3_1 = roping === 1 ? 2 * (cwtWeight + 0.5 * ropeWeight + 0.5 * compWeight) + sheaveWeight3 : 'Job is 2:1';
   // const sheaveLoad4_1 = roping === 1 ? 2 * (cwtWeight + 0.5 * ropeWeight + 0.5 * compWeight) + sheaveWeight4 : 'Job is 2:1';

   // // OH Loading 1:1 2 car sheaves 1 cwt sheaves

   // const sheaveLoad1_2 = roping === 1 ? 2 * (carWeight + capacity + 0.5 * ropeWeight + 0.5 * compWeight) + sheaveWeight1 : 'Job is 2:1';
   // const sheaveLoad2_2 = roping === 1 ? 2 * (carWeight + capacity + 0.5 * ropeWeight + 0.5 * compWeight) + sheaveWeight2 : 'Job is 2:1';
   // const sheaveLoad3_2 = roping === 1 ? 4 * (cwtWeight + 0.5 * ropeWeight + 0.5 * compWeight) + sheaveWeight3 : 'Job is 2:1';

   // // OH Loading 1:1 2 car sheaves 1 cwt sheaves

   // const sheaveLoad1_3 = roping === 1 ? 4 * (carWeight + capacity + 0.5 * ropeWeight + 0.5 * compWeight) + sheaveWeight1 : 'Job is 2:1';
   // const sheaveLoad2_3 = roping === 1 ? 2 * (cwtWeight + 0.5 * ropeWeight + 0.5 * compWeight) + sheaveWeight3 : 'Job is 2:1';
   // const sheaveLoad3_3 = roping === 1 ? 2 * (cwtWeight + 0.5 * ropeWeight + 0.5 * compWeight) + sheaveWeight3 : 'Job is 2:1';

   // // OH Loading 2:1 2 car sheaves 2 cwt sheaves

   // const deadEndHitch1_4 = roping === 2 ? carWeight + capacity + 0.5 * ropeWeight + 0.5 * compWeight + 50 : 'Job is 1:1';
   // const sheaveLoad1_4 = roping === 2 ? carWeight + capacity + 0.5 * ropeWeight + 0.5 * compWeight + sheaveWeight1 : 'Job is 1:1';
   // const sheaveLoad2_4 = roping === 2 ? carWeight + capacity + 0.5 * ropeWeight + 0.5 * compWeight + sheaveWeight2 : 'Job is 1:1';
   // const sheaveLoad3_4 = roping === 2 ? cwtWeight + 0.5 * ropeWeight + 0.5 * compWeight + sheaveWeight3 : 'Job is 1:1';
   // const sheaveLoad4_4 = roping === 2 ? cwtWeight + 0.5 * ropeWeight + 0.5 * compWeight + sheaveWeight4 : 'Job is 1:1';
   // const deadEndHitch2_4 = roping === 2 ? cwtWeight + 0.5 * ropeWeight + 0.5 * compWeight + 50 : 'Job is 1:1';

   // Variables
   // - Globals
   let carWeight = globals?.car?.weight ?? 0;
   let compWeight = globals?.compensation?.weight ?? 0;
   let cwtWeight = globals?.counterweight?.weight ?? 0;
   let ropeWeight = globals?.rope?.totalWeight ?? 0;

   // - Module
   let existing = module?.existing ?? false;
   let supplied = module?.existing ?? false;
   let steelSets = module?.steelSets ?? [];
   let reactLinks = module?.reactLinks ?? [];

   // - Reaction dialog
   let reactionDialog = false;
   let templateDialog = false;
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
         const label = from.members.length === 1 ? from.members[0].label : from.label;

         if (!toMember) toDelete.push(link.id);

         if (reactLoad) {
            reactLoad.deadLoad = from.reactions[link.use];
            reactLoad.label = `${label} ${link.use === 'rA' ? 'Ra' : 'Rb'}`;
         } else {
            const newLoad = {
               id: link.id,
               label: `${label} ${link.use === 'rA' ? 'Ra' : 'Rb'}`,
               deadLoad: from.reactions[link.use],
               length: 0,
               show: true,
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

      if (module?.steelSets) {
         module.steelSets = module.steelSets.map((set, i) => {
            set.delay = (i + 1) * 2000;
            return set;
         });
      }
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

<Dialog bind:show={templateDialog} fullScreen>
   <svelte:fragment slot="title">
      <Title>Load Template</Title>
   </svelte:fragment>

   <ImageList textProtection>
      <ImageListItem on:click={() => (templateDialog = false)} alt="Test Image" label="Image Label" select src="https://picsum.photos/300/300" />
      <ImageListItem on:click={() => (templateDialog = false)} alt="Test Image" label="Image Label" select src="https://picsum.photos/300/300" />
      <ImageListItem on:click={() => (templateDialog = false)} alt="Test Image" label="Image Label" select src="https://picsum.photos/300/300" />
      <ImageListItem on:click={() => (templateDialog = false)} alt="Test Image" label="Image Label" select src="https://picsum.photos/300/300" />
      <ImageListItem on:click={() => (templateDialog = false)} alt="Test Image" label="Image Label" select src="https://picsum.photos/300/300" />
      <ImageListItem on:click={() => (templateDialog = false)} alt="Test Image" label="Image Label" select src="https://picsum.photos/300/300" />
      <ImageListItem on:click={() => (templateDialog = false)} alt="Test Image" label="Image Label" select src="https://picsum.photos/300/300" />
   </ImageList>

   <svelte:fragment slot="actions">
      <Button on:click={() => (templateDialog = false)} variant="outlined" color="secondary">Cancel</Button>
   </svelte:fragment>
</Dialog>

<div class="container">
   <Fieldset title="Globals">
      <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} type="weight" />

      <InputNumber bind:value={carWeight} label="Car Weight" link={Links.get('carWeight')} {metric} type="weight" />

      <InputNumber bind:value={cwtWeight} label="Counterweight Weight" link={Links.get('cwtWeight')} {metric} type="weight" />

      <InputNumber bind:value={compWeight} label="Compensation Weight" link={Links.get('compWeight')} {metric} type="weight" />

      <InputNumber bind:value={ropeWeight} label="Rope Weight" link={Links.get('totalRopeWeight')} {metric} type="weight" />
   </Fieldset>

   <Fieldset title="Properties">
      <div class="properties">
         <Checkbox bind:checked={existing} label="Existing Steel" disabled={supplied} />

         <Checkbox bind:checked={supplied} label="H-W Supplied Steel" disabled={existing} />
      </div>

      {#if steelSets.length !== 0}
         <Button on:click={() => (templateDialog = true)} variant="contained">
            Load Template
            <svelte:fragment slot="trailingIcon">
               <Icon>file_open</Icon>
            </svelte:fragment>
         </Button>
      {/if}
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
   {#if steelSets.length === 0}
      <Button on:click={() => (templateDialog = true)} variant="contained">
         Load Template
         <svelte:fragment slot="trailingIcon">
            <Icon>file_open</Icon>
         </svelte:fragment>
      </Button>
   {/if}

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
