<script>
   import { createEventDispatcher } from 'svelte';

   // Components
   import { Button } from 'components/material/button';
   import { Dialog, Title } from 'components/material/dialog';
   import { ImageList, Item } from 'components/material/image-list';

   import Plan1 from './components/Plan1.svelte';
   import Plan2 from './components/Plan2.svelte';

   // Stores
   // Properties
   export let show;
   export let template;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();

   const comps = {
      select: { title: 'Load Template' },
      plan1: { obj: Plan1, title: 'Plan 1' },
      plan2: { obj: Plan2, title: 'Plan 2' },
   };

   const table = new Map([
      [1500, 4],
      [1200, 3],
      [970, 2],
      [0, 1],
   ]);

   // Variables
   let comp = 'select';
   let innerWidth = 0;
   let imgColumns = 4;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: for (const row of table) {
      if (innerWidth > row[0]) {
         imgColumns = row[1];
         break;
      }
   }

   // Events
   const onSelect = (selection) => (comp = selection);

   // Lifecycle
</script>

<svelte:window bind:innerWidth />

<Dialog bind:show fullScreen>
   <svelte:fragment slot="title">
      <Title>{comps[comp].title}</Title>
   </svelte:fragment>

   {#if comp === 'select'}
      <ImageList columns={imgColumns} textProtection>
         <Item on:click={() => onSelect('plan1')} alt="Plan 1" label="Plan 1" select src="/img/overhead/plan-1.svg" />
         <Item on:click={() => onSelect('plan2')} alt="Plan 2" label="Plan 2" select src="/img/overhead/plan-2.svg" />
      </ImageList>
   {:else}
      <svelte:component this={comps[comp].obj} bind:template />
   {/if}

   <svelte:fragment slot="actions">
      {#if comp === 'select'}
         <Button on:click={() => (show = false)} variant="outlined" color="secondary">Cancel</Button>
      {:else}
         <Button on:click={() => onSelect('select')} class="mdc-dialog__button" variant="outlined" color="secondary">Back</Button>

         <Button on:click={() => dispatch('load')} class="mdc-dialog__button" variant="outlined" color="secondary">Ok</Button>
      {/if}
   </svelte:fragment>
</Dialog>

<style global>
   .template-dialog-plan {
      display: flex;
      flex-wrap: wrap;
   }

   .template-dialog-plan .image-aspect-container {
      position: relative;
   }

   .template-dialog-plan .image-aspect-container .image {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
   }
</style>
