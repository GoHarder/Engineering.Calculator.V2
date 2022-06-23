<script>
   import { dimObj } from './lib';

   // Components
   import { InputLength } from 'components/material/input';

   // Stores
   // Properties
   export let template;

   // Methods
   // Constants
   const dims = dimObj(9);

   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules

   $: carDeadEndHitch = {
      axis: 'x',
      id: 'set-1',
      label: 'Car Dead End Hitch Channels',
      shape: '',
      name: '',
      members: [
         {
            id: 'member-1',
            label: 'Channel 1',
            length: dims.a + dims.b,
            lengthRb: dims.a + dims.b,
            loads: [
               {
                  id: 'load-1',
                  type: 'hitch',
                  label: 'Car Dead End Hitch',
                  length: dims.a,
                  liveLoad: 2000,
                  location: 'car',
                  deadLoad: 25,
                  show: false,
               },
            ],
            reactions: {
               rA: 0,
               rB: 0,
            },
            o_lengthRb: false,
         },
         {
            id: 'member-2',
            label: 'Channel 2',
            length: dims.a + dims.b,
            lengthRb: dims.a + dims.b,
            loads: [
               {
                  id: 'load-1',
                  type: 'hitch',
                  label: 'Car Dead End Hitch',
                  length: dims.a,
                  liveLoad: 2000,
                  location: 'car',
                  deadLoad: 25,
                  show: false,
               },
            ],
            reactions: {
               rA: 0,
               rB: 0,
            },
            o_lengthRb: false,
         },
      ],
      reactions: {
         rA: 0,
         rB: 0,
      },
   };

   $: cwtDeadEndHitch = {
      axis: 'x',
      id: 'set-2',
      label: 'Counterweight Dead End Hitch',
      shape: '',
      name: '',
      members: [
         {
            id: 'member-1',
            label: 'Channel 1',
            length: dims.h + dims.i,
            lengthRb: dims.h + dims.i,
            loads: [
               {
                  id: 'load-1',
                  type: 'hitch',
                  label: 'Counterweight Dead End Hitch',
                  length: dims.h,
                  liveLoad: 800,
                  location: 'counterweight',
                  deadLoad: 25,
                  show: false,
               },
            ],
            reactions: {
               rA: 0,
               rB: 0,
            },
            o_lengthRb: false,
         },
         {
            id: 'member-2',
            label: 'Channel 2',
            length: dims.h + dims.i,
            lengthRb: dims.h + dims.i,
            loads: [
               {
                  id: 'load-1',
                  type: 'hitch',
                  label: 'Counterweight Dead End Hitch',
                  length: dims.h,
                  liveLoad: 800,
                  location: 'counterweight',
                  deadLoad: 25,
                  show: false,
               },
            ],
            reactions: {
               rA: 0,
               rB: 0,
            },
            o_lengthRb: false,
         },
      ],
      reactions: {
         rA: 0,
         rB: 0,
      },
   };

   $: machine = {
      axis: 'x',
      id: 'set-3',
      label: 'Unnamed Set',
      shape: '',
      name: '',
      members: [
         {
            id: 'member-1655903679537',
            label: 'Machine Beam',
            length: dims.c + dims.d + dims.e + dims.f + dims.g,
            lengthRb: dims.c + dims.d + dims.e + dims.f + dims.g,
            loads: [
               {
                  id: 'load-1655903692565',
                  type: 'load',
                  label: 'Governor',
                  length: dims.c,
                  liveLoad: 0,
                  deadLoad: 600,
                  show: false,
               },
               {
                  id: 'load-1655903710865',
                  from: 'set-1',
                  use: 'rB',
                  type: 'reaction',
                  label: 'Car Dead End Hitch Channels Rb',
                  length: dims.c + dims.d,
                  liveLoad: 0,
                  deadLoad: 0,
                  show: false,
                  deatLoad: 0,
               },
               {
                  id: 'load-1655903716051',
                  from: 'set-2',
                  use: 'rB',
                  type: 'reaction',
                  label: 'CWT Dead End Hitch Channels Rb',
                  length: dims.c + dims.d + dims.e + dims.f,
                  liveLoad: 0,
                  deadLoad: 0,
                  show: false,
                  deatLoad: 0,
               },
               {
                  id: 'load-1655903720819',
                  type: 'load',
                  label: 'Machine',
                  length: dims.c + dims.d + dims.e,
                  liveLoad: 0,
                  deadLoad: 0,
                  show: false,
               },
            ],
            reactions: {
               rA: 0,
               rB: 0,
            },
            o_lengthRb: false,
         },
      ],
      reactions: {
         rA: 0,
         rB: 0,
      },
   };

   $: template = [carDeadEndHitch, cwtDeadEndHitch, machine];

   // Events
   // Lifecycle
</script>

<div class="template-dialog-plan">
   <div>
      {#each Object.keys(dims) as key}
         <InputLength bind:value={dims[key]} label="Dimension {key.toUpperCase()}" />
      {/each}
   </div>

   <div class="image-aspect-container" style="width: calc(100% - 300px);">
      <img class="image" src="/img/overhead/plan-2.svg" alt="Plan 2" />
   </div>
</div>

<style>
</style>
