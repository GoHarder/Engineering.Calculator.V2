<script>
   import { dimObj } from './lib';

   // Components
   import { InputLength } from 'components/material/input';

   // Stores
   // Properties
   export let template;

   // Methods
   // Constants
   const dims = dimObj(11);

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
      label: 'CWT Dead End Hitch Channels',
      shape: '',
      name: '',
      members: [
         {
            id: 'member-1',
            label: 'Channel 1',
            length: dims.f + dims.e,
            lengthRb: dims.f + dims.e,
            loads: [
               {
                  id: 'load-1',
                  type: 'hitch',
                  label: 'Counterweight Dead End Hitch',
                  length: dims.f,
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
            id: 'member-1656355858716',
            label: 'Channel 2',
            length: dims.f + dims.e,
            lengthRb: dims.f + dims.e,
            loads: [
               {
                  id: 'load-1',
                  type: 'hitch',
                  label: 'Counterweight Dead End Hitch',
                  length: dims.f,
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

   $: governor = {
      axis: 'x',
      id: 'set-3',
      label: 'Unnamed Set',
      shape: '',
      name: '',
      members: [
         {
            id: 'member-1',
            label: 'Governor Channel',
            length: dims.c + dims.d,
            lengthRb: dims.c + dims.d,
            loads: [
               {
                  id: 'load-1',
                  type: 'load',
                  label: 'Governor',
                  length: dims.c,
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

   $: machine = {
      axis: 'x',
      id: 'set-4',
      label: 'Unnamed Set',
      shape: '',
      name: '',
      members: [
         {
            id: 'member-1656355907942',
            label: 'Machine Beam',
            length: dims.e + dims.f + dims.p + dims.o + dims.m,
            lengthRb: 0,
            loads: [
               {
                  id: 'load-1',
                  from: 'set-1',
                  use: 'rB',
                  type: 'reaction',
                  label: 'Car Dead End Hitch Channels Rb',
                  length: dims.e + dims.f,
                  liveLoad: 0,
                  deadLoad: 0,
                  show: false,
                  deatLoad: 0,
               },
               {
                  id: 'load-2',
                  from: 'set-2',
                  use: 'rA',
                  type: 'reaction',
                  label: 'CWT Dead End Hitch Channels Ra',
                  length: dims.e + dims.f + dims.p + dims.o,
                  liveLoad: 0,
                  deadLoad: 0,
                  show: false,
                  deatLoad: 0,
               },
               {
                  id: 'load-3',
                  from: 'set-3',
                  use: 'rA',
                  type: 'reaction',
                  label: 'Governor Channel Ra',
                  length: dims.e,
                  liveLoad: 0,
                  deadLoad: 0,
                  show: false,
                  deatLoad: 0,
               },
               {
                  id: 'load-4',
                  type: 'load',
                  label: 'Machine',
                  length: dims.e + dims.f + dims.p,
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

   $: template = [carDeadEndHitch, cwtDeadEndHitch, governor, machine];

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
      <img class="image" src="/img/overhead/plan-3.svg" alt="Plan 3" />
   </div>
</div>

<style>
</style>
