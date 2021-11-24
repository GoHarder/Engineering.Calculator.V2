<script>
   import { onMount } from 'svelte';

   // Components
   import { Icon, Button } from 'components/material/button';
   import { Dialog } from 'components/material/dialog';
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
         admin: 'supervisor_account',
         super: 'account_box',
         user: 'person',
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
   let user;
   let users = [];

   let editEmail;
   let editFirstName;
   let editLastName;
   let editRole = 'user';

   let deleteDialog = false;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onAdd = async (event) => {
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

         snackbarMsg = 'User Updated';
         showSnackbar = true;
         getUsers();

         setTimeout(() => {
            editEmail = undefined;
            editFirstName = undefined;
            editLastName = undefined;
            editRole = 'user';
            snackbarMsg = '';
         }, 5500);
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   const onDelete1 = () => {
      deleteDialog = true;
   };

   const onDelete2 = async () => {
      const token = localStorage.getItem('token');

      let res, body;

      try {
         res = await fetch(`/api/users/${user._id}`, {
            method: 'DELETE',
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         snackbarMsg = 'User Deleted';
         showSnackbar = true;
         getUsers();

         setTimeout(() => {
            editEmail = undefined;
            editFirstName = undefined;
            editLastName = undefined;
            editRole = 'user';
            snackbarMsg = '';
         }, 5500);
      } catch (error) {
         fetchStore.setError({ res, error });
      }

      deleteDialog = false;
   };

   const onEdit = (event) => {
      user = users[event.detail.index];

      editEmail = user.email;
      editFirstName = user.firstName;
      editLastName = user.lastName;
      editRole = user.role;
   };

   const onUpdate = async (event) => {
      event.preventDefault();

      const payload = {
         _id: user._id,
         email: editEmail,
         firstName: editFirstName,
         lastName: editLastName,
         role: editRole,
      };

      const token = localStorage.getItem('token');

      let res, body;

      try {
         const reqBody = JSON.stringify(payload);

         res = await fetch('/api/users/admin', {
            method: 'PUT',
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
            body: reqBody,
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         snackbarMsg = 'User Updated';
         showSnackbar = true;
         getUsers();

         setTimeout(() => {
            editEmail = undefined;
            editFirstName = undefined;
            editLastName = undefined;
            editRole = 'user';
            snackbarMsg = '';
         }, 5500);
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Lifecycle
   onMount(() => {
      getUsers();
   });
</script>

<Dialog bind:show={deleteDialog}>
   Delete User?

   <svelte:fragment slot="actions">
      <Button on:click={() => (deleteDialog = false)} variant="outlined" color="secondary">Cancel</Button>
      <Button on:click={onDelete2} variant="outlined" color="secondary">Ok</Button>
   </svelte:fragment>
</Dialog>

<div class="grid">
   <form on:submit={onAdd} class="add">
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
               <Icon>add</Icon>
            </svelte:fragment>
         </Button>
      </div>
   </form>

   <hr />

   <div class="vr" />

   <div class="edit">
      <h4>Edit User</h4>

      <div class="flex">
         <List on:action={onEdit} dense role="listbox" style="flex-grow: 1;">
            {#await users}
               <Item>Loading...</Item>
            {:then users}
               {#if users.length !== 0}
                  {#each users as { _id, firstName, lastName, role } (_id)}
                     <Item role="option">
                        <svelte:fragment slot="leadingIcon">
                           <Icon>{getIcon(role)}</Icon>

                           <!-- <Svg fileData={getIcon(role)} /> -->
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

         <form on:submit={onUpdate}>
            <Input bind:value={editFirstName} label="First Name" required fullWidth>
               <svelte:fragment slot="helperText">
                  <HelperText validation>Invalid first name</HelperText>
               </svelte:fragment>
            </Input>

            <Input bind:value={editLastName} label="Last Name" required fullWidth>
               <svelte:fragment slot="helperText">
                  <HelperText validation>Invalid last name</HelperText>
               </svelte:fragment>
            </Input>

            <Input bind:value={editEmail} label="Email" required type="email" fullWidth>
               <svelte:fragment slot="helperText">
                  <HelperText validation>Invalid email</HelperText>
               </svelte:fragment>
            </Input>

            <Select bind:value={editRole} label="Role" fullWidth>
               <Option selected={editRole === 'user'} value="user">User</Option>
               <Option selected={editRole === 'admin'} value="admin">Admin</Option>
               <Option selected={editRole === 'super'} value="super">Super</Option>
            </Select>

            <div class="button-container">
               <Button on:click={onDelete1} variant="contained" type="button" disabled={!user}>Delete</Button>
               <Button variant="contained" type="submit" disabled={!user}>Update</Button>
            </div>
         </form>
      </div>
   </div>
</div>

<Snackbar bind:show={showSnackbar}>{snackbarMsg}</Snackbar>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .grid {
      display: grid;
      grid-template-columns: 50% 50%;
      grid-template-areas:
         'add .'
         'hr hr'
         'edit edit';

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
      display: none;
   }

   .flex {
      display: flex;
      > * {
         flex-grow: 1;
      }
   }

   @media (min-width: 1000px) {
      .grid {
         grid-template-columns: auto 1px 33% 33%;
         grid-template-areas: 'add vr edit edit';
         grid-template-rows: 100%;
      }

      hr {
         display: none;
      }

      .vr {
         display: block;
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
      gap: 0.5em;
   }
</style>
