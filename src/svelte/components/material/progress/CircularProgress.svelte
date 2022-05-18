<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCCircularProgress } from '@material/circular-progress';

   // Components
   // Stores
   // Properties
   export let indeterminate = undefined;
   export let progress = undefined;
   export let size = 'large';
   export let show = false;

   // Methods
   // Constants
   const sizes = {
      small: {
         style: 'width:24px;height:24px;',
         viewBox: '0 0 24 24',
         cx: '12',
         cy: '12',
         r: '8.75',
         width1: '2.5',
         width2: '2',
         dash1: '54.978',
         dash2: '27.489',
      },
      medium: {
         style: 'width:36px;height:36px;',
         viewBox: '0 0 32 32',
         cx: '16',
         cy: '16',
         r: '12.5',
         width1: '3',
         width2: '2.4',
         dash1: '78.54',
         dash2: '39.27',
      },
      large: {
         style: 'width:48px;height:48px;',
         viewBox: '0 0 48 48',
         cx: '24',
         cy: '24',
         r: '18',
         width1: '4',
         width2: '3.2',
         dash1: '113.097',
         dash2: '56.549',
      },
   };

   // Variables
   let divEle;
   let CircularProgress;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (CircularProgress && show === true) CircularProgress.open();
   $: if (CircularProgress && show === false) CircularProgress.close();
   $: if (CircularProgress && indeterminate !== undefined) CircularProgress.determinate = !indeterminate;
   $: if (CircularProgress && progress !== undefined) CircularProgress.progress = progress;

   // Events
   // Lifecycle
   onMount(() => {
      CircularProgress = new MDCCircularProgress(divEle);
   });

   onDestroy(() => {
      CircularProgress.destroy();
   });
</script>

<div bind:this={divEle} class="mdc-circular-progress" style={sizes[size].style} role="progressbar" aria-label="Progress Bar" aria-valuemin="0" aria-valuemax="1">
   <div class="mdc-circular-progress__determinate-container">
      <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox={sizes[size].viewBox} xmlns="http://www.w3.org/2000/svg">
         <circle class="mdc-circular-progress__determinate-track" cx={sizes[size].cx} cy={sizes[size].cy} r={sizes[size].r} stroke-width={sizes[size].width1} />
         <circle
            class="mdc-circular-progress__determinate-circle"
            cx={sizes[size].cx}
            cy={sizes[size].cy}
            r={sizes[size].r}
            stroke-dasharray={sizes[size].dash1}
            stroke-dashoffset={sizes[size].dash1}
            stroke-width={sizes[size].width1}
         />
      </svg>
   </div>
   <div class="mdc-circular-progress__indeterminate-container">
      <div class="mdc-circular-progress__spinner-layer">
         <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox={sizes[size].viewBox} xmlns="http://www.w3.org/2000/svg">
               <circle
                  cx={sizes[size].cx}
                  cy={sizes[size].cy}
                  r={sizes[size].r}
                  stroke-dasharray={sizes[size].dash1}
                  stroke-dashoffset={sizes[size].dash2}
                  stroke-width={sizes[size].width1}
               />
            </svg>
         </div>
         <div class="mdc-circular-progress__gap-patch">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox={sizes[size].viewBox} xmlns="http://www.w3.org/2000/svg">
               <circle
                  cx={sizes[size].cx}
                  cy={sizes[size].cy}
                  r={sizes[size].r}
                  stroke-dasharray={sizes[size].dash1}
                  stroke-dashoffset={sizes[size].dash2}
                  stroke-width={sizes[size].width2}
               />
            </svg>
         </div>
         <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox={sizes[size].viewBox} xmlns="http://www.w3.org/2000/svg">
               <circle
                  cx={sizes[size].cx}
                  cy={sizes[size].cy}
                  r={sizes[size].r}
                  stroke-dasharray={sizes[size].dash1}
                  stroke-dashoffset={sizes[size].dash2}
                  stroke-width={sizes[size].width1}
               />
            </svg>
         </div>
      </div>
   </div>
</div>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/theme' with (
      $primary: vantage.$primary,
      $secondary: vantage.$secondary
   );

   @use '@material/circular-progress/mdc-circular-progress';
</style>
