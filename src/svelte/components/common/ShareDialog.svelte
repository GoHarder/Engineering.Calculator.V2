<script>
   // Components
   import { Button } from 'components/material/button';
   import { Dialog, Title } from 'components/material/dialog';
   import { HelperText, Input } from 'components/material/input';

   // Stores
   // Properties
   // Methods
   // Constants
   // Variables
   let shareDialog;
   let email;
   let users;
   let onShare2;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
</script>

<Dialog bind:show={shareDialog}>
   <svelte:fragment slot="title">
      <Title>Share Workbook</Title>
   </svelte:fragment>

   <span style="display:inline-block; margin-bottom: 0.5em;"> Enter the email of the user you want to share the workbook with </span>

   <form id="share-form" on:submit={(event) => event.preventDefault()}>
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
      <Button on:click={() => (shareDialog = false)} variant="outlined" color="secondary">Cancel</Button>
      <Button on:click={onShare2} variant="outlined" color="secondary" type="submit" form="share-form">Ok</Button>
   </svelte:fragment>
</Dialog>

<style>
</style>
