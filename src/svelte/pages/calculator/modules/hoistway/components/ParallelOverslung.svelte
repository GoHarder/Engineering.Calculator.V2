<script>
   import { containerQuery } from 'components/lib.js';

   // Components
   import { Fieldset } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, InputLength } from 'components/material/input';

   // Stores
   // Properties
   export let botChanDepth = 0;
   export let bufferBlockUpDepth = 0;
   export let cabHeight = 0;
   export let carShoeError = false;
   export let cornerPost = false;
   export let cornerPostBrace = 0;
   export let floorToPlate = 0;
   export let floorToRail = 0;
   export let floorToShoe = 0;
   export let floorToTop = 0;
   export let Links = {};
   export let metric = false;
   export let platformThickness = 0;
   export let railHeight = 0;
   export let safetyHeight = 0;
   export let sheaveChanDepth = 0;
   export let sheaveDia = 30;
   export let shoeHeight = 0;
   export let shoePlateThick = 0;
   export let strikePlateThick = 0;
   export let toeGuardError = false;
   export let toeGuardLen = 0;
   export let topChanDepth = 0;
   export let underBeamHeight = 0;

   // Methods
   // Constants
   const breakpoints = {
      856: ['small'],
      1164: ['medium'],
      5000: ['large'],
   };

   // Variables
   let brace = 4;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: imgSrc = `/img/hoistway/parallel_overslung${cornerPost ? '_corner' : ''}.svg`;

   $: floorToPlate = platformThickness + botChanDepth + strikePlateThick;
   $: floorToShoe = platformThickness + botChanDepth + safetyHeight + shoePlateThick + shoeHeight;
   $: floorToRail = cabHeight + railHeight;
   $: floorToTop = underBeamHeight + topChanDepth + (cornerPost ? cornerPostBrace : 0);

   $: sheaveChanDepth;
   $: sheaveDia;
   $: bufferBlockUpDepth;

   // Events

   // Lifecycle
</script>

<div class="flex-row hoistway-sling small medium large" use:containerQuery={breakpoints}>
   <Fieldset title="Sling Dimensions">
      <div class="form">
         <hr class="hr-1" />
         <hr class="hr-2" />

         <div class="form-1">
            <Checkbox bind:checked={cornerPost} label="Cornerpost" link={Links.get('cornerPost')} />
            {#if cornerPost}
               <InputLength bind:value={brace} label="Cornerpost Brace" {metric} />
            {/if}
            <InputLength bind:value={topChanDepth} label="Top Channel" link={Links.get('slingTopChanDepth')} {metric} />
            <InputLength bind:value={underBeamHeight} label="Underbeam" link={Links.get('underBeamHeight')} {metric} />
            <InputLength bind:value={toeGuardLen} label="Toe Guard" {metric} invalid={toeGuardError}>
               <svelte:fragment slot="helperText">
                  <HelperText validation>Toe Guard Is Hitting The Floor</HelperText>
               </svelte:fragment>
            </InputLength>
         </div>

         <div class="img">
            <img src={imgSrc} alt="Sling" />
         </div>

         <div class="form-2">
            <InputLength bind:value={railHeight} label="Rail" {metric} />
            <InputLength bind:value={cabHeight} label="Cab" link={Links.get('cabHeight')} {metric} />
            <InputLength bind:value={platformThickness} label="Platform" link={Links.get('platformThickness')} {metric} />
            <InputLength bind:value={botChanDepth} label="Bottom Channel" link={Links.get('slingBotChanDepth')} {metric} invalid={carShoeError}>
               <svelte:fragment slot="helperText">
                  <HelperText validation>Car Shoe Is Hitting The Floor</HelperText>
               </svelte:fragment>
            </InputLength>
            <InputLength bind:value={strikePlateThick} label="Strike Plate" link={Links.get('slingStrikePlateThick')} {metric} />
         </div>
      </div>
   </Fieldset>
</div>

<style>
</style>
