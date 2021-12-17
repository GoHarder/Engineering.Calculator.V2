<script>
   import { onMount } from 'svelte';

   import { clone } from 'lib/main.mjs';

   // Components
   import { InputLength, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let capacity = 0;
   export let height = 0;
   export let metric = false;
   export let model = 'Other';
   export let railSize = '';
   export let speed = 0;
   export let weight = 0;

   // Methods
   const getShoes = async () => {
      const token = localStorage.getItem('token');

      // Run fetch
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/shoes?capacity=${capacity}&speed=${speed}`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         shoes = [...body];
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Constants
   // Variables
   let options = [{ name: 'Other' }];
   let shoes = [];
   let shoeObj = {};

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (shoes.length > 0 && railSize) {
      options = clone(shoes).filter((shoe) => shoe.railSizes.includes(railSize));

      options = [...options, { name: 'Other' }];
   }

   $: if (shoeObj.weight) {
      height = showObj.height;
      weight = shoeObj.weight;
   }

   // Events
   // Lifecycle
   onMount(() => {
      getShoes();
   });
</script>

<Select bind:value={model} bind:selected={shoeObj} label="Shoe Model" {options}>
   {#each options as { name } (name)}
      <Option value={name}>{name}</Option>
   {/each}
</Select>

{#if model === 'Other'}
   <InputNumber bind:value={weight} label="Weight per Shoe" {metric} type="weight" />

   <InputLength bind:value={height} label="Shoe Height" {metric} />
{/if}

<style>
</style>
