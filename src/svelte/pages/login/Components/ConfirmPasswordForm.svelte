<script>
   // Components
   import { A, PasswordRequire } from 'components/common';
   import { Button } from 'components/material/button';
   import { HelperText, Input, InputPassword } from 'components/material/input';
   import { Snackbar } from 'components/material/snackbar';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let resetToken = undefined;

   // Methods
   // Constants
   // Variables
   let password1 = undefined;
   let password2 = undefined;
   let resetCode = undefined;
   let showSnackbar = false;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
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

         setTimeout(() => {
            history.pushState({ path: '/Login/LoginForm' }, '');
         }, 5500);
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Lifecycle
</script>

<p>A reset code has been sent to your email account. Please enter it below to complete verification and set your new password.</p>
<div class="auth-form">
   <div class="row">
      <form id="reset-form" on:submit={onSubmit}>
         <Input bind:value={resetCode} label="Reset Code" required fullWidth>
            <svelte:fragment slot="helperText">
               <HelperText validation>Invalid Reset Code</HelperText>
            </svelte:fragment>
         </Input>

         <InputPassword bind:value={password1} label="New Password" fullWidth>
            <svelte:fragment slot="helperText">
               <HelperText validation>Invalid Password</HelperText>
            </svelte:fragment>
         </InputPassword>

         <InputPassword bind:value={password2} label="Confirm New Password" fullWidth>
            <svelte:fragment slot="helperText">
               <HelperText validation>Invalid Password</HelperText>
            </svelte:fragment>
         </InputPassword>
      </form>

      <div>
         <PasswordRequire {password1} {password2} />
      </div>
   </div>

   <div class="row">
      <A href="/Login/ForgotPasswordForm">Resend Code</A>

      <Button variant="contained" type="submit" form="reset-form">Reset Password</Button>
   </div>
</div>

<Snackbar bind:show={showSnackbar}>Password Updated Returning To Login</Snackbar>

<style lang="scss">
   p {
      text-align: center;
      margin: 0 0 1em;
   }

   .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1em;

      * {
         min-width: 350px;
      }

      &:last-child {
         margin-top: 0.5em;
      }
   }
</style>
