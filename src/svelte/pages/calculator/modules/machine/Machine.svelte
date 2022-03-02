<script>
   import { onDestroy } from 'svelte';

   import { clone, deepMerge } from 'lib/main.mjs';
   import { ceil, floor, round } from 'lib/math.mjs';

   import * as gTables from '../tables';
   import * as tables from './tables';
   import { MachineLinks as Links } from '../links';

   // Components
   import { CompInput, Fieldset } from 'components/common';
   import { HelperText, Input, InputNumber, InputLength } from 'components/material/input';
   import { HelperText as SelHelperText, Option, OptGroup, Select } from 'components/material/select';

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
         compensation: {
            type: compType,
            weight: compWeight,
         },
      };

      const moduleData = {
         compensation: {
            chianModel: compChainModel,
            percentage: compPercentage,
            ropeChainQty: compRopeChainQty,
            ropeSize: compRopeSize,
            sheave: {
               model: compSheaveModel,
               weight: compSheaveWeight,
            },
         },
         location,
         model,
         rope: {
            maxLoad: ropeMaxLoad,
            weight: ropeWeight,
         },
         sheave: {
            arcOfContact,
            groove,
            model: sheaveModel,
         },
         travelingCables,
         type,
         o_travelingCables,
      };

      // project.globals = { ...project.globals, ...globalData };
      project.globals = deepMerge(project.globals, globalData);
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
   const { capacity, roping, speed, counterbalance, loading, machine, overallTravel } = globals;
   const { type: loadingType, freight: freightClass } = loading;
   const { capacity: machineCapacity, speed: machineSpeed } = machine;
   const { machine: module } = modules;
   Links.setProject(modules);

   const safetyFactor = tables.safetyFactor.find((row) => machineSpeed <= row.speed)[loadingType.toLowerCase()];
   const acceleration = tables.performanceStandards.find((row) => row.speed >= machineSpeed).acceleration;
   const accelerationFactor = round((1 + acceleration / 32.2) / (1 - acceleration / 32.2), 4);

   // Variables
   // - Globals
   let carWeight = globals?.car?.weight ?? 0;

   let ropePitch = globals?.rope?.pitch ?? 1;
   let ropeSize = globals?.rope?.size ?? 0.375;
   let ropeQty = globals?.rope?.qty ?? 3;
   let o_ropePitch = globals?.rope?.o_pitch ?? false;

   let compType = globals?.compensation?.type ?? 'None';
   let compWeight = globals?.compensation?.weight ?? 0;

   // - General
   let travelingCables = module?.travelingCables ?? 0;
   let type = module?.type ?? 'Geared';
   let location = module?.locaiton ?? 'Overhead';
   let model = module?.model ?? '';

   let o_travelingCables = module?.o_travelingCables ?? false;

   // - Sheave
   let arcOfContact = module?.sheave?.arcOfContact ?? 0;
   let groove = module?.sheave?.groove ?? '';
   let sheaveModel = module?.sheave?.model ?? '';

   // - Rope
   let ropeWeight = module?.rope?.weight ?? 0;
   let ropeMaxLoad = module?.rope?.maxLoad ?? 0;

   // Compensation
   let compChainModel = module.compensation?.chianModel ?? '';
   let compPercentage = module.compensation?.percentage ?? 1;
   let compRopeChainQty = module.compensation?.ropeChainQty ?? 2;
   let compRopeSize = module.compensation?.ropeSize ?? 0.375;
   let compSheaveModel = module.compensation?.sheave?.model ?? '';
   let compSheaveWeight = module.compensation?.sheave?.weight ?? 0;

   // - Database
   let machines = [];
   let maxRimWidth = 0;

   // - Calculated

   let minRopes = 3;
   let tractionRatioCond1 = 0;
   let tractionRatioCond2 = 0;
   let tractionRatioCond3 = 0;
   let tractionRatio125 = 0;

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

   $: ropeGripLoad = carWeight + capacity + cwtWeight + totalRopeWeight + compWeight;

   // - Rope Calcs
   // NOTE: 8-17-2021 2:41 PM - Ben doesn't know why the totalRopeLoad2 formula exists I don't either. It doesn't make sense
   $: totalRopeWeight = round(ropeQty * ropeWeight * overallTravel * roping);
   $: totalRopeLoad1 = (carWeight + capacity + totalRopeWeight + compWeight + travelingCables) / roping;
   $: totalRopeLoad2 = (0.5 * roping * compSheaveWeight + roping * travelingCables + carWeight + capacity + totalRopeWeight) / roping;
   $: totalRopeLoad = round(Math.max(totalRopeLoad1, totalRopeLoad2) * safetyFactor, 1);
   $: singleRopeLoad = ceil(totalRopeLoad / ropeQty); // Is min breaking Strength

   // - Rope Options
   $: ropeSizeOpts = clone(gTables.ropeSizes)
      .map((rope) => {
         let diaTest = true;
         let limitTest = true;

         if (sheaveObj?.diameter) diaTest = round(rope.value * 40, 2) <= sheaveObj.diameter;

         if (sheaveObj?.ropeSizeLimit) limitTest = sheaveObj.ropeSizeLimit.includes(rope.name);

         const pitch = o_ropePitch ? ropePitch : rope.value + 0.25;

         // Figure out how many ropes can be on a sheave if past 10 then set to 10
         rope.maxQty = floor(((sheaveObj?.rimWidth ?? maxRimWidth) - (0.375 + rope.value)) / pitch);
         rope.maxQty = rope.maxQty > 10 ? 10 : rope.maxQty;

         if (diaTest && limitTest) return rope;
      })
      .filter((rope) => rope !== undefined);

   $: ropeVariantOpts = clone(ropeVariants)
      .map((rope) => {
         let weightTest = true;
         let maxLoadTest = true;

         if (ropeWeight) weightTest = rope.weight === round(ropeWeight * 12, 2);
         if (ropeMaxLoad) maxLoadTest = rope.maxLoad === ropeMaxLoad;

         if (weightTest && maxLoadTest) return rope;
      })
      .filter((rope) => rope !== undefined);

   $: ropeWeightOpts = [...new Set(clone(ropeVariantOpts).map((rope) => rope?.weight))].sort((a, b) => a - b);
   $: ropeMaxLoadOpts = [...new Set(clone(ropeVariantOpts).map((rope) => rope?.maxLoad))].sort((a, b) => a - b);

   $: maxRopes = ropeObj?.maxQty ?? 100;
   $: ropeLoadError = minRopes >= maxRopes;

   // - Groove Calcs
   $: ropeTension = round(
      (2 *
         (carWeight + capacity + 0.5 * ropeWeight + 0.5 * compWeight + 0.5 * compSheaveWeight + 0.5 * travelingCables) *
         (cwtWeight + 0.5 * ropeWeight + 0.5 * compWeight + 0.5 * compSheaveWeight)) /
         (carWeight + capacity + cwtWeight + ropeWeight + compWeight + compSheaveWeight + 0.5 * travelingCables)
   );

   $: if (carWeight + compWeight + 0.5 * travelingCables <= cwtWeight + totalRopeWeight) {
      tractionRatioCond1 = round(((cwtWeight + totalRopeWeight) / (carWeight + compWeight + 0.5 * travelingCables)) * accelerationFactor, 4);
   } else {
      tractionRatioCond1 = round(((carWeight + compWeight + 0.5 * travelingCables) / (cwtWeight + totalRopeWeight)) * accelerationFactor, 4);
   }

   $: if (cwtWeight + compWeight <= carWeight + capacity + totalRopeWeight) {
      tractionRatioCond2 = round(((carWeight + capacity + totalRopeWeight) / (cwtWeight + compWeight)) * accelerationFactor, 4);
   } else {
      tractionRatioCond2 = round(((cwtWeight + compWeight) / (carWeight + capacity + totalRopeWeight)) * accelerationFactor, 4);
   }

   $: tractionRatioCond3 = freightClass === 'C2' ? round((carWeight + 1.5 * capacity + totalRopeWeight) / (cwtWeight + compWeight), 4) : 0;

   $: if (cwtWeight + compWeight <= carWeight + capacity + totalRopeWeight) {
      tractionRatio125 = round((carWeight + capacity * 1.25 + totalRopeWeight) / (cwtWeight + compWeight), 4);
   } else {
      tractionRatio125 = round((cwtWeight + compWeight) / (carWeight + capacity * 1.25 + totalRopeWeight), 4);
   }

   $: tractionRatio = Math.max(tractionRatioCond1, tractionRatioCond2, tractionRatioCond3, tractionRatio125);

   // -- Groove Options

   $: grooveOpts = clone(tables.sheaveGrooves).map((groove) => {
      const sheaveDia = sheaveObj?.diameter ?? 1;
      const optimalTraction = round(tractionRatio + 0.1, 4);
      const { frictionCoefficient, grooveAngle, undercutAngle, shape } = groove;

      if (!groove.customer) {
         groove.availableTraction = tables.availableTraction[shape](frictionCoefficient, arcOfContact, grooveAngle, undercutAngle);
         groove.specificPressure = tables.specificPressure[shape](ropeTension, grooveAngle, accelerationFactor, ropeQty, ropeSize, sheaveDia, undercutAngle);
         groove._optimal = round(Math.abs(optimalTraction - groove.availableTraction), 4);
      }

      return groove;
   });

   $: filteredGrooveOpts = clone(grooveOpts).filter((groove) => {
      if (groove.customer) return true;
      if (!sheaveObj?.maxGroovePressure) return true;

      return groove.availableTraction > tractionRatio && groove.specificPressure < sheaveObj.maxGroovePressure;
   });

   $: hwGrooveOpts = filteredGrooveOpts.filter((groove) => !groove.customer);
   $: customerGrooveOpts = filteredGrooveOpts.filter((groove) => groove.customer);

   // - Input Calcs
   $: travelingCablesCalc = ceil((overallTravel * 0.25) / 4);
   $: ropePitchCalc = ropeSize + 0.25;
   $: grooveCalc = (hwGrooveOpts.sort((grooveA, grooveB) => grooveA._optimal - grooveB._optimal)[0] ?? customerGrooveOpts[0]).name;

   // Events
   // Lifecycle
   onDestroy(() => {
      updateModule();
   });
</script>

<div class="container">
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
</div>

<div class="container">
   <Fieldset title="Hoist Ropes">
      <Select bind:value={ropeSize} bind:selected={ropeObj} label="Size" invalid={ropeLoadError} options={ropeSizeOpts} type="number">
         {#each ropeSizeOpts as { name, value } (value)}
            <Option {value}>{name}</Option>
         {/each}

         <svelte:fragment slot="helperText">
            <SelHelperText validation>Rope size won't hold load</SelHelperText>
         </svelte:fragment>
      </Select>

      <InputNumber bind:value={ropeQty} label="Quantity" {metric} min={minRopes} max={maxRopes}>
         <svelte:fragment slot="helperText">
            <HelperText validation>
               {#if ropeLoadError}
                  Rope size won't hold load
               {:else}
                  Sheave can handle {minRopes} to {maxRopes} ropes
               {/if}
            </HelperText>
         </svelte:fragment>
      </InputNumber>

      <InputLength bind:value={ropePitch} bind:override={o_ropePitch} label="Pitch" calc={ropePitchCalc} {metric} />

      {#if model && model !== 'Other'}
         <InputNumber bind:value={ropeWeight} label="Weight" list="weight-list" {metric} step="0.01" type="torque" />
         <datalist id="weight-list">
            {#each ropeWeightOpts as value (value)}
               <option {value} />
            {/each}
         </datalist>

         <InputNumber bind:value={ropeMaxLoad} label="Max Load" list="max-load-list" {metric} min={singleRopeLoad} type="weight">
            <svelte:fragment slot="helperText">
               <SelHelperText validation>Rope should at least hold {singleRopeLoad} lbs</SelHelperText>
            </svelte:fragment>
         </InputNumber>
         <datalist id="max-load-list">
            {#each ropeMaxLoadOpts as value (value)}
               <option {value} />
            {/each}
         </datalist>
      {/if}

      {#if !(sheaveObj?.ropeSizeLimit ?? false) && sheaveObj?.name}
         <Select bind:value={groove} label="Groove" calc={grooveCalc}>
            {#if hwGrooveOpts.length > 0}
               <OptGroup label="Standard Grooves">
                  {#each hwGrooveOpts as { name, description } (name)}
                     <Option value={name}>{name} {description}</Option>
                  {/each}
               </OptGroup>
            {/if}

            <OptGroup label="Customer Grooves">
               {#each customerGrooveOpts as { name, description } (name)}
                  <Option value={name}>{name} {description}</Option>
               {/each}
            </OptGroup>
         </Select>
      {/if}
   </Fieldset>

   {#if compType !== 'None'}
      <CompInput
         travel={overallTravel}
         {roping}
         {ropeSize}
         {ropeQty}
         bind:type={compType}
         bind:ropeChainQty={compRopeChainQty}
         bind:percentage={compPercentage}
         bind:compWeight
         bind:compSheaveModel
         bind:compSheaveWeight
         bind:compRopeSize
         bind:compChainModel
      />
   {/if}
</div>

<style>
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      margin: 0.25em;
      gap: 0.25em;
   }
</style>
