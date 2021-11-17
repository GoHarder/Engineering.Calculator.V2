<script>
   import { onDestroy } from 'svelte';

   import { close_svg, save_svg } from 'img/icons';

   // Components
   import { PasswordRequire, Svg } from 'components/common';
   import { Button } from 'components/material/button';
   import { HelperText, Input, InputPassword } from 'components/material/input';
   import { Snackbar } from 'components/material/snackbar';

   // Stores
   import fetchStore from 'stores/fetch';
   import userStore from 'stores/user';

   // Properties
   // Methods
   // Constants
   // Variables
   let email;
   let firstName;
   let lastName;
   let password;
   let password1;
   let password2;
   let showSnackbar = false;

   // Subscriptions
   const clearUser = userStore.subscribe((store) => {
      email = store.email;
      firstName = store.firstName;
      lastName = store.lastName;
   });

   // Contexts
   // Reactive Rules
   // Events
   const onCancel = () => history.back();

   const onSubmit = async (event) => {
      event.preventDefault();

      fetchStore.loading(true);
      let res, body;

      try {
         if (password1 !== password2) throw new Error('Passwords do not match');

         const reqBody = JSON.stringify({
            reset: resetCode,
            password: password2,
         });

         res = await fetch(`/api/users`, {
            method: 'PUT',
            headers: {
               Authorization: `Bearer ${resetToken}`,
               'Content-Type': 'application/json',
            },
            body: reqBody,
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);
         showSnackbar = true;
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Lifecycle
   onDestroy(() => {
      clearUser();
   });
</script>

<h2>Account Settings</h2>

<form on:submit={onSubmit}>
   <h3>Personal Information</h3>

   <Input bind:value={firstName} label="Last Name" fullWidth>
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

   <p>Enter current password to confirm settings</p>

   <InputPassword bind:value={password} label="Current Password" required fullWidth>
      <svelte:fragment slot="helperText">
         <HelperText validation>Invalid password</HelperText>
      </svelte:fragment>
   </InputPassword>

   <div class="button-section">
      <Button on:click={onCancel} color="secondary" variant="outlined">
         Cancel
         <svelte:fragment slot="trailingIcon">
            <Svg fileData={close_svg} />
         </svelte:fragment>
      </Button>

      <Button variant="contained" type="submit">
         Save
         <svelte:fragment slot="trailingIcon">
            <Svg fileData={save_svg} />
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
