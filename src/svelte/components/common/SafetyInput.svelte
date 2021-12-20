<script>
   import { onMount } from 'svelte';

   import { clone } from 'lib/main.mjs';

   // Components
   import { InputLength, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let height = 0;
   export let metric = false;
   export let model = 'Other';
   export let railSize = '';
   export let speed = 0;
   export let weight = 0;

   // Methods
   const getSafeties = async () => {
      const token = localStorage.getItem('token');

      // Run fetch
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/safety?speed=${speed}`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         safeties = [...body];
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Constants
   // Variables
   let options = [{ name: 'Other' }];
   let safeties = [];
   let safetyObj = {};

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (safeties.length > 0 && railSize) {
      options = clone(safeties).filter((safety) => safety.railSizes.includes(railSize));

      options = [...options, { name: 'Other' }];
   }

   $: if (safetyObj.weight) {
      height = safetyObj.height;
      weight = safetyObj.weight;
   }

   // Events
   // Lifecycle
   onMount(() => {
      getSafeties();
   });
</script>

<Select bind:value={model} bind:selected={safetyObj} label="Safety Model" {options}>
   {#each options as { name } (name)}
      <Option value={name}>{name}</Option>
   {/each}
</Select>

{#if model === 'Other'}
   <InputNumber bind:value={weight} label="Safety Weight" {metric} type="weight" />

   <InputLength bind:value={height} label="Safety Height" {metric} />
{/if}

<style>
</style>
