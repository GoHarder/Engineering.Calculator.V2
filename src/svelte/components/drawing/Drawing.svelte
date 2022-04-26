<script>
   import { round } from 'lib/math.mjs';

   // Components
   // Stores
   // Properties
   export let height = undefined;
   export let width = undefined;
   export let dwgWidth = 0;
   export let dwgHeight = 0;
   export let objWidth = 0;
   export let objHeight = 0;

   // Methods
   const getPanPoint = (dwgWidth, dwgHeight, objWidth, objHeight) => {
      let output = '0 0';

      if ((objWidth !== 0, objHeight !== 0)) {
         const panX = round((dwgWidth - objWidth) / 2, 4);
         const panY = round((dwgHeight - objHeight) / 2, 4);

         output = `-${panX} -${panY}`;
      }

      return output;
   };

   // Constants
   // Variables
   // Subscriptions
   // Reactive Rules

   // - Drawing Scale
   $: scaledDwgHeight = dwgHeight * 96;
   $: scaledDwgWidth = dwgWidth * 96;
   $: scaledObjHeight = objHeight * 96;
   $: scaledObjWidth = objWidth * 96;

   // - Pan Centering
   $: panPoint = getPanPoint(scaledDwgWidth, scaledDwgHeight, scaledObjWidth, scaledObjHeight);

   // Events
   // Lifecycle
</script>

<svg {width} {height} viewbox={`${panPoint} ${scaledDwgWidth} ${scaledDwgHeight}`} data-viewbox={`0 0 ${dwgWidth} ${dwgHeight}`}>
   <defs>
      <marker id="arrowhead" markerUnits="strokeWidth" markerWidth="9.408" markerHeight="3.744" refX="5" refY="1.872" orient="auto">
         <polygon points="9.408 0, 0 1.872, 9.408 3.744" fill="black" />
      </marker>
   </defs>
   <slot name="drawing" />
   <slot name="dimensions" />
</svg>

<style>
   svg {
      border: 1px solid red;
      cursor: crosshair;
   }
</style>
