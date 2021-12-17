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
   // Variables
   let divEleLarge;
   let divEleMedium;
   let divEleSmall;
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
      const sizes = {
         small: divEleSmall,
         medium: divEleMedium,
         large: divEleLarge,
      };

      CircularProgress = new MDCCircularProgress(sizes[size]);

      for (const key in sizes) {
         if (key !== size) sizes[key].remove();
      }
   });

   onDestroy(() => {
      CircularProgress.destroy();
   });
</script>

<div
   bind:this={divEleLarge}
   class="mdc-circular-progress"
   style="width:48px;height:48px;"
   role="progressbar"
   aria-label="Example Progress Bar"
   aria-valuemin="0"
   aria-valuemax="1"
>
   <div class="mdc-circular-progress__determinate-container">
      <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
         <circle class="mdc-circular-progress__determinate-track" cx="24" cy="24" r="18" stroke-width="4" />
         <circle class="mdc-circular-progress__determinate-circle" cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="113.097" stroke-width="4" />
      </svg>
   </div>
   <div class="mdc-circular-progress__indeterminate-container">
      <div class="mdc-circular-progress__spinner-layer">
         <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
               <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4" />
            </svg>
         </div>
         <div class="mdc-circular-progress__gap-patch">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
               <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.2" />
            </svg>
         </div>
         <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
               <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4" />
            </svg>
         </div>
      </div>
   </div>
</div>

<div
   bind:this={divEleMedium}
   class="mdc-circular-progress"
   style="width:36px;height:36px;"
   role="progressbar"
   aria-label="Example Progress Bar"
   aria-valuemin="0"
   aria-valuemax="1"
>
   <div class="mdc-circular-progress__determinate-container">
      <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
         <circle class="mdc-circular-progress__determinate-track" cx="16" cy="16" r="12.5" stroke-width="3" />
         <circle class="mdc-circular-progress__determinate-circle" cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="78.54" stroke-width="3" />
      </svg>
   </div>
   <div class="mdc-circular-progress__indeterminate-container">
      <div class="mdc-circular-progress__spinner-layer">
         <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
               <circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="3" />
            </svg>
         </div>
         <div class="mdc-circular-progress__gap-patch">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
               <circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="2.4" />
            </svg>
         </div>
         <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
               <circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="3" />
            </svg>
         </div>
      </div>
   </div>
</div>

<div
   bind:this={divEleSmall}
   class="mdc-circular-progress"
   style="width:24px;height:24px;"
   role="progressbar"
   aria-label="Example Progress Bar"
   aria-valuemin="0"
   aria-valuemax="1"
>
   <div class="mdc-circular-progress__determinate-container">
      <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
         <circle class="mdc-circular-progress__determinate-track" cx="12" cy="12" r="8.75" stroke-width="2.5" />
         <circle class="mdc-circular-progress__determinate-circle" cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="54.978" stroke-width="2.5" />
      </svg>
   </div>
   <div class="mdc-circular-progress__indeterminate-container">
      <div class="mdc-circular-progress__spinner-layer">
         <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2.5" />
            </svg>
         </div>
         <div class="mdc-circular-progress__gap-patch">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2" />
            </svg>
         </div>
         <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
            <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2.5" />
            </svg>
         </div>
      </div>
   </div>
</div>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/theme' with (
      $primary: vantage.$secondary,
      $secondary: vantage.$secondary
   );

   @use '@material/circular-progress/mdc-circular-progress';
</style>
