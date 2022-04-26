<script>
   // Components
   import { Drawing, Leader } from 'components/drawing';

   // Stores
   // Properties
   // export let member;
   // export let memberLength = 100;
   // export let label = 'Tacos!';
   // export let reactions;
   // export let pointLoads = [];
   // export let reactLoads = [];

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: drawingParams = {
      width: '800',
      // dwgHeight,
      // dwgWidth,
      objWidth: 100,
      // objHeight: member.depth,
   };

   // Events
   // Lifecycle
</script>

<Drawing {...drawingParams}>
   <svelte:fragment slot="drawing">
      <!-- <text x="-20" y="-35" font-size="0.12in" fill="black" transform={`scale(${dimScale * 1.25})`}>{label}</text> -->

      <g stroke-width="0.125in" stroke="black" fill="transparent">
         <!-- <rect x="0" y="0" width="100in" height={`${member.depth}in`} /> -->
         <!-- <line x1="0" y1={`${member.flangeThickness}in`} x2="100in" y2={`${member.flangeThickness}in`} /> -->
         <!-- <line x1="0" y1={`${member.depth - member.flangeThickness}in`} x2="100in" y2={`${member.depth - member.flangeThickness}in`} /> -->
      </g>
   </svelte:fragment>

   <svelte:fragment slot="dimensions">
      <!-- <Leader {...leader1Props}>{`Ra ${reactions.rA}#`}</Leader>
      <Leader {...leader2Props}>{`Rb ${reactions.rB}#`}</Leader>
      {#each loadLeaders as leader}
         <Leader {...leader}>{leader.text}</Leader>
      {/each} -->
   </svelte:fragment>
</Drawing>

<style>
</style>
