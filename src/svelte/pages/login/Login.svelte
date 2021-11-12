<script>
   // Components
   import LoginForm from './Components/LoginForm.svelte';

   // Stores
   // Properties
   // Methods
   // Constants
   const comps = {
      LoginForm,
   };

   // Variables
   let comp = LoginForm;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: h2Text = comp === LoginForm ? 'Sign In' : 'Forgot Password';

   // Events
   // Lifecycle
</script>

<section class="page">
   <h2>{h2Text}</h2>
   <p>Hollister-Whitney Engineering Calculator</p>
   <svelte:component this={comp} />
</section>

<style lang="scss">
   @use 'src/scss/theme' as vantage;

   :global {
      .auth-form {
         @include vantage.border-top;
         @include vantage.paper;
         padding: 1rem;
         min-width: 500px;
         max-width: 800px;
         margin: 0 auto;
      }
   }

   section {
      display: flex;
      flex-direction: column;
      align-items: stretch;
   }

   h2 {
      text-align: center;
      font-size: 30px;
      font-weight: 400;
      margin-top: 60px;
      margin-bottom: 6px;
      color: vantage.$gray-40;
   }
   p {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      margin-top: 6px;
      color: vantage.$gray-20;
   }
</style>
