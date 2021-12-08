<script>
   import { onMount } from 'svelte';

   import { floor, round } from 'lib/math.mjs';

   // Components
   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let assemblyThickness = 0;
   export let assemblyWeight = 0;
   export let designCapacity = 0;
   export let platformDepth = 0;
   export let platformWidth = 0;

   // Methods
   const getAngle = async () => {
      const token = localStorage.getItem('token');

      // Run fetch
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/platform/wood`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         angles = [...body];
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Constants
   // Variables
   let angles = [];

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: angle = angles?.find((row) => {
      const sectionModulus = round((platformWidth * designCapacity) / 300000, 2);
      return row.modulusX >= sectionModulus;
   });

   $: assemblyThickness = angle?.depth ?? 0;
   $: plywoodWidth = platformWidth - (angle?.thickness ?? 0) * 2;
   $: plywoodDepth = platformDepth - (angle?.thickness ?? 0) * 2;
   $: plywoodQty = angle?.depth - 1;
   $: plywoodWeight = round(plywoodQty * plywoodWidth * plywoodDepth * (2.046875 / 144)); // 3/4" Weight = 2.046875 lb/ft²
   $: woodStringerQty = floor(plywoodDepth / 10.875);
   $: stringerWeight = round(woodStringerQty * plywoodWidth * (2.7 / 12)); // 2 X 8 Weight = 2.7 lb/ft
   $: angleWeight = round(plywoodWidth * (angle?.weight ?? 0) * 2 + platformDepth * (angle?.weight ?? 0) * 2);
   $: fireProofWeight = round(plywoodWidth * plywoodDepth * (3.125 / 144)); // 14GA Weight = 3.125 lb/ft²
   $: assemblyWeight = round(plywoodWeight + stringerWeight + angleWeight + fireProofWeight, 1);

   // Events
   // Lifecycle
   onMount(() => {
      getAngle();
   });
</script>

<style>
</style>
