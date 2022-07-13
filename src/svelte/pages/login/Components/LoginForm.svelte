<script>
   // Components
   import { A } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, Input, InputPassword } from 'components/material/input';

   // Stores
   import fetchStore from 'stores/fetch';
   import userStore from 'stores/user';

   // Properties
   export const resetToken = undefined;

   // Methods
   // Constants
   // Variables
   let email = undefined;
   let longToken = false;
   let password = undefined;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onSubmit = async (event) => {
      event.preventDefault();
      fetchStore.loading(true);
      let res, body;

      try {
         const reqBody = JSON.stringify({ email: email.toLowerCase(), password, longToken });

         res = await fetch('/api/tokens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: reqBody,
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);
         userStore.setToken(body.token);
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

   <InputPassword bind:value={password} label="Password" required fullWidth>
      <svelte:fragment slot="helperText">
         <HelperText validation>Invalid Password</HelperText>
      </svelte:fragment>
   </InputPassword>

   <div class="row">
      <Checkbox bind:checked={longToken} label="Keep me signed in" />

      <div class="row-link">
         <span>&nbsp;|&nbsp;</span>

         <A href="/Login/ForgotPasswordForm">Forgot Password?</A>
      </div>
   </div>

   <div class="row">
      <Button variant="contained" type="submit">
         Sign In

         <svelte:fragment slot="trailingIcon">
            <Icon>login</Icon>
         </svelte:fragment>
      </Button>
   </div>
</form>

<style lang="scss">
   .row {
      display: flex;
      justify-content: center;
      align-items: center;
      &-link {
         display: flex;
         align-items: center;
         height: 40px;
         margin-bottom: 19px;
      }
   }
</style>
