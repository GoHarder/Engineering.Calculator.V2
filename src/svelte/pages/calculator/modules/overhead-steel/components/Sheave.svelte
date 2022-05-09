<script context="module">
   let _sheaves = [];
</script>

<script>
   import { createEventDispatcher, onMount } from 'svelte';
   import { floor } from 'lib/math.mjs';

   // Components
   import { Icon, IconButton } from 'components/material/button';
   import { InputLength } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
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

   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   let sheaves = [];
   let sheaveObj = {};

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (length || liveLoad || deadLoad) dispatch('update');

   // Events
   const onDelete = () => dispatch('delete', id);

   // Lifecycle
   onMount(async () => {
      if (_sheaves.length === 0) {
         await getSheaves();
      } else {
         sheaves = _sheaves;
      }
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

         <Select bind:sheave bind:selected={sheaveObj} label="Sheave" options={sheaves}>
            {#each sheaves as { diameter, _id, name } (_id)}
               <Option value={name}>{name} (Ø{floor(diameter)}")</Option>
            {/each}
         </Select>
      {/if}
   </div>
</div>

<style>
</style>
