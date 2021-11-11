<script>
   // Components
   import Login from './components/Login.svelte';

   // Stores
   // Properties
   // Methods
   // Constants
   const comps = {
      Login,
   };

   // Variables
   let comp = Login;
   let resetToken = undefined;
   let userId = undefined;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: h2Text = comp === Login ? 'Sign In' : 'Forgot Password';

   // Events
   const onChangeForm = (event) => (comp = comps[event.detail]);

   // Lifecycle
</script>

<template>
   <h2>{h2Text}</h2>
   <p>Hollister-Whitney Engineering Calculator</p>
   <svelte:component this={comp} bind:resetToken bind:userId on:changeForm={onChangeForm} />
</template>

<style lang="scss">
   @use './src/scss/theme';

   :global {
      .auth-form {
         @include theme.border-top;
         @include theme.paper;
         padding: 1rem;
         min-width: 500px;
         max-width: 800px;
         margin: 0 auto;
      }
   }

   h2 {
      text-align: center;
      font-size: 30px;
      font-weight: 400;
      padding-top: 60px;
      margin: 0 0 0.5em;
      color: theme.$gray-40;
   }

   p {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      margin-top: 6px;
      color: theme.$gray-20;
   }
</style>
