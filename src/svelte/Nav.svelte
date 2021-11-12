<script>
   import { onDestroy } from 'svelte';

   import { account_circle_svg, logout_svg, person_svg, supervisor_account_svg } from 'img/icons';

   // Components
   import { Svg } from './components/common';
   import { Button } from './components/material/button';
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
         <Svg fileData={person_svg} />
      </svelte:fragment>

      {user.firstName}
      {user.lastName}
   </Button>

   <Menu bind:show={showMenu}>
      <Item>
         <svelte:fragment slot="leadingIcon"><Svg fileData={account_circle_svg} /></svelte:fragment>
         Account Settings
      </Item>

      {#if user.admin}
         <Item>
            <svelte:fragment slot="leadingIcon"><Svg fileData={supervisor_account_svg} /></svelte:fragment>
            Admin Tools
         </Item>
      {/if}

      <Divider />

      <Item on:click={onLogout}>
         <svelte:fragment slot="leadingIcon"><Svg fileData={logout_svg} /></svelte:fragment>
         Logout
      </Item>
   </Menu>
{/if}

<style>
</style>
