<script>
   import { onDestroy } from 'svelte';

   import { account_circle_svg, logout_svg, person_svg, supervisor_account_svg } from 'img/icons';

   // Components
   import { Svg } from './components/common';
   import { Button, Icon } from './components/material/button';
   import { Divider, Item, Menu } from './components/material/menu';

   // Stores
   import userStore from './stores/user';

   // Properties
   // Methods
   // Constants
   // Variables
   let user = undefined;
   let showMenu = false;

   // Subscriptions
   const clearUser = userStore.subscribe((store) => (user = store));

   // Contexts
   // Reactive Rules
   // Events
   const onAccountSettings = () => history.pushState({ path: '/AccountSettings' }, '');

   const onAdminTools = () => history.pushState({ path: '/AdminTools' }, '');

   const onLogout = () => {
      userStore.destroy();
   };

   // Lifecycle
   onDestroy(() => {
      clearUser();
   });
</script>

{#if user}
   <Button on:click={() => (showMenu = !showMenu)}>
      <svelte:fragment slot="leadingIcon">
         <Icon>person</Icon>
      </svelte:fragment>

      {user.firstName}
      {user.lastName}
   </Button>

   <Menu bind:show={showMenu}>
      <Item on:click={onAccountSettings}>
         <svelte:fragment slot="leadingIcon">
            <Icon>account_circle</Icon>
         </svelte:fragment>
         Account Settings
      </Item>

      {#if user.role !== 'user'}
         <Item on:click={onAdminTools}>
            <svelte:fragment slot="leadingIcon">
               <Icon>supervisor_account</Icon>
            </svelte:fragment>
            Admin Tools
         </Item>
      {/if}

      <Divider />

      <Item on:click={onLogout}>
         <svelte:fragment slot="leadingIcon">
            <Icon>logout</Icon>
         </svelte:fragment>
         Logout
      </Item>
   </Menu>
{/if}

<style>
</style>
