<script>
   import { dimObj } from './lib';

   // Components
   import { InputLength } from 'components/material/input';

   // Stores
   // Properties
   export let template;

   // Methods
   // Constants
   const dims = dimObj(12);

   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: governor = {
      axis: 'y',
      id: 'set-1',
      label: 'Unnamed Set',
      shape: '',
      name: '',
      members: [
         {
            id: 'member-1',
            label: 'Governor Channel',
            length: dims.a + dims.b,
            lengthRb: dims.a + dims.b,
            loads: [
               {
                  id: 'load-1',
                  type: 'load',
                  label: 'Governor',
                  length: dims.a,
                  liveLoad: 0,
                  deadLoad: 600,
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

   $: carDeadEndHitch = {
      axis: 'x',
      id: 'set-2',
      label: 'Car Dead End Hitch Channels',
      shape: '',
      name: '',
      members: [
         {
            id: 'member-1',
            label: 'Channel 1',
            length: dims.f + dims.g + dims.h,
            lengthRb: dims.f + dims.g + dims.h,
            loads: [
               {
                  id: 'load-1',
                  type: 'hitch',
                  label: 'Car Dead End Hitch',
                  length: dims.f + dims.g,
                  liveLoad: 2000,
                  location: 'car',
                  deadLoad: 25,
                  show: false,
               },
               {
                  id: 'load-2',
                  from: 'set-1',
                  use: 'rA',
                  type: 'reaction',
                  label: 'Governor Channel Ra',
                  length: dims.f,
                  liveLoad: 0,
                  deadLoad: 0,
                  show: false,
                  deatLoad: 0,
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
            length: dims.f + dims.g + dims.h,
            lengthRb: dims.f + dims.g + dims.h,
            loads: [
               {
                  id: 'load-1',
                  type: 'hitch',
                  label: 'Car Dead End Hitch',
                  length: dims.f + dims.g,
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
      id: 'set-3',
      label: 'CWT Dead End Hitch Channels',
      shape: '',
      name: '',
      members: [
         {
            id: 'member-1',
            label: 'Channel 1',
            length: dims.c + dims.d + dims.e,
            lengthRb: dims.c + dims.d + dims.e,
            loads: [
               {
                  id: 'load-1',
                  type: 'hitch',
                  label: 'Counterweight Dead End Hitch',
                  length: dims.c + dims.d,
                  liveLoad: 800,
                  location: 'counterweight',
                  deadLoad: 25,
                  show: false,
               },
               {
                  id: 'load-2',
                  from: 'set-1',
                  use: 'rB',
                  type: 'reaction',
                  label: 'Governor Channel Rb',
                  length: dims.c,
                  liveLoad: 0,
                  deadLoad: 0,
                  show: false,
                  deatLoad: 0,
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
            length: dims.c + dims.d + dims.e,
            lengthRb: dims.c + dims.d + dims.e,
            loads: [
               {
                  id: 'load-1',
                  type: 'hitch',
                  label: 'Counterweight Dead End Hitch',
                  length: dims.c + dims.d,
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
      id: 'set-4',
      label: 'Unnamed Set',
      shape: '',
      name: '',
      members: [
         {
            id: 'member-1',
            label: 'Machine Beam',
            length: dims.i + dims.j + dims.k + dims.l,
            lengthRb: dims.i + dims.j + dims.k + dims.l,
            loads: [
               {
                  id: 'load-1',
                  from: 'set-2',
                  use: 'rB',
                  type: 'reaction',
                  label: 'Car Dead End Hitch Channels Rb',
                  length: dims.i,
                  liveLoad: 0,
                  deadLoad: 0,
                  show: false,
                  deatLoad: 0,
               },
               {
                  id: 'load-2',
                  from: 'set-3',
                  use: 'rB',
                  type: 'reaction',
                  label: 'CWT Dead End Hitch Channels Rb',
                  length: dims.i + dims.j + dims.k,
                  liveLoad: 0,
                  deadLoad: 0,
                  show: false,
                  deatLoad: 0,
               },
               {
                  id: 'load-3',
                  type: 'load',
                  label: 'Machine',
                  length: dims.i + dims.j,
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

   $: template = [governor, carDeadEndHitch, cwtDeadEndHitch, machine];

   // Events
   // Lifecycle
</script>

<div class="root">
   <div>
      {#each Object.keys(dims) as key}
         <InputLength bind:value={dims[key]} label="Dimension {key.toUpperCase()}" />
      {/each}
   </div>

   <div class="image-aspect-container" style="width: calc(100% - 300px);">
      <img class="image" src="/img/overhead/mrl_e_1.svg" alt="Design E-1" />
   </div>
</div>

<style>
   .root {
      display: flex;
      flex-wrap: wrap;
   }

   .image-aspect-container {
      position: relative;
   }

   .image-aspect-container .image {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
   }
</style>
