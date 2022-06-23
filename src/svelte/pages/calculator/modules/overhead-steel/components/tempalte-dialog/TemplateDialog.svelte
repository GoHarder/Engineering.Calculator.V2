<script>
   import { createEventDispatcher } from 'svelte';

   // Components
   import { Button } from 'components/material/button';
   import { Dialog, Title } from 'components/material/dialog';
   import { ImageList, Item } from 'components/material/image-list';

   import Plan221 from './components/Plan221.svelte';
   import Plan231 from './components/Plan231.svelte';

   // Stores
   // Properties
   export let show;
   export let template;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();

   const comps = {
      select: { title: 'Load Template' },
      plan221: { obj: Plan221, title: 'Plan 221' },
      plan231: { obj: Plan231, title: 'Plan 231' },
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
         <Item on:click={() => onSelect('plan221')} alt="Plan 221" label="Plan 221" select src="/img/overhead/plan-221.svg" />
         <Item on:click={() => onSelect('plan231')} alt="Plan 231" label="Plan 231" select src="/img/overhead/plan-231.svg" />
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

<style>
</style>
