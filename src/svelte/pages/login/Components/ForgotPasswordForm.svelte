<script>
   import { email_svg } from 'img/icons';

   // Components
   import { A, Svg } from 'components/common';
   import { Button } from 'components/material/button';
   import { HelperText, Input } from 'components/material/input';

   // Stores
   // Properties
   // Methods
   // Constants
   // Variables
   let email = undefined;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onSubmit = (event) => {
      event.preventDefault();
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
