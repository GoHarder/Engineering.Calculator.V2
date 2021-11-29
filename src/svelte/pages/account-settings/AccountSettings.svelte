<script>
   import { onDestroy } from 'svelte';

   // Components
   import { PasswordRequire } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { HelperText, Input, InputPassword } from 'components/material/input';
   import { Snackbar } from 'components/material/snackbar';

   // Stores
   import userStore from 'stores/user';

   // Properties
   // Methods
   // Constants
   // Variables
   let _id;
   let email;
   let firstName;
   let lastName;
   let password;
   let password1;
   let password2;
   let showSnackbar = false;

   // Subscriptions
   const clearUser = userStore.subscribe((store) => (_id = store._id));

   // Contexts
   // Reactive Rules
   // Events
   const onBack = () => history.back();

   const onSubmit = (event) => {
      event.preventDefault();

      // Create the request
      const update = { _id };
      if (email) update.firstName = email;
      if (firstName) update.firstName = firstName;
      if (lastName) update.lastName = lastName;
      if (password1) update.password1 = password1;
      if (password2) update.password2 = password2;

      const isSet = userStore.setUser(update);

      if (isSet) showSnackbar = true;
   };

   // Lifecycle
   onDestroy(() => {
      clearUser();
   });
</script>

<h2>Account Settings</h2>

<form on:submit={onSubmit}>
   <h3>Personal Information</h3>

   <Input bind:value={firstName} label="First Name" fullWidth>
      <svelte:fragment slot="helperText">
         <HelperText validation>Invalid first name</HelperText>
      </svelte:fragment>
   </Input>

   <Input bind:value={lastName} label="Last Name" fullWidth>
      <svelte:fragment slot="helperText">
         <HelperText validation>Invalid last name</HelperText>
      </svelte:fragment>
   </Input>

   <Input bind:value={email} label="Email" type="email" fullWidth>
      <svelte:fragment slot="helperText">
         <HelperText validation>Invalid email</HelperText>
      </svelte:fragment>
   </Input>

   <h3>Password</h3>

   <InputPassword bind:value={password1} label="New Password" fullWidth>
      <svelte:fragment slot="helperText">
         <HelperText validation>Invalid password</HelperText>
      </svelte:fragment>
   </InputPassword>

   <InputPassword bind:value={password2} label="Confirm New Password" fullWidth>
      <svelte:fragment slot="helperText">
         <HelperText validation>Invalid password</HelperText>
      </svelte:fragment>
   </InputPassword>

   <div class="requirement-list">
      <PasswordRequire {password1} {password2} />
   </div>

   <hr />

   <p>Enter current password to confirm new settings</p>

   <InputPassword bind:value={password} label="Current Password" required fullWidth>
      <svelte:fragment slot="helperText">
         <HelperText validation>Invalid password</HelperText>
      </svelte:fragment>
   </InputPassword>

   <div class="button-section">
      <Button on:click={onBack} color="secondary" variant="outlined" type="button">Back</Button>

      <Button variant="contained" type="submit">
         Save
         <svelte:fragment slot="trailingIcon">
            <Icon>save</Icon>
         </svelte:fragment>
      </Button>
   </div>
</form>

<Snackbar bind:show={showSnackbar}>Settings Saved</Snackbar>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   h2 {
      text-align: center;
      font-size: 30px;
      font-weight: 400;
      margin: 20px 0 6px;
      color: vantage.$gray-40;
   }

   h3 {
      border-bottom: 2px solid vantage.$primary;
      padding: 0 0 2px;
      font-size: larger;
      font-weight: 600;
      margin: 0 0 0.75em;
   }

   form {
      @include vantage.border-top;
      @include vantage.paper;
      padding: 1em;
      width: 500px;
      margin: 0 auto;
   }

   .button-section {
      display: flex;
      justify-content: space-between;
      margin: 3px 0 0;
   }
</style>
