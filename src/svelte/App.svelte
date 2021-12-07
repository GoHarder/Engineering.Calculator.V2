<script>
   import { onDestroy, onMount } from 'svelte';
   import { fade } from 'svelte/transition';

   // Components
   import { Button } from 'components/material/button';
   import { Dialog, Title } from 'components/material/dialog';
   import { LinearProgress } from 'components/material/progress';

   import AccountSettings from './pages/account-settings/AccountSettings.svelte';
   import AdminTools from './pages/admin-tools/AdminTools.svelte';
   import Calculator from './pages/calculator/Calculator.svelte';
   import Home from './pages/home/Home.svelte';
   import Login from './pages/login/Login.svelte';
   import Project from './pages/project/Project.svelte';

   // Stores
   import fetchStore from 'stores/fetch';
   import pathStore from 'stores/path';
   import userStore from 'stores/user';

   // Properties
   // Methods
   // Constants
   const comps = {
      AccountSettings,
      AdminTools,
      Calculator,
      Home,
      Login,
      Project,
   };

   // Variables
   let comp = Login;
   let errorData = undefined;
   let path = [];
   let showApp = false;
   let showError = false;
   let showLoading = false;
   let user = undefined;

   // Subscriptions
   const clearFetch = fetchStore.subscribe((store) => {
      errorData = store.errorData;
      showLoading = store.loading;
   });

   const clearUser = userStore.subscribe((store) => (user = store));

   const clearPath = pathStore.subscribe((store) => (path = store));

   // Contexts
   // Reactive Rules
   $: if (errorData) showError = true;

   $: if (user && comp === Login) history.pushState({ path: '/Home' }, '');

   $: if (!user) history.pushState({ path: '/Login' }, '');

   // Events
   const onBeforeUnload = () => {
      navigator.sendBeacon(`/api/projects/check-in/${user._id}`);
   };

   const onCloseError = () => fetchStore.clearError();

   const onLocationChange = () => {
      pathStore.set(history.state.path.split('/').slice(1));

      comp = comps[path[0]];
   };

   // Lifecycle
   onMount(() => {
      setTimeout(() => (showApp = true), 1000);
   });

   onDestroy(() => {
      clearFetch();
      clearPath();
      clearUser();
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

{#if showApp}
   <div transition:fade class="main-content">
      <svelte:component this={comp} />
   </div>
{/if}

<style>
</style>
