/**
 * @module modules The location to register the calculation modules
 */

import Buffers from './buffers/Buffers.svelte';
import Counterweight from './counterweight/Counterweight.svelte';
import Hoistway from './hoistway/Hoistway.svelte';
import Machine from './machine/Machine.svelte';
import OverheadSteel from './overhead-steel/OverheadSteel.svelte';
import Platform from './platform/Platform.svelte';
import Sling from './sling/Sling.svelte';

export default {
   platform: {
      index: 0,
      title: 'Platform',
      description: '',
      img: 'public/img/products/sling-platform.png',
      checked: true,
      comp: Platform,
      show: true,
   },
   sling: {
      index: 1,
      title: 'Sling',
      description: '',
      img: 'public/img/products/sling-platform.png',
      checked: true,
      comp: Sling,
      show: true,
   },
   counterweight: {
      index: 2,
      title: 'Counterweight',
      description: '',
      img: 'public/img/products/counterweight.png',
      checked: true,
      comp: Counterweight,
      show: true,
   },
   machine: {
      index: 3,
      title: 'Machine',
      description: '',
      img: 'public/img/products/machine.png',
      checked: true,
      comp: Machine,
      show: true,
   },
   buffers: {
      index: 4,
      title: 'Buffers',
      description: '',
      img: 'public/img/products/buffers.png',
      checked: true,
      comp: Buffers,
      show: true,
   },
   hoistway: {
      index: 5,
      title: 'Hoistway',
      description: 'To calculate min and max hoistway heights.',
      img: 'public/img/products/hoistway.png',
      checked: true,
      comp: Hoistway,
      show: true,
   },
   overheadSteel: {
      index: 6,
      title: 'Overhead Steel',
      description: '',
      img: 'public/img/products/steel.png',
      checked: true,
      comp: OverheadSteel,
      show: true,
   },
};
