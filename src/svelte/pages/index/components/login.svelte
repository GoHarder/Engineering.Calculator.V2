<script>
   import { email_svg, login_svg } from 'img/icons';

   // Components
   import { Button } from 'material/button';
   import { HelperText, Input, InputPassword } from 'material/input';
   import { Svg } from 'common';

   // Stores
   // Properties
   // Methods
   // Constants
   // Variables
   let email;
   let password;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onSubmit = async (event) => {
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

   <InputPassword bind:value={password} label="Password" fullWidth>
      <svelte:fragment slot="helperText">
         <HelperText validation>Invalid Password</HelperText>
      </svelte:fragment>
   </InputPassword>

   <!--
   <div class="row">
      <Checkbox bind:checked={longToken} label="Keep me signed in" />

      <span class="pipe">&nbsp;|&nbsp;</span>

      <A on:click={onForgotPassword}>Forgot Password?</A>
   </div>  
   -->
   <div class="row">
      <Button variant="contained" type="submit">
         Sign In

         <svelte:fragment slot="trailingIcon">
            <Svg fileData={login_svg} />
         </svelte:fragment>
      </Button>
   </div>
</form>

<style>
   .row {
      display: flex;
      justify-content: center;
      align-items: center;
   }
</style>
