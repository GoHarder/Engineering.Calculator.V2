<script>
   import { round } from 'lib/math.mjs';

   // Components
   // Stores
   // Properties
   export let x = 0;
   export let y = 0;
   export let leaderPoints = [];
   export let scale = 1;
   export let dwgWidth = 0;
   export let dwgHeight = 0;

   // Methods
   const getAdjustedPoints = (scaledPoints, drawX, drawY) => {
      const [pt1] = scaledPoints;
      const angle = Math.atan2(pt1.y - 0, pt1.x - 0);
      const x = round(Math.cos(angle), 4) * 5;
      const y = round(Math.sin(angle), 4) * 5;

      return [{ x, y }, ...scaledPoints].map((point) => ({ x: round(drawX + point.x, 4), y: round(drawY + point.y, 4) }));
   };

   // Constants
   // Variables
   let textAnchor = 'middle';
   let dominantBaseline = 'middle';
   let textX = 0;
   let textY = 0;

   // Subscriptions
   // Reactive Rules
   $: drawX = round((dwgWidth * 96) / 2, 4);
   $: drawY = round((dwgHeight * 96) / 2, 4);

   $: translateX = round(xIn - drawX, 4);
   $: translateY = round(yIn - drawY, 4);

   $: xIn = round(x * 96, 4);
   $: yIn = round(y * 96, 4);

   // - Polyline
   $: scaledPoints = [...leaderPoints].map((point) => ({ x: round(point.x * 96, 4), y: round(point.y * 96, 4) }));

   $: adjustedPoints = getAdjustedPoints(scaledPoints, drawX, drawY);

   $: polylinePoints = adjustedPoints.reduce((str, point) => (str += `${point.x}, ${point.y} `), '').trim();

   // - Text Location
   $: endPoint1 = adjustedPoints[adjustedPoints.length - 2];

   $: endPoint2 = adjustedPoints[adjustedPoints.length - 1];

   $: if (endPoint1.x === endPoint2.x) {
      textX = endPoint2.x;
   } else if (endPoint1.x > endPoint2.x) {
      textAnchor = 'end';
      textX = round(endPoint2.x - 0.031 * 96, 4);
   } else {
      textAnchor = 'start';
      textX = round(endPoint2.x + 0.031 * 96, 4);
   }

   $: if (endPoint1.y === endPoint2.y) {
      textY = endPoint2.y;
      dominantBaseline = 'middle';
   } else if (endPoint1.y > endPoint2.y) {
      textY = round(endPoint2.y - 0.031 * 96, 4);
      dominantBaseline = 'auto';
   } else {
      textY = round(endPoint2.y + 0.031 * 96, 4);
      dominantBaseline = 'hanging';
   }

   // Events
   // Lifecycle
</script>

<!-- <symbol {id} refX="0" refY="0" viewbox="0 0 384 384"> -->
<!-- NOTE: 9-30-2021 9:34 AM - This all works but I need to set a custom origin -->
<!-- NOTE: 9-30-2021 9:44 AM - Got it to move but now I need to translate the arrow tip to the normal cordinate system -->

<g transform-origin={`${drawX} ${drawY}`} transform={`translate(${translateX} ${translateY}) scale(${scale})`}>
   <polyline points={polylinePoints} fill="none" stroke="black" marker-start="url(#arrowhead)" />
   <text x={textX} y={textY} font-size="0.12in" fill="black" text-anchor={textAnchor} dominant-baseline={dominantBaseline}>
      <slot />
   </text>
</g>

<!-- </symbol> -->

<!-- <use href={`#${id}`} x={round(x * 96, 4)} y={round(y * 96, 4)} /> -->
<style>
</style>
