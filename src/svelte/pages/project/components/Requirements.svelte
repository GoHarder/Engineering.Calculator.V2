<script>
   import { onDestroy } from 'svelte';
   import * as gTables from '../../calculator/modules/tables';

   // Components
   import { DataList } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, Input, InputLength, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import projectStore from 'stores/project';

   // Properties
   // Methods
   const filterIbcTable = (category, ip, sds) => {
      let result = ibcTable.filter((row) => row.name === category);

      if (result.length === 1) return result[0];

      result = result.filter((row) => row.ip === ip);

      if (result.length === 1) return result[0];

      return result.find((row) => row.minSDS <= sds && sds < row.maxSDS);
   };

   // Constants
   const codeOpts = [
      { name: 'ASME A17-1 2019', ibc: true },
      { name: 'ASME A17-1 2016', ibc: true },
      { name: 'ASME A17-1 2013', ibc: true },
      { name: 'ASME A17-1 2012', ibc: false },
      { name: 'ASME A17-1 2010', ibc: false },
      { name: 'ASME A17-1 2005S', ibc: false },
      { name: 'ASME A17-1 2000', ibc: false },
   ];

   const ibcTable = [
      { name: 'A', ip: 0, minSDS: 0, maxSDS: 0, zone: 0 },
      { name: 'B', ip: 0, minSDS: 0, maxSDS: 0, zone: 0 },
      { name: 'C', ip: 1, minSDS: 0, maxSDS: 0, zone: 0 },
      { name: 'C', ip: 1.5, minSDS: 0, maxSDS: 0.496, zone: 2 },
      { name: 'C', ip: 1.5, minSDS: 0.496, maxSDS: 0.993, zone: 3 },
      { name: 'C', ip: 1.5, minSDS: 0.993, maxSDS: 5, zone: 4 },
      { name: 'D', ip: 1, minSDS: 0, maxSDS: 0.745, zone: 2 },
      { name: 'D', ip: 1, minSDS: 0.745, maxSDS: 1.487, zone: 3 },
      { name: 'D', ip: 1, minSDS: 1.487, maxSDS: 5, zone: 4 },
      { name: 'D', ip: 1.5, minSDS: 0, maxSDS: 0.496, zone: 0 },
      { name: 'D', ip: 1.5, minSDS: 0.496, maxSDS: 0.993, zone: 0 },
      { name: 'D', ip: 1.5, minSDS: 0.993, maxSDS: 5, zone: 0 },
      { name: 'E', ip: 1, minSDS: 0, maxSDS: 0.745, zone: 2 },
      { name: 'E', ip: 1, minSDS: 0.745, maxSDS: 1.487, zone: 3 },
      { name: 'E', ip: 1, minSDS: 1.487, maxSDS: 5, zone: 4 },
      { name: 'E', ip: 1.5, minSDS: 0, maxSDS: 0.496, zone: 0 },
      { name: 'E', ip: 1.5, minSDS: 0.496, maxSDS: 0.993, zone: 0 },
      { name: 'E', ip: 1.5, minSDS: 0.993, maxSDS: 5, zone: 0 },
      { name: 'F', ip: 1, minSDS: 0, maxSDS: 0.745, zone: 2 },
      { name: 'F', ip: 1, minSDS: 0.745, maxSDS: 1.487, zone: 3 },
      { name: 'F', ip: 1, minSDS: 1.487, maxSDS: 5, zone: 4 },
      { name: 'F', ip: 1.5, minSDS: 0, maxSDS: 0.496, zone: 0 },
      { name: 'F', ip: 1.5, minSDS: 0.496, maxSDS: 0.993, zone: 0 },
      { name: 'F', ip: 1.5, minSDS: 0.993, maxSDS: 5, zone: 0 },
   ];

   // Variables

   // - Globals
   let capacity;
   let code;
   let counterbalance;
   let freightClass;
   let globals;
   let ibcCategory;
   let ip;
   let loadingType;
   let overallTravel;
   let roping;
   let sds;
   let seismicZone;
   let speed;
   let useIbc;

   // - Project
   let metric;

   // - Objects
   let codeObj;

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      globals = store.globals;

      capacity = globals?.capacity ?? 0;
      code = globals?.code ?? 'ASME A17-1 2010';
      counterbalance = globals?.counterbalance ?? 0.4;
      freightClass = globals?.loading?.freight ?? 'None';
      ibcCategory = globals?.seismic?.category ?? 'A';
      ip = globals?.seismic?.ip ?? 1;
      loadingType = globals?.loading?.type ?? 'Passenger';
      overallTravel = globals?.overallTravel ?? 0;
      roping = globals?.roping ?? 1;
      sds = globals?.seismic?.sds ?? 0;
      seismicZone = globals?.seismic?.zone ?? 0;
      speed = globals?.speed ?? 0;
      useIbc = globals?.seismic?.useIbc ?? false;

      metric = store?.metric ?? false;
   });

   // Contexts
   // Reactive Rules
   $: ibcObj = filterIbcTable(ibcCategory, ip, sds);

   $: if (useIbc && ibcObj) {
      seismicZone = ibcObj?.zone ?? 0;
   }

   $: machineSpeed = speed * roping;
   $: machineCapacity = capacity / roping;

   // Events
   // Lifecycle
   onDestroy(() => {
      const update = {
         capacity,
         code,
         counterbalance,
         loading: {
            type: loadingType,
            freight: freightClass,
         },
         machine: {
            capacity: machineCapacity,
            speed: machineSpeed,
         },
         overallTravel,
         roping,
         seismic: {
            category: ibcCategory,
            ip,
            sds,
            useIbc,
            zone: seismicZone,
         },
         speed,
      };

      if (!useIbc) {
         delete update.seismic.category;
         delete update.seismic.ip;
         delete update.seismic.sds;
      }

      globals = { ...globals, ...update };

      projectStore.update({ globals });
      clearProject();
   });
</script>

<section class="project-form">
   <p>Enter the project requirements and proceed to the next step</p>

   <div class="grid">
      <InputNumber bind:value={capacity} label="Capacity" max="30000" min="1" {metric} type="weight">
         <svelte:fragment slot="helperText">
            <HelperText validation>Invalid Capacity</HelperText>
         </svelte:fragment>
      </InputNumber>

      <InputNumber bind:value={counterbalance} label="Counterbalance" max="50" min="40" {metric} step="2.5" type="percent">
         <svelte:fragment slot="helperText">
            <HelperText validation>Invalid Counterbalance %</HelperText>
         </svelte:fragment>

         <svelte:fragment slot="datalist" let:focused let:onChange>
            <DataList {focused} {onChange} let:onClick>
               <Option on:click={onClick} value="40">40</Option>
               <Option on:click={onClick} value="45">45</Option>
               <Option on:click={onClick} value="42.5">42.5</Option>
               <Option on:click={onClick} value="50">50</Option>
            </DataList>
         </svelte:fragment>
      </InputNumber>

      <InputNumber bind:value={speed} label="Car Speed" max="1500" min="1" {metric} type="speed">
         <svelte:fragment slot="helperText">
            <HelperText validation>Invalid Car Speed</HelperText>
         </svelte:fragment>
      </InputNumber>

      <InputLength bind:value={overallTravel} label="Overall Travel" {metric}>
         <svelte:fragment slot="helperText">
            <HelperText validation>Invalid Overall Travel</HelperText>
         </svelte:fragment>
      </InputLength>

      <Select bind:value={code} bind:selected={codeObj} label="Governing Code" options={codeOpts}>
         {#each codeOpts as { name } (name)}
            <Option value={name}>{name}</Option>
         {/each}
      </Select>

      <Select bind:value={loadingType} label="Loading Type">
         <Option value="Passenger">Passenger</Option>
         <Option value="Freight">Freight</Option>
      </Select>

      <Select bind:value={freightClass} label="Freight Class">
         {#each gTables.freightClasses as { name, types } (name)}
            {#if types.includes(loadingType)}
               <Option value={name}>{name}</Option>
            {/if}
         {/each}
      </Select>

      <Select bind:value={roping} label="Roping" type="number">
         <Option value="1">1:1</Option>
         <Option value="2">2:1</Option>
      </Select>

      <Select bind:value={seismicZone} disabled={useIbc} label="Seismic Zone" type="number">
         <Option value="0">0</Option>
         <Option value="1">1</Option>
         <Option value="2">2</Option>
         <Option value="3">3</Option>
         <Option value="4">4</Option>
      </Select>

      {#if codeObj?.ibc}
         <div class="ibc checkbox">
            <Checkbox bind:checked={useIbc} label="IBC Seismic Zone" />
         </div>
      {/if}
   </div>

   {#if useIbc}
      <hr />

      <p>IBC/ASCE 7 Seismic Parameters</p>

      <div class="grid">
         <Select bind:value={ibcCategory} gridArea="category" label="Design Category">
            <Option value="A">A</Option>
            <Option value="B">B</Option>
            <Option value="C">C</Option>
            <Option value="D">D</Option>
            <Option value="E">E</Option>
            <Option value="F">F</Option>
         </Select>

         {#if ibcObj.ip}
            <Select bind:value={ip} gridArea="ip" label="IP" type="number">
               <Option value="1">1</Option>
               <Option value="1.5">1.5</Option>
            </Select>
         {/if}

         {#if ibcObj.maxSDS}
            <div class="sds">
               <Input bind:value={sds} label="SDS" min={0} max={5} step={0.001} type="number">
                  <span slot="helperText">
                     <HelperText validation>Invalid SDS</HelperText>
                  </span>
               </Input>
            </div>
         {/if}
      </div>
   {/if}
</section>

<style lang="scss">
   .grid {
      width: 412px;
      margin: 0 auto;
   }

   @media (min-width: 900px) {
      p {
         width: 832px;
         margin: 1em auto;
      }

      .grid {
         width: 832px;
         display: grid;
         grid: {
            column-gap: 0.5em;
            template-columns: repeat(2, 1fr);
         }
      }
   }

   @media (min-width: 1440px) {
      p {
         width: 1252px;
         margin: 1em auto;
      }

      .grid {
         width: 1252px;
         display: grid;
         grid: {
            template-columns: repeat(3, 1fr);
         }
      }
   }
</style>
