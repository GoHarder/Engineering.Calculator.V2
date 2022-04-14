/**
 * @module modules The location to register the calculation modules
 */

import Buffers from './buffers/Buffers.svelte';
import Counterweight from './counterweight/Counterweight.svelte';
import Hoistway from './hoistway/Hoistway.svelte';
import Machine from './machine/Machine.svelte';
import OverheadSteel from './overhead-steel/OverheadSteel.svelte';
import Platform from './platform/Platform.svelte';
import RailBrackets from './rail-brackets/railBrackets.svelte';
import Sheaves from './sheaves/Sheaves.svelte';
import Sling from './sling/Sling.svelte';

export default {
   platform: {
      title: 'Platform',
      description: '',
      img: 'public/img/products/sling-platform.png',
      checked: true,
      comp: Platform,
      show: true,
   },
   sling: {
      title: 'Sling',
      description: '',
      img: 'public/img/products/sling-platform.png',
      checked: true,
      comp: Sling,
      show: true,
   },
   counterweight: {
      title: 'Counterweight',
      description: '',
      img: 'public/img/products/counterweight.png',
      checked: true,
      comp: Counterweight,
      show: true,
   },
   railBrackets: {
      title: 'Rail Brackets',
      description: 'Calculate rails and rail brackets.',
      img: 'public/img/products/rail.jpg',
      checked: true,
      comp: RailBrackets,
      show: true,
   },
   machine: {
      title: 'Machine',
      description: '',
      img: 'public/img/products/machine.png',
      checked: true,
      comp: Machine,
      show: true,
   },
   buffers: {
      title: 'Buffers',
      description: '',
      img: 'public/img/products/buffers.png',
      checked: true,
      comp: Buffers,
      show: true,
   },
   hoistway: {
      title: 'Hoistway',
      description: 'To calculate min and max hoistway heights.',
      img: 'public/img/products/hoistway.png',
      checked: true,
      comp: Hoistway,
      show: true,
   },
   // sheaves: {
   //    title: 'Sheaves',
   //    description: 'To calculate sheave loads.',
   //    img: 'public/img/products/sheave.png',
   //    checked: true,
   //    comp: Sheaves,
   //    show: true,
   // },
   overheadSteel: {
      title: 'Overhead Steel',
      description: '',
      img: 'public/img/products/steel.png',
      checked: true,
      comp: OverheadSteel,
      show: true,
   },
};
