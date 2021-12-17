<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCRipple } from '@material/ripple';

   // Components
   import { Icon, IconButton } from 'components/material/button';
   import { Card } from 'components/material/card';

   // Stores
   // Properties
   export let checked = false;
   export let description = '';
   export let img = '';
   export let title = '';

   // Methods
   // Constants
   // Variables
   let divEle;
   let Ripple;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onSelected = () => {
      checked = !checked;
   };

   // Lifecycle
   onMount(() => {
      Ripple = new MDCRipple(divEle);
   });

   onDestroy(() => {
      Ripple.destroy();
   });
</script>

<Card class="calc-module-card">
   <div bind:this={divEle} on:click={onSelected} class="mdc-card__primary-action demo-card__primary-action" tabindex="0">
      <div class="mdc-card__media mdc-card__media--square demo-card__media" style="background-image: url(&quot;{img}&quot;);" />
      <div class="demo-card__primary">
         <h2 class="demo-card__title mdc-typography mdc-typography--headline6">{title}</h2>
         {#if description}
            <h3 class="demo-card__subtitle mdc-typography mdc-typography--subtitle2">{description}</h3>
         {/if}
      </div>
      <div class="mdc-card__ripple" />
   </div>
   <div class="mdc-card__actions" style="cursor: pointer;" on:click={onSelected}>
      <div class="mdc-card__action-icons">
         <span class:checked>
            {checked ? 'Added to workbook' : 'Add to workbook'}
         </span>

         <IconButton bind:on={checked} toggle type="button">
            <Icon class="material-icons mdc-icon-button__icon">check_box_outline_blank</Icon>
            <Icon class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">check_box</Icon>
         </IconButton>
      </div>
   </div>
</Card>

<style lang="scss" global>
   @use 'src/scss/theme' as vantage;

   .calc-module-card {
      width: 300px;

      .mdc-card__primary-action {
         display: flex;
         flex-direction: row;
         height: 120px;
      }

      .mdc-card__media--square {
         width: 110px;
      }

      .demo-card__primary {
         margin: 0.5em;
      }
      .checked {
         color: black;
         border-bottom: 1px solid vantage.$primary;
      }
   }
</style>
