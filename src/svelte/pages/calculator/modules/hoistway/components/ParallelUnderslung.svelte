<script>
   import { onMount } from 'svelte';

   // Components
   import { Fieldset } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, InputLength } from 'components/material/input';

   // Stores
   // Properties
   export let botChanDepth = 0;
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
   export let shoeHeight = 0;
   export let shoePlateThick = 0;
   export let strikePlateThick = 0;
   export let toeGuardError = false;
   export let toeGuardLen = 0;
   export let topChanDepth = 0;
   export let underBeamHeight = 0;

   export let sheaveChanDepth = 0;
   export let sheaveDia = 30;

   // Methods
   // Constants
   // Variables
   let brace = 4;

   // - UI
   let divEle;
   let Observer;
   let sizeClass = 'large';

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: imgSrc = `/public/img/hoistway/parallel_underslung${cornerPost ? '_corner' : ''}.svg`;

   $: floorToPlate = platformThickness + botChanDepth + strikePlateThick + sheaveChanDepth;
   $: floorToShoe = platformThickness + botChanDepth + safetyHeight + shoePlateThick + shoeHeight;
   $: floorToRail = cabHeight + railHeight;
   $: floorToTop = underBeamHeight + topChanDepth + (cornerPost ? cornerPostBrace : 0);

   $: sheaveDia = 30;

   // Events
   const onResize = (event) => {
      const width = event[0].contentRect.width;

      if (width < 890) {
         sizeClass = 'small';
         return;
      }

      if (width < 1165) {
         sizeClass = 'medium';
         return;
      }

      sizeClass = 'large';
   };

   // Lifecycle
   onMount(() => {
      Observer = new ResizeObserver(onResize);
      Observer.observe(divEle);
   });
</script>

<div bind:this={divEle} class="container">
   <Fieldset title="Sling Dimensions">
      <div class="observer {sizeClass}">
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

            <InputLength bind:value={strikePlateThick} label="Strike Plate" link={Links.get('slingStrikePlateThick')} {metric} />
         </div>

         <img src={imgSrc} alt="Sling" class="img" />

         <div class="form-2">
            <InputLength bind:value={railHeight} label="Rail" {metric} />

            <InputLength bind:value={cabHeight} label="Cab" link={Links.get('cabHeight')} {metric} />

            <InputLength bind:value={platformThickness} label="Platform" link={Links.get('platformThickness')} {metric} />

            <InputLength bind:value={botChanDepth} label="Bottom Channel" link={Links.get('slingBotChanDepth')} {metric} invalid={carShoeError}>
               <svelte:fragment slot="helperText">
                  <HelperText validation>Car Shoe Is Hitting The Floor</HelperText>
               </svelte:fragment>
            </InputLength>

            <InputLength bind:value={sheaveChanDepth} label="Sheave Channel" {metric} />
         </div>
      </div>
   </Fieldset>
</div>

<style lang="scss">
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      margin: 0.25em;
      gap: 0.25em;
   }

   .observer {
      .form-1 {
         grid-area: form-1;
      }

      .form-2 {
         grid-area: form-2;
      }

      .img {
         grid-area: img;
      }

      .hr-1 {
         grid-area: 'hr-1';
      }

      .hr-2 {
         grid-area: 'hr-2';
      }

      &.small {
         display: grid;
         grid-template-columns: 1fr;
         grid-template-areas: 'img' 'hr-1' 'form-1' 'hr-2' 'form-2';
      }

      &.medium {
         display: grid;
         grid-template-columns: auto auto;
         grid-template-areas: 'form-1 img' 'hr-1 img' 'form-2 img';

         .hr-2 {
            display: none;
         }
      }

      &.large {
         display: flex;
         .img {
            height: 375px;
         }
         .hr-1,
         .hr-2 {
            display: none;
         }
      }
   }
</style>
