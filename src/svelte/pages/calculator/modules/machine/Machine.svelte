<script>
   import { onDestroy, onMount } from 'svelte';

   import { clone } from 'lib/main.mjs';
   import { ceil, floor, round, roundInc } from 'lib/math.mjs';

   import * as gTables from '../tables';
   import { MachineLinks as Links } from '../links';

   // Components
   import { DataList, Fieldset, RopesInput, SafetyInput, ShoeInput } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, Input, InputNumber, InputLength } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {};

      const moduleData = {};

      project.globals = { ...project.globals, ...globalData };
      project.modules.machine = moduleData;
   };

   // Methods
   const getEngineeringData = async (type, location) => {
      const query = [
         `type=${type}`,
         `location=${location}`,
         `speed=${machineSpeed}`,
         `capacity=${machineCapacity}`,
         `counterbalance=${counterbalance}`,
         `roping=${roping}`,
      ].join('&');

      const token = localStorage.getItem('token');

      // Run fetch
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`api/engineering/machine?${query}`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         machines = [...body.machines, { name: 'Other', sheaves: [] }];

         maxRimWidth = body.maxRimWidth;
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Constants
   const { globals, modules, metric } = project;
   const { capacity, car, roping, speed, counterbalance, loading, machine, overallTravel } = globals;
   const { type: loadingType, freight: freightClass } = loading;
   const { capacity: machineCapacity, speed: machineSpeed } = machine;
   const { machine: module } = modules;
   Links.setProject(modules);

   // Variables
   let carWeight = car?.weight ?? 0;

   let type = 'Geared';
   let location = 'Overhead';
   let model = 'Other';

   // NOTE: For Convenience
   let sheaveModel = '';
   let arcOfContact = 0;
   let travelingCables = 0;
   let o_travelingCables = false;

   let compType = 'None';

   // - Database
   let machines = [];
   let maxRimWidth = 0;

   // - Objects
   let machineObj = {};

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: getEngineeringData(type, location);

   $: sheaves = machineObj?.sheaves ?? [];

   $: travelingCablesCalc = ceil((overallTravel * 0.25) / 4);

   // Events
   // Lifecycle
   onDestroy(() => {
      updateModule();
   });
</script>

<Fieldset title="Globals">
   <InputNumber bind:value={carWeight} label="Car Weight" link={Links.get('carWeight')} {metric} type="weight" />

   <InputNumber value={capacity} label="Capacity" link="/Project/Requirements" {metric} type="weight" />

   <InputNumber value={speed} label="Car Speed" link="/Project/Requirements" {metric} type="speed" />

   <InputNumber value={counterbalance * 100} label="Counterbalance" link="/Project/Requirements" suffix="%" />

   <Input value="{roping}:1" label="Roping" link="/Project/Requirements" />
</Fieldset>

<Fieldset title="Properties">
   <Select bind:value={type} label="Type">
      <Option value="Geared">Geared</Option>
      <Option value="Gearless">Gearles</Option>
   </Select>

   <Select bind:value={location} label="Location">
      <Option value="Overhead">Overhead</Option>
      <Option value="Hoistway">Hoistway</Option>
      <Option value="Basement">Basement</Option>
   </Select>

   <Select bind:value={model} bind:selected={machineObj} label="Model" options={machines}>
      {#each machines as { name } (name)}
         <Option value={name}>{name}</Option>
      {/each}
   </Select>

   {#if model && model !== 'Other'}
      <Select bind:value={sheaveModel} label="Traction Sheave">
         {#each sheaves as { name, diameter } (name)}
            <Option value={name}>{name} (Ø{floor(diameter)}")</Option>
         {/each}
      </Select>

      <InputNumber bind:value={arcOfContact} label="Arc Of Contact" type="angle" />
   {/if}

   <InputNumber bind:value={travelingCables} bind:override={o_travelingCables} label="Traveling Cable Weight" calc={travelingCablesCalc} {metric} type="weight" />

   {#if compType === 'None'}
      <Select bind:value={compType} label="Compensation">
         <Option value="None">None</Option>
         <Option value="Chain">Chain</Option>
         <Option value="Rope">Rope</Option>
      </Select>
   {/if}
</Fieldset>

<style>
</style>
