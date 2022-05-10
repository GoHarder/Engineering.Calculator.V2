<script context="module">
   let _sheaves = [];
   let _steel = {};
</script>

<script>
   import { createEventDispatcher, getContext, onDestroy, onMount } from 'svelte';
   import { floor, round } from 'lib/math.mjs';

   // Components
   import { Icon, IconButton } from 'components/material/button';
   import { Checkbox } from 'components/material/checkbox';
   import { InputLength, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let elevation;
   export let deadLoad;
   export let diameter = 0;
   export let id;
   export let label;
   export let length;
   export let liveLoad;
   export let metric;
   export let sheave;
   export let show;

   // Methods
   const getSheaves = async () => {
      const token = localStorage.getItem('token');

      // Run fetch
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/overhead-steel/sheaves`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         sheaves = [...body];
         _sheaves = sheaves;
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   const getSteel = async () => {
      const token = localStorage.getItem('token');

      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/overhead-steel?supplied=false`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         steel = { ...body };
         _steel = steel;
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let sheaves = [];
   let steel = {};
   let sheaveObj = {};
   let blockObj = {};

   let blockUp = false;
   let shape = '';
   let size = '';
   let deflector = false;
   let memberObj = {};

   // Contexts
   const { contextStore } = getContext('steelSet');

   // Subscriptions
   const clearContextStore = contextStore.subscribe((store) => (memberObj = store));

   // Reactive Rules
   $: if (length || liveLoad || deadLoad) dispatch('update');

   // - Objects
   $: pillowBlockObj = sheaveObj?.pillowBlocks?.find((block) => block.holes === holes) ?? {};

   // - Calcs
   $: diameter = sheaveObj?.diameter ?? 0;

   /**
    * NOTE: 5-10-2022 9:46 AM
    * Sheave shaft drawing is 331-035
    * Average weight is pulled from three models found in the valut
    * 331-035 HD  | 160.419 lbs
    * 331-035     | 60.21 lbs
    * 331-035-005 | 112.344 lbs
    * Estimated shaft = 110 lbs
    */

   // Block up roughly 16" long
   $: blockWeight = (blockObj?.weight ?? 0) * 16;

   $: deadLoad = round(110 + blockWeight + (sheaveObj?.weight ?? 0) + (pillowBlockObj?.weight ?? 0) * 2, 1);

   $: steelSizes = steel[shape] || [];

   $: shapeAbbv = memberObj?.name?.match(/(^[MCSW]+)/g)[0] ?? '';

   $: holes = ['C', 'MC'].includes(shapeAbbv) ? 2 : 4;

   $: memberDepth = memberObj?.depth ?? 0;

   $: elevation = (deflector ? 0 : memberDepth) + (blockObj?.depth ?? 0);

   $: console.log(elevation);

   // Events
   const onDelete = () => dispatch('delete', id);

   // Lifecycle
   onMount(async () => {
      if (_sheaves.length === 0) {
         await getSheaves();
         await getSteel();
      } else {
         sheaves = _sheaves;
         steel = _steel;
      }
   });

   onDestroy(() => {
      clearContextStore();
   });
</script>

<div class="load" class:show>
   <div class="title">
      <span class="label">{label}</span>

      <IconButton bind:on={show} toggle class="density-3" toolTip={show ? 'Minimize' : 'Maximize'}>
         <Icon class="mdc-icon-button__icon--on">minimize</Icon>
         <Icon>maximize</Icon>
      </IconButton>

      <IconButton on:click={onDelete} class="density-3" toolTip="Delete">
         <Icon>close</Icon>
      </IconButton>
   </div>

   <div class="form">
      {#if show}
         <InputLength bind:value={length} label="Length From R<sub>a</sub>" {metric} />

         <Select bind:value={sheave} bind:selected={sheaveObj} label="Sheave" options={sheaves}>
            {#each sheaves as { diameter, _id, name } (_id)}
               <Option value={name}>{name} (Ø{floor(diameter)}")</Option>
            {/each}
         </Select>

         <Select bind:value={deflector} label="Location" type="boolean">
            <Option value="false">Above</Option>
            <Option value="true">Below</Option>
         </Select>

         {#if !deflector}
            <Checkbox bind:checked={blockUp} label="Use Block Up" />

            {#if blockUp}
               <Select bind:value={shape} label="Shape">
                  <Option value="cChannels">C Channel</Option>
                  <Option value="mcChannels">MC Channel</Option>
                  <Option value="sBeams">S Beam</Option>
                  <Option value="wBeams">W Beam</Option>
               </Select>

               <Select bind:value={size} bind:selected={blockObj} label="Size" disabled={steelSizes.length === 0} options={steelSizes}>
                  {#each steelSizes as { _id, name } (_id)}
                     <Option value={name}>{name}</Option>
                  {/each}
               </Select>
            {/if}
         {/if}

         <InputNumber value={liveLoad} label="Live Load" readonly step="0.1" type="weight" {metric} />

         <InputNumber value={deadLoad} label="Dead Load" readonly step="0.1" type="weight" {metric} />
      {/if}
   </div>
</div>

<style>
</style>
