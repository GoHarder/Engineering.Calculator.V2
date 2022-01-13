<script>
   import { clone, range } from 'lib/main.mjs';
   import { round } from 'lib/math.mjs';

   import * as gTables from '../../pages/calculator/modules/tables';

   // Components
   import Fieldset from 'components/common/Fieldset.svelte';
   import { InputNumber } from 'components/material/input';
   import { OptGroup, Option, Select } from 'components/material/select';

   // Stores
   // Properties
   export let travel = 0;
   export let roping = 1;
   export let ropeSize = 0.375;
   export let ropeQty = 1;
   export let type = 'None';
   export let ropeChainQty = 2;
   export let percentage = 1;
   export let compWeight = 0;
   export let compSheaveModel = '346-009B';
   export let compSheaveWeight = 0;
   export let compRopeSize = 0.375;
   export let compChainModel = 'WF15';

   // Methods
   // Constants
   const shv009B = [
      { value: 0.375, qty: range(2, 13) },
      { value: 0.4375, qty: range(2, 12) },
      { value: 0.5, qty: range(2, 11) },
      { value: 0.5625, qty: range(2, 10) },
      { value: 0.625, qty: range(2, 9) },
      { value: 0.393701, qty: range(2, 13) },
      { value: 0.433071, qty: range(2, 12) },
      { value: 0.472441, qty: range(2, 11) },
      { value: 0.511811, qty: range(2, 10) },
      { value: 0.551181, qty: range(2, 10) },
      { value: 0.590551, qty: range(2, 9) },
   ];

   const shv093B = [
      { value: 0.375, qty: range(2, 13) },
      { value: 0.4375, qty: range(2, 12) },
      { value: 0.5, qty: range(2, 11) },
      { value: 0.5625, qty: range(2, 10) },
      { value: 0.625, qty: range(2, 9) },
      { value: 0.6875, qty: range(2, 8) },
      { value: 0.75, qty: range(2, 8) },
      { value: 0.393701, qty: range(2, 13) },
      { value: 0.433071, qty: range(2, 12) },
      { value: 0.472441, qty: range(2, 11) },
      { value: 0.511811, qty: range(2, 10) },
      { value: 0.551181, qty: range(2, 10) },
      { value: 0.590551, qty: range(2, 9) },
      { value: 0.629921, qty: range(2, 9) },
      { value: 0.708661, qty: range(2, 8) },
   ];

   const shv091B = [
      { value: 0.375, qty: range(2, 13) },
      { value: 0.4375, qty: range(2, 12) },
      { value: 0.5, qty: range(2, 11) },
      { value: 0.5625, qty: range(2, 10) },
      { value: 0.625, qty: range(2, 9) },
      { value: 0.6875, qty: range(2, 8) },
      { value: 0.75, qty: range(2, 8) },
      { value: 0.393701, qty: range(2, 13) },
      { value: 0.433071, qty: range(2, 12) },
      { value: 0.472441, qty: range(2, 11) },
      { value: 0.511811, qty: range(2, 10) },
      { value: 0.551181, qty: range(2, 10) },
      { value: 0.590551, qty: range(2, 9) },
      { value: 0.629921, qty: range(2, 9) },
      { value: 0.708661, qty: range(2, 8) },
   ];

   // NOTE: 9-08-2021 2:23 PM - The weight isn't the entire assembly just the hanging weight
   // Info can be found in bulletin 1172 on the website

   // NOTE: 9-09-2021 8:33 AM - Comp sheave diameter isn't 40x the rope diameter its 32x ASME A17-1 2019 2.24.2.2(d)
   const compSheaves = [
      { name: '346-009B', description: '(20⌀)', weight: 700, shvQty: 1, tiedown: false, ropes: shv009B },
      { name: '346-093B', description: '(25⌀)', weight: 800, shvQty: 1, tiedown: false, ropes: shv093B },
      { name: '346-091B', description: '(30⌀)', weight: 900, shvQty: 1, tiedown: false, ropes: shv091B },
      { name: '346TD-009B', description: '(20⌀)', weight: 900, shvQty: 1, tiedown: true, ropes: shv009B },
      { name: '346TD-093B', description: '(25⌀)', weight: 1000, shvQty: 1, tiedown: true, ropes: shv093B },
      { name: '346TD-091B', description: '(30⌀)', weight: 1100, shvQty: 1, tiedown: true, ropes: shv091B },
      { name: '347-009B', description: '(20⌀)', weight: 1200, shvQty: 2, tiedown: false, ropes: shv009B },
      { name: '347-093B', description: '(25⌀)', weight: 1500, shvQty: 2, tiedown: false, ropes: shv093B },
      { name: '347-091B', description: '(30⌀)', weight: 1700, shvQty: 2, tiedown: false, ropes: shv091B },
      { name: '347TD-009B', description: '(20⌀)', weight: 1400, shvQty: 2, tiedown: true, ropes: shv009B },
      { name: '347TD-093B', description: '(25⌀)', weight: 1700, shvQty: 2, tiedown: true, ropes: shv093B },
      { name: '347TD-091B', description: '(30⌀)', weight: 1900, shvQty: 2, tiedown: true, ropes: shv091B },
   ];

   const compChains = [
      { name: 'WF75', description: '(0.75 lb/ft)', group: 1, weight: 0.0625 },
      { name: 'WF10', description: '(1.0 lb/ft)', group: 1, weight: 0.0833 },
      { name: 'WF15', description: '(1.5 lb/ft)', group: 1, weight: 0.125 },
      { name: 'WF20', description: '(2.0 lb/ft)', group: 1, weight: 0.1667 },
      { name: 'WF25', description: '(2.5 lb/ft)', group: 1, weight: 0.2083 },
      { name: 'WF30', description: '(3.0 lb/ft)', group: 1, weight: 0.25 },
      { name: 'WF35', description: '(3.5 lb/ft)', group: 1, weight: 0.2917 },
      { name: 'WF40', description: '(4.0 lb/ft)', group: 1, weight: 0.3333 },
      { name: 'SFC15', description: '(1.5 lb/ft)', group: 2, weight: 0.125 },
      { name: 'SFC20', description: '(2.0 lb/ft)', group: 2, weight: 0.1667 },
      { name: 'SFC25', description: '(2.5 lb/ft)', group: 2, weight: 0.2083 },
      { name: 'SFC30', description: '(3.0 lb/ft)', group: 2, weight: 0.25 },
      { name: 'SFC35', description: '(3.5 lb/ft)', group: 2, weight: 0.2917 },
      { name: 'SFC40', description: '(4.0 lb/ft)', group: 2, weight: 0.3333 },
   ];

   // Variables
   let compChainObj = {};
   let compRopeObj = {};
   let compSheaveObj = {};

   let compChainWeight = 0;

   // Subscriptions
   // Contexts
   // Reactive Rules

   // - Options
   $: filteredCompSheaves = clone(compSheaves).map((sheave) => {
      sheave.ropes = sheave.ropes.filter((rope) => rope.value === compRopeSize && rope.qty.includes(ropeChainQty));
      if (sheave.ropes.length > 0) return sheave;
   });
   $: filteredCompSheaves1 = filteredCompSheaves.filter((sheave) => sheave.shvQty === 1 && sheave.tiedown === false);
   $: filteredCompSheaves2 = filteredCompSheaves.filter((sheave) => sheave.shvQty === 1 && sheave.tiedown === true);
   $: filteredCompSheaves3 = filteredCompSheaves.filter((sheave) => sheave.shvQty === 2 && sheave.tiedown === false);
   $: filteredCompSheaves4 = filteredCompSheaves.filter((sheave) => sheave.shvQty === 2 && sheave.tiedown === true);

   $: filteredRopes = clone(gTables.ropeSizes).map((rope) => {
      // Convert the lb/ft to lb/in (rope.weightAv / 12)
      rope.qty = round(compWeight / ((rope.weightAv / 12) * travel));

      if (rope.qty <= 12) return rope;
   });

   $: filteredCompChains = clone(compChains).map((chain) => {
      chain.diff = round(Math.abs(round(compWeight / travel, 4) - chain.weight * ropeChainQty), 1);
      if (chain.diff === 0) return chain;
   });

   $: filteredCompChains1 = filteredCompChains.filter((chain) => chain.group === 1);
   $: filteredCompChains2 = filteredCompChains.filter((chain) => chain.group === 2);

   // - Calcs
   $: hoistRope = gTables.ropeSizes.find((rope) => rope.value === ropeSize);
   $: compWeight = round(travel * roping * ropeQty * (hoistRope.weightAv / 12) * percentage);

   $: if (compSheaveObj?.weight) {
      compSheaveWeight = compSheaveObj.weight;
   } else {
      compSheaveWeight = 0;
   }

   $: if (compChainObj?.weight) {
      compChainWeight = compChainObj.weight;
   } else {
      compChainWeight = roundInc(compWeight / travel / ropeChainQty, 0.5 / 12);
   }

   $: if (type === 'Rope' && compRopeObj?.qty) ropeChainQty = compRope.qty;

   // Events
   // Lifecycle
</script>

<Fieldset title="Compensation">
   <Select bind:value={type} label="Type">
      {#each gTables.compensation as { name } (name)}
         <Option value={name}>{name}</Option>
      {/each}
   </Select>

   <InputNumber bind:value={percentage} label="Compensation Percentage" type="percent" min="1" max="100" />

   {#if type === 'Chain'}
      <Select bind:value={compChainModel} bind:selected={compChainObj} label="Chain Model" options={[...filteredCompChains, { name: 'Other' }]}>
         {#if filteredCompChains1.length > 0}
            <OptGroup label="Whisperflex">
               {#each filteredCompChains1 as { name, description }}
                  <Option value={name}>{name} {description}</Option>
               {/each}
            </OptGroup>
         {/if}
         {#if filteredCompChains2.length > 0}
            <OptGroup label="Steadiflex">
               {#each filteredCompChains1 as { name, description }}
                  <Option value={name}>{name} {description}</Option>
               {/each}
            </OptGroup>
         {/if}

         <OptGroup label="Other Manufacturers">
            <Option value="Other">Other</Option>
         </OptGroup>
      </Select>

      <InputNumber bind:value={ropeChainQty} label="Quantity" />

      {#if compChainModel === 'Other'}
         <InputNumber value={compChainWeight} label="Chain Weight" readonly type="torque" />
      {/if}
   {/if}

   {#if type === 'Rope'}
      <Select bind:value={compRopeSize} bind:selected={compRopeObj} label="Rope Size" options={filteredRopes}>
         {#each filteredRopes as { name, value }}
            <Option {value}>{name}</Option>
         {/each}
      </Select>

      <InputNumber bind:value={ropeChainQty} label="Rope Quantity" />

      <Select bind:value={compSheaveModel} bind:selected={compSheaveObj} label="Sheave Model" options={[...filteredCompSheaves, { name: 'Other' }]}>
         {#if filteredCompSheaves1.length > 0}
            <OptGroup label="Single Sheave">
               {#each filteredCompSheaves1 as { name, description }}
                  <Option value={name}>{name} {description}</Option>
               {/each}
            </OptGroup>
         {/if}

         {#if filteredCompSheaves2.length > 0}
            <OptGroup label="Single Sheave With Tie Down">
               {#each filteredCompSheaves2 as { name, description }}
                  <Option value={name}>{name} {description}</Option>
               {/each}
            </OptGroup>
         {/if}

         {#if filteredCompSheaves3.length > 0}
            <OptGroup label="Double Sheave">
               {#each filteredCompSheaves3 as { name, description }}
                  <Option value={name}>{name} {description}</Option>
               {/each}
            </OptGroup>
         {/if}

         {#if filteredCompSheaves4.length > 0}
            <OptGroup label="Double Sheave With Tie Down">
               {#each filteredCompSheaves4 as { name, description }}
                  <Option value={name}>{name} {description}</Option>
               {/each}
            </OptGroup>
         {/if}

         <OptGroup label="Other Manufacturers">
            <Option value="Other">Other</Option>
         </OptGroup>
      </Select>

      {#if compSheaveModel === 'Other'}
         <InputNumber bind:value={compSheaveWeight} label="Sheave Weight" type="weight" />
      {/if}
   {/if}

   <InputNumber bind:value={compWeight} label="Weight" readonly type="weight" />
</Fieldset>

<style>
</style>
