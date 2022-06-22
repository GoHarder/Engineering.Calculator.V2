<script>
   import { createEventDispatcher } from 'svelte';

   // Components
   import { Button } from 'components/material/button';
   import { Dialog, Title } from 'components/material/dialog';
   import { ImageList, Item } from 'components/material/image-list';

   import DeisgnE1 from './components/DesignE1.svelte';
   import DeisgnE5 from './components/DesignE5.svelte';

   // Stores
   // Properties
   export let show;
   export let template;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();

   const comps = {
      select: { title: 'Load Template' },
      e1: { obj: DeisgnE1, title: 'Design E-1' },
      e5: { obj: DeisgnE5, title: 'Design E-5' },
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
         <Item on:click={() => onSelect('e1')} alt="Design E-1" label="Deisgn E-1" select src="/img/overhead/mrl_e_1.svg" />
         <Item on:click={() => onSelect('e5')} alt="Design E-5" label="Deisgn E-5" select src="/img/overhead/mrl_e_5.svg" />
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
