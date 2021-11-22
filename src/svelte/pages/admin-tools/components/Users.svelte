<script>
   import { onMount } from 'svelte';

   import { add_svg, engineering_svg, person_svg, supervisor_account_svg } from 'img/icons';

   // Components
   import { Svg } from 'components/common';
   import { Button } from 'components/material/button';
   import { HelperText, Input } from 'components/material/input';
   import { Item, List } from 'components/material/list';
   import { Option, Select } from 'components/material/select';
   import { Snackbar } from 'components/material/snackbar';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   // Methods
   const getUsers = async () => {
      const token = localStorage.getItem('token');

      let res, body;

      try {
         res = await fetch('/api/users/all?self=true', {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         users = [...body];
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   const getIcon = (role) => {
      const icons = {
         admin: supervisor_account_svg,
         super: engineering_svg,
         user: person_svg,
      };

      return icons[role];
   };

   // Constants
   // Variables
   let email;
   let firstName;
   let lastName;
   let role = 'user';
   let showSnackbar = false;
   let snackbarMsg = '';
   let users = [];

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onSubmit = async (event) => {
      event.preventDefault();

      const token = localStorage.getItem('token');

      const payload = {
         email,
         firstName,
         lastName,
         role,
      };

      fetchStore.loading(true);
      let res, body;

      try {
         const reqBody = JSON.stringify(payload);

         res = await fetch(`/api/users`, {
            method: 'POST',
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
            body: reqBody,
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);

         snackbarMsg = 'User Added';
         showSnackbar = true;
         getUsers();
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Lifecycle
   onMount(() => {
      getUsers();
   });
</script>

<div class="grid">
   <form on:submit={onSubmit} class="add">
      <h4>Add User</h4>

      <Input bind:value={firstName} label="First Name" required fullWidth>
         <svelte:fragment slot="helperText">
            <HelperText validation>Invalid first name</HelperText>
         </svelte:fragment>
      </Input>

      <Input bind:value={lastName} label="Last Name" required fullWidth>
         <svelte:fragment slot="helperText">
            <HelperText validation>Invalid last name</HelperText>
         </svelte:fragment>
      </Input>

      <Input bind:value={email} label="Email" required type="email" fullWidth>
         <svelte:fragment slot="helperText">
            <HelperText validation>Invalid email</HelperText>
         </svelte:fragment>
      </Input>

      <Select bind:value={role} label="Role" fullWidth>
         <Option selected={role === 'user'} value="user">User</Option>
         <Option selected={role === 'admin'} value="admin">Admin</Option>
         <Option selected={role === 'super'} value="super">Super</Option>
      </Select>

      <div class="button-container">
         <Button variant="contained" type="submit">
            Add
            <svelte:fragment slot="trailingIcon">
               <Svg fileData={add_svg} />
            </svelte:fragment>
         </Button>
      </div>
   </form>

   <hr />

   <div class="vr" />

   <div class="edit">
      <h4>Edit User</h4>

      <List dense>
         {#await users}
            <Item>Loading...</Item>
         {:then users}
            {#if users.length !== 0}
               {#each users as { _id, firstName, lastName, role } (_id)}
                  <Item>
                     <svelte:fragment slot="leadingIcon">
                        <Svg fileData={getIcon(role)} />
                     </svelte:fragment>

                     {firstName}
                     {lastName}
                  </Item>
               {/each}
            {:else}
               <Item>Nothing Available...</Item>
            {/if}
         {:catch error}
            <Item style="color: #b00020;">{error}</Item>
         {/await}
      </List>
   </div>
</div>

<Snackbar bind:show={showSnackbar}>{snackbarMsg}</Snackbar>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .grid {
      display: grid;
      grid-template-columns: 50%;
      grid-template-areas:
         'add'
         'hr'
         'edit';

      gap: 0.5em;
   }

   .add {
      grid-area: add;
   }

   hr {
      grid-area: hr;
      width: 100%;
   }

   .edit {
      grid-area: edit;
   }

   .vr {
      grid-area: vr;
      content: '';
      background-color: rgba(0, 0, 0, 0.12);
      width: 1px;
      height: 100%;
      margin: 0 auto;
   }

   @media (min-width: 1000px) {
      .grid {
         grid-template-columns: auto 1px auto;
         grid-template-areas: 'add vr edit';
         grid-template-rows: 100%;
      }
   }

   h4 {
      margin: 0 0 0.5em;
      border-bottom: 2px solid vantage.$primary;
   }

   .button-container {
      display: flex;
      justify-content: flex-end;
      margin: 1em 0 0;
   }
</style>
