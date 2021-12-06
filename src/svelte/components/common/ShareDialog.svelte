<script>
   import { onMount } from 'svelte';

   import { clone } from 'lib/main.mjs';

   // Components
   import { Button } from 'components/material/button';
   import { Dialog, Title } from 'components/material/dialog';
   import { HelperText, Input } from 'components/material/input';
   import { Snackbar } from 'components/material/snackbar';

   // Stores
   import fetchStore from 'stores/fetch';
   import projectStore from 'stores/project';

   // Properties
   export let show = false;
   export let project = {};

   // Methods
   // Constants
   // Variables
   let email;
   let showDialog = false;
   let showSnackbar = false;
   let users = [];

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onSubmit = async (event) => {
      event.preventDefault();

      const user = users.find((nth) => nth.email === email);

      // Create the payload
      const update = clone(project);

      update.opened = update.opened.filter((person) => person.userId !== user._id);

      update.opened = [...update.opened, { _id: user._id, date: Date.now() }];

      await projectStore.share(update, user.email);

      await projectStore.clear();

      showDialog = false;
      showSnackbar = true;

      setTimeout(() => {
         show = false;
      }, 5000);
   };

   // Lifecycle
   onMount(async () => {
      fetchStore.loading(true);
      let res, body;

      const token = localStorage.getItem('token');

      try {
         res = await fetch(`api/users/all`, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);
         users = [...body];
         showDialog = true;
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   });
</script>

<Dialog bind:show={showDialog}>
   <svelte:fragment slot="title">
      <Title>Share Project</Title>
   </svelte:fragment>

   <span style="display:inline-block; margin-bottom: 0.5em;"> Enter the email of the user you want to share the project with </span>

   <form id="share-form" on:submit={onSubmit}>
      <Input bind:value={email} label="Email" required type="email" list="user-list" fullWidth>
         <svelte:fragment slot="helperText">
            <HelperText validation>Invalid Email</HelperText>
         </svelte:fragment>
      </Input>

      <datalist id="user-list">
         {#each users as { _id, email, firstName, lastName } (_id)}
            <option value={email}>{firstName} {lastName}</option>
         {/each}
      </datalist>
   </form>

   <svelte:fragment slot="actions">
      <Button on:click={() => (show = false)} variant="outlined" color="secondary">Cancel</Button>
      <Button variant="outlined" color="secondary" type="submit" form="share-form">Ok</Button>
   </svelte:fragment>
</Dialog>

<Snackbar bind:show={showSnackbar}>Project Share Sent</Snackbar>

<style>
</style>
