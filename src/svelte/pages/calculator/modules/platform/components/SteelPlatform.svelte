<script>
   import * as tables from '../tables';

   // Components
   import { Fieldset } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let assemblyThickness = 0;
   export let assemblyWeight = 0;
   export let metric = false;
   export let platformDepth = 0;
   export let platformWidth = 0;
   export let split = false;
   export let steelType = 'ASTM A36';
   export let useSillChannel = false;

   console.log(assemblyThickness, assemblyWeight, metric);

   // Methods
   const getChannel = async (steelType) => {
      const token = localStorage.getItem('token');

      // Run fetch
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/platform/steel/${steelType}`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         channels = [...body];
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Constants
   // Variables
   let disableSplit = false;
   let channels = [];

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: getChannel(steelType);

   $: if (platformWidth > 92 && platformDepth > 92) {
      split = true;
      disableSplit = true;
   } else {
      disableSplit = false;
   }

   // Events
   // Lifecycle
</script>

<Fieldset title="Steel">
   <Select bind:value={steelType} label="Type">
      {#each tables.steelTypes as { name } (name)}
         <Option value={name}>{name}</Option>
      {/each}
   </Select>

   <Checkbox bind:checked={split} disabled={disableSplit} label="Split" />

   <Checkbox bind:checked={useSillChannel} label="Sill Channel" />
</Fieldset>

<style>
</style>
