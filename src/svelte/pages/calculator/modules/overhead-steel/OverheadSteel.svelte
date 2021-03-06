<script>
   import { clone, deepMerge, debounce } from 'lib/main.mjs';
   import { capitalize } from 'lib/string.mjs';
   import { round } from 'lib/math.mjs';
   import { OverheadSteelLinks as Links } from '../links';

   // Components
   import { Fieldset } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { Checkbox } from 'components/material/checkbox';
   import { Dialog, Title } from 'components/material/dialog';
   import { Input, InputNumber } from 'components/material/input';
   import { Item, List, SubHeader } from 'components/material/list';

   import SteelSet from './components/SteelSet.svelte';
   import TemplateDialog from './components/tempalte-dialog/TemplateDialog.svelte';

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
   const sheaveLiveLoad = debounce((sheaves, load) => {
      if (sheaves.length === 0) return;

      const ropeLoad = round(load / 2, 1);

      if (sheaves.length === 1) {
         // NOTE: 5-11-2022 2:55 PM - split between two channels
         sheaves[0].liveLoad = round(load / 2, 1);
         return;
      }

      sheaves = sheaves.sort((a, b) => b.elevation - a.elevation);

      const distX = Math.abs(sheaves[1].length - sheaves[0].length);
      const distY = sheaves[0].elevation - sheaves[1].elevation;
      const hypotenuse = Math.sqrt(distX ** 2 + distY ** 2);
      const angle1 = Math.atan(distY / distX);
      const angle2 = Math.asin((sheaves[0].diameter / 2 - sheaves[1].diameter / 2) / hypotenuse);
      const sheave1AOC = angle1 + angle2 + Math.PI / 2;
      // const sheave2AOC = Math.PI - sheave1AOC;

      if (sheave1AOC * (180 / Math.PI) === 90) {
         sheaves[0].liveLoad = round(ropeLoad / 2, 1);
         sheaves[1].liveLoad = round(ropeLoad / 2, 1);
         return;
      }

      const ropeAngle = Math.PI - sheave1AOC;
      const loadX = Math.cos(ropeAngle) * ropeLoad;

      sheaves[0].liveLoad = round((ropeLoad + loadX) / 2, 1);
      sheaves[1].liveLoad = round((ropeLoad - loadX) / 2, 1);

      // console.log(sheaves);
      // console.log('angle 1', round(angle1 * (180 / Math.PI), 2));
      // console.log('sheave 2', round(sheave2AOC * (180 / Math.PI), 2));
   }, 5000);

   // Constants
   const { globals, metric, modules } = project;
   const { overheadSteel: module } = modules;
   const { capacity } = globals;
   const { roping } = globals;

   Links.setProject(modules);

   const dialogs = {
      default: { title: 'Select Load Type' },
      hitch: { title: 'Dead End Hitch' },
      reaction: { title: 'Reaction' },
      sheave: { title: 'Sheave' },
   };

   // Variables
   let sheaveLocations = { car: true, cwt: true };

   // - Load Dialog
   let dialog = 'default';
   let loadDialog = false;
   let loadEvent;
   let reactionOptions = [];

   // - Template
   let templateDialog = false;
   let template = [];

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
   $: carLiveLoad = round(2 * (carWeight + capacity + ropeWeight * 0.5 + compWeight * 0.5), 2);
   $: cwtLiveLoad = round(2 * (cwtWeight + ropeWeight * 0.5 + compWeight * 0.5), 2);

   // - Update Reactions
   $: members = steelSets.reduce((array, set) => [...array, ...set.members], []);
   $: reactions = members.reduce((array, member) => {
      const loads = member.loads.filter((load) => load.type === 'reaction');
      return [...array, ...loads];
   }, []);

   $: if (reactions.length > 0) {
      reactions.map((reaction) => {
         const from = steelSets.find((set) => set.id === reaction.from);
         if (!from) return;
         const label = from.members.length === 1 ? from.members[0].label : from.label;
         reaction.label = `${label} ${capitalize(reaction.use.toLowerCase())}`;
         reaction.deatLoad = from.reactions[reaction.use];
      });
   }

   $: hitches = members.reduce((array, member) => {
      const loads = member.loads.filter((load) => load.type === 'hitch');
      const locations = loads.map((load) => {
         return load.location;
      });
      return [...array, ...locations];
   }, []);

   $: sheaves = members.reduce((array, member) => {
      const loads = member.loads.filter((load) => load.type === 'sheave');
      return [...array, ...loads];
   }, []);

   $: if (sheaves.length > 0 && loadEvent !== undefined) {
      const { memberId } = loadEvent.detail;
      let car = true;
      let cwt = true;

      sheaveLocations = sheaves.reduce((object, sheave, i) => {
         const key = sheave.member;

         if (key in object === false) {
            object[key] = { car: 0, cwt: 0 };
         }

         if (sheave.location === 'car') {
            object[key].car++;
            car = false;
         }

         if (sheave.location === 'counterweight') {
            object[key].cwt++;
            cwt = false;
         }

         if (i === sheaves.length - 1) {
            if (object[memberId]) {
               const count = object[memberId];

               return { car: count.car < 2, cwt: count.cwt < 2 };
            } else {
               return { car, cwt };
            }
         }

         return object;
      }, {});
   }

   $: carSheaves = sheaves.filter((sheave) => sheave.location === 'car');

   $: cwtSheaves = sheaves.filter((sheave) => sheave.location === 'counterweight');

   $: sheaveLiveLoad(carSheaves, carLiveLoad);

   $: sheaveLiveLoad(cwtSheaves, cwtLiveLoad);

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

   const onAddLoadDialog = (event) => {
      const { setId, memberId } = event.detail;
      dialog = 'default';

      reactionOptions = clone(steelSets).reduce((output, set) => {
         if (set.id === setId) return output;

         const label = set.members.length === 1 ? set.members[0].label : set.label;
         const from = set.id;
         const option = { label, ...set.reactions, from, to: { set: setId, member: memberId } };

         output.push(option);

         return output;
      }, []);

      loadDialog = true;
      loadEvent = event;
   };

   const onDeleteSet = (event) => {
      steelSets = [...steelSets].filter((set) => set.id !== event.detail);
      const update = clone(steelSets);
      const members = update.reduce((array, set) => [...array, ...set.members], []);
      members.map((member) => {
         member.loads = member.loads.filter((load) => load.from !== event.detail);
      });
      steelSets = update;
   };

   const onLoadTemplate = () => {
      steelSets = template;
      template = [];
      templateDialog = false;
   };

   // Routes for select load
   const addHitch = (event) => {
      const update = clone(steelSets);
      const { setId, memberId } = loadEvent.detail;
      const set = update.find((_set) => _set.id === setId);
      const member = set.members.find((_member) => _member.id === memberId);
      const type = event.detail.target.dataset.select;
      const newLoad = {
         id: `load-${Date.now()}`,
         type: 'hitch',
         label: `${capitalize(type)} Dead End Hitch`,
         length: 0,
         liveLoad: round((type === 'car' ? carLiveLoad : cwtLiveLoad) / 2, 1),
         location: type,
         deadLoad: 25,
         show: true,
      };
      member.loads.push(newLoad);
      steelSets = update;
      loadEvent = undefined;
      loadDialog = false;
   };

   const addLoad = () => {
      const update = clone(steelSets);
      const { setId, memberId } = loadEvent.detail;
      const set = update.find((_set) => _set.id === setId);
      const member = set.members.find((_member) => _member.id === memberId);

      const newLoad = {
         id: `load-${Date.now()}`,
         type: 'load',
         label: `Load ${member.loads.length + 1}`,
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

   const addReaction = (event) => {
      const update = clone(steelSets);
      const { setId, memberId } = loadEvent.detail;
      const set = update.find((_set) => _set.id === setId);
      const member = set.members.find((_member) => _member.id === memberId);
      const select = event.detail.target.dataset.select;
      let [from, use] = select.split('_');

      from = update.find((set) => set.id === from);

      const label = from.members.length === 1 ? from.members[0].label : from.label;

      const newLoad = {
         id: `load-${Date.now()}`,
         from: from.id,
         use,
         type: 'reaction',
         label: `${label} ${capitalize(use.toLowerCase())}`,
         length: 0,
         liveLoad: 0,
         deadLoad: from.reactions[use],
         show: true,
      };

      member.loads.push(newLoad);
      steelSets = update;
      loadEvent = undefined;
      loadDialog = false;
   };

   const addSheave = (event) => {
      const update = clone(steelSets);
      const { setId, memberId } = loadEvent.detail;
      const set = update.find((_set) => _set.id === setId);
      const member = set.members.find((_member) => _member.id === memberId);
      const type = event.detail.target.dataset.select;

      const newLoad = {
         id: `load-${Date.now()}`,
         type: 'sheave',
         label: `${capitalize(type)} Sheave`,
         length: 0,
         liveLoad: 0,
         location: type,
         deadLoad: 0,
         sheave: '',
         diameter: 0,
         deflector: false,
         blockUp: { use: false, shape: '', size: '' },
         elevation: 0,
         member: member.id,
         show: true,
      };

      member.loads.push(newLoad);
      steelSets = update;
      loadEvent = undefined;
      loadDialog = false;
   };

   const onSelectLoad = (event) => {
      const type = event.detail.target.dataset.dialog;

      const cases = {
         load: addLoad,
         reaction: () => (dialog = 'reaction'),
         hitch: () => (dialog = 'hitch'),
         sheave: () => (dialog = 'sheave'),
      };

      cases[type]();
   };

   // Lifecycle

   // $: console.log(steelSets);
   // $: console.log(template);
</script>

<Dialog bind:show={loadDialog}>
   <svelte:fragment slot="title">
      <Title>{dialogs[dialog].title}</Title>
   </svelte:fragment>

   {#if dialog === 'default'}
      <List on:action={onSelectLoad} dense singleSelection>
         <Item data-dialog="load">General</Item>

         {#if reactionOptions.length !== 0}
            <Item data-dialog="reaction">Reaction</Item>
         {/if}

         <Item data-dialog="sheave">Sheave</Item>

         {#if roping > 1}
            <Item data-dialog="hitch">Dead End Hitch</Item>
         {/if}
      </List>
   {/if}

   {#if dialog === 'reaction'}
      <List on:action={addReaction} dense singleSelection>
         {#each reactionOptions as { from, label, rA, rB }}
            <SubHeader {label}>
               <Item data-select="{from}_rA">Ra {rA}lb</Item>
               <Item data-select="{from}_rB">Rb {rB}lb</Item>
            </SubHeader>
         {/each}
      </List>
   {/if}

   {#if dialog === 'hitch'}
      <List on:action={addHitch} dense singleSelection>
         {#if !hitches.includes('car')}
            <Item data-select="car">Car</Item>
         {/if}
         {#if !hitches.includes('counterweight')}
            <Item data-select="counterweight">Counterweight</Item>
         {/if}
      </List>
   {/if}

   {#if dialog === 'sheave'}
      <List on:action={addSheave} dense singleSelection>
         {#if sheaveLocations.car}
            <Item data-select="car">Car</Item>
         {/if}
         {#if sheaveLocations.cwt}
            <Item data-select="counterweight">Counterweight</Item>
         {/if}
      </List>
   {/if}

   <svelte:fragment slot="actions">
      {#if dialog === 'default'}
         <Button on:click={() => (loadDialog = false)} variant="outlined" color="secondary">Cancel</Button>
      {:else}
         <Button on:click={() => (dialog = 'default')} variant="outlined" color="secondary">Back</Button>
      {/if}
   </svelte:fragment>
</Dialog>

<TemplateDialog on:load={onLoadTemplate} bind:show={templateDialog} bind:template />

<div class="flex-row">
   <Fieldset title="Globals">
      <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} type="weight" />

      <Input value="{roping}:1" label="Roping" link="/Project/Requirements" />

      <InputNumber bind:value={carWeight} label="Car Weight" link={Links.get('carWeight')} {metric} type="weight" />

      <InputNumber bind:value={cwtWeight} label="Counterweight Weight" link={Links.get('cwtWeight')} {metric} type="weight" />

      <InputNumber bind:value={compWeight} label="Compensation Weight" link={Links.get('compWeight')} {metric} type="weight" />

      <InputNumber bind:value={ropeWeight} label="Rope Weight" link={Links.get('totalRopeWeight')} {metric} type="weight" />
   </Fieldset>

   <div style="width: 324px; display: grid; gap: 0.25em">
      <Fieldset title="Properties">
         <Checkbox bind:checked={existing} label="Existing Steel" disabled={supplied} />

         <Checkbox bind:checked={supplied} label="H-W Supplied Steel" disabled={existing} />
      </Fieldset>

      <div class="buttons">
         <Button on:click={() => (templateDialog = true)} variant="contained" class="button-1">
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
</div>

<div class="flex-row">
   {#each steelSets as set (set.id)}
      <SteelSet
         on:addLoad={onAddLoadDialog}
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
   .buttons {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.25em;
   }
</style>
