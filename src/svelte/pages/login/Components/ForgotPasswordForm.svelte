<script>
   import { email_svg } from 'img/icons';

   // Components
   import { A, Svg } from 'components/common';
   import { Button } from 'components/material/button';
   import { HelperText, Input } from 'components/material/input';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let resetToken = undefined;
   export let userId = undefined;

   // Methods
   // Constants
   // Variables
   let email = undefined;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onSubmit = async (event) => {
      event.preventDefault();
      fetchStore.loading(true);
      let res, body;

      try {
         res = await fetch(`/api/users/${email.toLocaleLowerCase()}`, {
            headers: { 'Content-Type': 'application/json' },
         });

         if (res.body) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         userId = body._id;
         resetToken = body.token;
         fetchStore.loading(false);
         history.pushState({ path: '/Login/ConfirmPasswordForm' }, '');
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Lifecycle
</script>

<form on:submit={onSubmit} class="auth-form">
   <Input bind:value={email} label="Email" required type="email" fullWidth>
      <svelte:fragment slot="helperText">
         <HelperText validation>Invalid Email</HelperText>
      </svelte:fragment>
   </Input>

   <div class="row">
      <A href="/Login/LoginForm">Back To Login</A>

      <Button variant="contained" type="submit">
         Send Reset Code

         <svelte:fragment slot="trailingIcon">
            <Svg fileData={email_svg} />
         </svelte:fragment>
      </Button>
   </div>
</form>

<style>
   .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
   }
</style>
