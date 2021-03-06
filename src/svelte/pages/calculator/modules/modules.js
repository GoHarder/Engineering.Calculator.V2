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
import Sling from './sling/Sling.svelte';

export default {
   platform: {
      title: 'Platform',
      description: '',
      img: 'img/products/sling-platform.png',
      checked: true,
      comp: Platform,
      show: true,
   },
   sling: {
      title: 'Sling',
      description: '',
      img: 'img/products/sling-platform.png',
      checked: true,
      comp: Sling,
      show: true,
   },
   counterweight: {
      title: 'Counterweight',
      description: '',
      img: 'img/products/counterweight.png',
      checked: true,
      comp: Counterweight,
      show: true,
   },
   railBrackets: {
      title: 'Rail Brackets',
      description: 'Calculate rails and rail brackets.',
      img: 'img/products/rail.jpg',
      checked: true,
      comp: RailBrackets,
      show: true,
   },
   machine: {
      title: 'Machine',
      description: '',
      img: 'img/products/machine.png',
      checked: true,
      comp: Machine,
      show: true,
   },
   buffers: {
      title: 'Buffers',
      description: '',
      img: 'img/products/buffers.png',
      checked: true,
      comp: Buffers,
      show: true,
   },
   hoistway: {
      title: 'Hoistway',
      description: 'To calculate min and max hoistway heights.',
      img: 'img/products/hoistway.png',
      checked: true,
      comp: Hoistway,
      show: true,
   },
   overheadSteel: {
      title: 'Overhead Steel',
      description: '',
      img: 'img/products/steel.png',
      checked: true,
      comp: OverheadSteel,
      show: true,
   },
};
