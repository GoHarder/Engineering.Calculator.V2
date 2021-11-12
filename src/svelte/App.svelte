<script>
   import { onDestroy } from 'svelte';

   // Components
   import { Button } from './components/material/button';
   import { Dialog, Title } from './components/material/dialog';
   import { LinearProgress } from './components/material/progress';

   // Stores
   import fetchStore from './stores/fetch';

   // Properties
   // Methods
   // Constants
   // Variables
   let errorData = undefined;
   let showError = false;
   let showLoading = false;

   // Subscriptions
   const clearFetch = fetchStore.subscribe((store) => (showLoading = store.loading));

   // Contexts
   // Reactive Rules
   // Events
   const onBeforeUnload = () => {
      console.log('before unload');
   };

   const onCloseError = () => fetchStore.clearError();

   const onLocationChange = () => {
      console.log('location change');
   };

   // Lifecycle
   onDestroy(() => {
      clearFetch();
   });
</script>

<svelte:window on:beforeunload={onBeforeUnload} on:locationchange={onLocationChange} />

<LinearProgress show={showLoading} indeterminate />

<Dialog bind:show={showError} on:closed={onCloseError}>
   <svelte:fragment slot="title">
      {#if errorData && errorData.res}
         <Title class="error">{errorData.res.status}: {errorData.res.statusText}</Title>
      {/if}
   </svelte:fragment>

   <span class:error={!(errorData && errorData.res)}>{errorData ? errorData.error.message : ''}</span>

   <svelte:fragment slot="actions">
      <Button on:click={() => (showError = false)} variant="outlined" color="secondary">Ok</Button>
   </svelte:fragment>
</Dialog>

<style>
</style>
