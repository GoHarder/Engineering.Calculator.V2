/**
 * @module modules The location to register the calculation modules
 */

import Buffers from './buffers/Buffers.svelte';
import Counterweight from './counterweight/Counterweight.svelte';
import Machine from './machine/Machine.svelte';
import OverheadSteel from './overhead-steel/OverheadSteel.svelte';
import Platform from './platform/Platform.svelte';
import Sling from './sling/Sling.svelte';

export default [
   {
      i: 0,
      title: 'Platform',
      description: '',
      img: 'public/img/products/sling-platform.png',
      checked: true,
      module: 'platform',
      comp: Platform,
      show: true,
   },
   {
      i: 1,
      title: 'Sling',
      description: '',
      img: 'public/img/products/sling-platform.png',
      checked: true,
      module: 'sling',
      comp: Sling,
      show: true,
   },
   {
      i: 2,
      title: 'Counterweight',
      description: '',
      img: 'public/img/products/counterweight.png',
      checked: true,
      module: 'counterweight',
      comp: Counterweight,
      show: true,
   },
   {
      i: 3,
      title: 'Machine',
      description: '',
      img: 'public/img/products/machine.png',
      checked: true,
      module: 'machine',
      comp: Machine,
      show: true,
   },
   {
      i: 4,
      title: 'Buffers',
      description: '',
      img: 'public/img/products/buffers.png',
      checked: true,
      module: 'buffers',
      comp: Buffers,
      show: true,
   },
   {
      i: 5,
      title: 'Overhead Steel',
      description: '',
      img: 'public/img/products/steel.png',
      checked: true,
      module: 'overheadSteel',
      comp: OverheadSteel,
      show: true,
   },
];
