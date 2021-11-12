<script>
   import { login_svg } from 'img/icons';

   // Components
   import { A, Svg } from 'components/common';
   import { Button } from 'components/material/button';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, Input, InputPassword } from 'components/material/input';

   // Stores
   import fetchStore from 'stores/fetch';
   import userStore from 'stores/user';

   // Properties
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
         const reqBody = JSON.stringify({ email, password, longToken });

         res = await fetch('/api/tokens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: reqBody,
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);
         userStore.set(body.token);
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

   <InputPassword bind:value={password} label="Password" fullWidth>
      <svelte:fragment slot="helperText">
         <HelperText validation>Invalid Password</HelperText>
      </svelte:fragment>
   </InputPassword>

   <div class="row">
      <Checkbox bind:checked={longToken} label="Keep me signed in" />

      <span>&nbsp;|&nbsp;</span>

      <A href="/Login/ForgotPasswordForm">Forgot Password?</A>
   </div>

   <div class="row">
      <Button variant="contained" type="submit">
         Sign In

         <svelte:fragment slot="trailingIcon">
            <Svg fileData={login_svg} />
         </svelte:fragment>
      </Button>
   </div>
</form>

<style lang="scss">
   .row {
      display: flex;
      justify-content: center;
      align-items: center;
      &:last-child {
         margin-top: 0.5em;
      }
   }
</style>
