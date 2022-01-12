<script>
   import { onDestroy, onMount } from 'svelte';

   import { clone } from 'lib/main.mjs';
   import { ceil, floor, round, roundInc } from 'lib/math.mjs';

   import * as gTables from '../tables';
   import * as tables from './tables';
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
      const globalData = {
         rope: {
            pitch: ropePitch,
            size: ropeSize,
            qty: ropeQty,
            o_pitch: o_ropePitch,
         },
      };

      const moduleData = {
         location,
         model,
         sheave: {
            arcOfContact,
            groove,
            model: sheaveModel,
         },
         type,
      };

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
   // - Globals
   let carWeight = globals?.car?.weight ?? 0;
   let ropePitch = globals?.car?.pitch ?? 1;
   let ropeSize = globals?.car?.size ?? 0.375;
   let ropeQty = globals?.car?.qty ?? 3;
   let o_ropePitch = globals?.car?.o_pitch ?? false;

   // - General
   let type = module?.type ?? 'Geared';
   let location = module?.locaiton ?? 'Overhead';
   let model = module?.model ?? '';

   // - Sheave
   let arcOfContact = module?.sheave?.arcOfContact ?? 0;
   let groove = module?.sheave?.groove ?? '';
   let sheaveModel = module?.sheave?.model ?? '';

   // NOTE: For Convenience
   let travelingCables = 0;
   let o_travelingCables = false;
   let compType = 'None';

   // - Database
   let machines = [];
   let maxRimWidth = 0;

   // - Objects
   let machineObj = {};
   let sheaveObj = {};
   let ropeObj = {};

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: getEngineeringData(type, location);

   $: cwtWeight = round(carWeight + capacity * counterbalance, 2);

   $: sheaves = machineObj?.sheaves ?? [];
   $: ropeVariants = ropeObj?.variants ?? [];

   // - Rope Calcs
   $: ropeSizeOpts = clone(gTables.ropeSizes).map((rope) => {
      let diaTest = true;
      let limitTest = true;

      if (sheaveObj?.diameter) diaTest = round(rope.value * 40, 2) <= sheaveObj.diameter;

      if (sheaveObj?.ropeSizeLimit) limitTest = sheaveObj.ropeSizeLimit.includes(rope.name);

      const pitch = o_ropePitch ? ropePitch : rope.value + 0.25;

      // Figure out how many ropes can be on a sheave if past 10 then set to 10
      rope.maxQty = floor(((sheaveObj?.rimWidth ?? maxRimWidth) - (0.375 + rope.value)) / pitch);
      rope.maxQty = rope.maxQty > 10 ? 10 : rope.maxQty;

      if (diaTest && limitTest) return rope;
   });

   // - Input Calcs
   $: travelingCablesCalc = ceil((overallTravel * 0.25) / 4);
   $: ropePitchCalc = ropeSize + 0.25;

   // Events
   // Lifecycle
   onDestroy(() => {
      updateModule();
   });

   // Console
   $: console.table(ropeSizeOpts);
   $: console.log(sheaveObj);
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
      <Select bind:value={sheaveModel} bind:selected={sheaveObj} label="Traction Sheave" options={sheaves}>
         {#each sheaves as { name, diameter } (name)}
            <Option value={name}>{name} (Ø{floor(diameter)}")</Option>
         {/each}
      </Select>

      <InputNumber bind:value={arcOfContact} label="Arc Of Contact" step="0.1" type="angle" />
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

<Fieldset title="Hoist Ropes">
   <Select bind:value={ropeSize} bind:selected={ropeObj} label="Size" options={ropeSizeOpts} type="number">
      {#each ropeSizeOpts as { name, value } (value)}
         <Option {value}>{name}</Option>
      {/each}
   </Select>

   <InputNumber bind:value={ropeQty} label="Quantity" {metric}>
      <svelte:fragment slot="helperText">
         <HelperText validation>Rope size won't hold load</HelperText>
      </svelte:fragment>
   </InputNumber>

   <InputLength bind:value={ropePitch} bind:override={o_ropePitch} label="Pitch" calc={ropePitchCalc} {metric} />

   {#if model && model !== 'Other'}
      <!-- <InputTorque bind:value={ropeWeight} defaultList label="Weight" list="weight-list" {metric} />
         <datalist id="weight-list">
            {#each ropeWeightOptions as value (value)}
               <option {value} />
            {/each}
         </datalist> -->

      <!-- <InputWeight
            bind:value={ropeMaxLoad}
            defaultList
            helperText={`Rope should at least hold ${singleRopeLoad} lbs`}
            label="Max Load"
            list="max-load-list"
            min={singleRopeLoad}
            {metric}
         />
         <datalist id="max-load-list">
            {#each ropeMaxLoadOptions as value (value)}
               <option {value} />
            {/each}
         </datalist> -->
   {/if}

   <!-- {#if !ropeSizeLimit && sheave}
      <Select bind:value={groove} calc={grooveCalc} label="Groove">
         {#if hwGrooveOptions.length > 0}
            <OptGroup label="Standard Grooves">
               {#each hwGrooveOptions as { name, description } (name)}
                  <Option text={`${name} ${description}`} value={name} selected={groove === name} />
               {/each}
            </OptGroup>
         {/if}

         <OptGroup label="Customer Grooves">
            {#each customerGrooveOptions as { name, description } (name)}
               <Option text={`${name} ${description}`} value={name} selected={groove === name} />
            {/each}
         </OptGroup>
      </Select>
   {/if} -->
</Fieldset>

<style>
</style>
