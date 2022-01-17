<script>
   import { ceilInc, round } from 'lib/math.mjs';

   import * as tables from '../tables';

   // Components
   import { Fieldset } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, InputLength, InputNumber } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let bufferQty = 1;
   export let compression = 0;
   export let grossLoad = 0;
   export let metric = false;
   export let oilModel = '500';
   export let ratedSpeed = 0;
   export let spaceBelow = false;
   export let springModel = '400-008';
   export let springQty = 1;
   export let style = 'Oil';
   export let title = '';

   export let o_compression = false;
   export let o_springQty = false;

   // Methods
   const getOilBuffers = async (style, speed, load) => {
      if (style === 'Oil' && speed && load) {
         const query = [`speed=${speed}`, `load=${load}`].join('&');
         const token = localStorage.getItem('token');

         // Run fetch
         fetchStore.loading(true);
         let res, body;

         try {
            res = await fetch(`api/engineering/buffers/oil?${query}`, {
               method: 'GET',
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            if (res.body && res.status !== 204) body = await res.json();

            if (!res.ok) throw new Error(body.message);

            fetchStore.loading(false);

            oilBuffers = [...body];
         } catch (error) {
            fetchStore.setError({ res, error });
         }
      }
   };

   const getBufferSprings = async (style, speed, minLoad, maxLoad) => {
      if (style === 'Spring' && speed && minLoad && maxLoad) {
         const query = [`speed=${speed}`, `minLoad=${minLoad}`, `maxLoad=${maxLoad}`].join('&');
         const token = localStorage.getItem('token');

         // Run fetch
         fetchStore.loading(true);
         let res, body;

         try {
            res = await fetch(`api/engineering/buffers/spring?${query}`, {
               method: 'GET',
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            if (res.body && res.status !== 204) body = await res.json();

            if (!res.ok) throw new Error(body.message);

            fetchStore.loading(false);

            springs = [...body];
         } catch (error) {
            fetchStore.setError({ res, error });
         }
      }
   };

   // Constants
   const location = title === 'Car' ? 'car' : 'cwt';

   // Variables

   // - Database
   let oilBuffers = [];
   let springs = [];

   // - Objects
   let oilBufferObj = {};
   let springObj = {};

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: getOilBuffers(style, ratedSpeed, grossLoad);
   $: getBufferSprings(style, ratedSpeed, minSpringLoad, maxSpringLoad);

   // - Trip Speed
   $: tripSpeedRow = tables.tripSpeed.find((row) => row.carSpeed >= ratedSpeed);
   $: carTripSpeed = spaceBelow ? tripSpeedRow.carTripWithCwtSafety : tripSpeedRow.carTrip;
   $: cwtTripSpeed = spaceBelow ? tripSpeedRow.cwtTrip : tripSpeedRow.carTrip;
   $: tripSpeed = location === 'car' ? carTripSpeed : cwtTripSpeed;

   $: impact = ceilInc((2 * grossLoad * (1 + ((1.25 * ratedSpeed) / 60) ** 2 / (64.4 * (compression / 12)))) / bufferQty, 10);

   // NOTE: 8-30-2021 8:15 AM - The min and max spring loads are from 2.22.3.2.1 and 2.6.1(b)
   $: minSpringLoad = spaceBelow ? impact : round(grossLoad * 2);
   $: maxSpringLoad = grossLoad * 3;
   $: springLoad = springObj?.applications?.find((row) => row.qty === springQty && row.compression === compression)?.load ?? 0;

   $: if (springQty < bufferQty) springQty = bufferQty;

   // - UI
   $: styleOptions = [
      { name: 'Spring', maxSpeed: 200 },
      { name: 'Oil', maxSpeed: 800 },
   ].filter((row) => row.maxSpeed >= ratedSpeed);

   $: compressionOptions = tables.getSpringCompression(springObj?.compression ?? []);

   $: minBufferQty = style === 'Oil' ? oilBufferObj?.minQty ?? 1 : 1;
   $: maxBufferQty = style === 'Oil' ? oilBufferObj?.maxQty ?? 3 : 15;

   $: if (style === 'Oil' && oilBufferObj?.stroke) compression = oilBufferObj.stroke;

   $: invalidSpringLoad = (springLoad - minSpringLoad) / minSpringLoad <= 0.1 || (maxSpringLoad - springLoad) / maxSpringLoad <= 0.1;

   // - Overrides
   $: springQtyCalc = springObj?.calculated?.qty ?? 1;
   $: springCompCalc = springObj?.calculated?.compression ?? 5.5;

   // Events
   // Lifecycle
</script>

<Fieldset {title}>
   <Select bind:value={style} label="Style">
      {#each styleOptions as { name } (name)}
         <Option value={name}>{name}</Option>
      {/each}
   </Select>

   <Checkbox bind:checked={spaceBelow} label="Occupied Space Below Pit" />

   <InputNumber value={tripSpeed} label="Governor Trip Speed" {metric} readonly type="speed" />

   {#if style === 'Oil'}
      <Select bind:value={oilModel} bind:selected={oilBufferObj} label="Model" options={oilBuffers}>
         {#each oilBuffers as { name } (name)}
            <Option value={name}>{name}</Option>
         {/each}
      </Select>
   {/if}

   <InputNumber bind:value={bufferQty} label={`${style === 'Spring' ? 'Buffer ' : ''}Quantity`} min={minBufferQty} max={maxBufferQty}>
      <svelte:fragment slot="helperText">
         <HelperText validation>Limit between {minBufferQty} and {maxBufferQty} buffers</HelperText>
      </svelte:fragment>
   </InputNumber>

   {#if style === 'Oil'}
      <InputLength bind:value={compression} label="Buffer Stroke" readonly />
   {:else}
      <Select bind:value={springModel} bind:selected={springObj} label="Spring Model" options={springs}>
         {#each springs as { name }}
            <Option value={name}>{name}</Option>
         {/each}
      </Select>

      <InputNumber bind:value={springQty} bind:override={o_springQty} label="Spring Quantity" calc={springQtyCalc} min="1" max="15">
         <svelte:fragment slot="helperText">
            <HelperText validation>Limit between 1 and 15 springs</HelperText>
         </svelte:fragment>
      </InputNumber>

      <Select bind:value={compression} bind:override={o_compression} label="Compression" calc={springCompCalc} type="number">
         {#each compressionOptions as { name, value }}
            <Option {value}>{name}</Option>
         {/each}
      </Select>

      <hr />

      <p>Spring Limits</p>

      <InputNumber value={round(maxSpringLoad / springQty)} label="Code Max." readonly type="weight" />

      <InputNumber value={round(springLoad / springQty)} label="Spring Load" invalid={invalidSpringLoad} readonly type="weight">
         <svelte:fragment slot="helperText">
            <HelperText validation>
               {#if round(springLoad / springQty) === 0}
                  Compression and quantity is not allowed
               {:else}
                  Spring load is close to limit
               {/if}
            </HelperText>
         </svelte:fragment>
      </InputNumber>

      <InputNumber value={round(minSpringLoad / springQty)} label="Code Min." readonly type="weight" />

      <hr />
   {/if}

   <InputNumber value={impact} label="Impact Load" readonly type="weight" />
</Fieldset>

<style>
</style>
