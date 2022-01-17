<script>
   // Components
   import { Icon, IconButton } from 'components/material/button';

   // Stores
   // Properties
   export let steel = {};
   export let supplied = false;
   export let existing = false;

   export let id = '';
   export let members = [];
   export let name = '';
   export let shape = '';
   export let label = '';
   export let reactions = { rA: 0, rB: 0 };

   // Methods
   // Constants
   // Variables
   let test = false;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
</script>

<div class="fieldset">
   <header>
      <p>Some sort of title</p>

      <IconButton on={test} toggle class="density-2">
         <Icon>copy_all</Icon>
      </IconButton>

      <IconButton on={test} toggle class="density-2">
         <Icon class="mdc-icon-button__icon--on">minimize</Icon>
         <Icon>maximize</Icon>
      </IconButton>

      <IconButton class="density-2">
         <Icon>close</Icon>
      </IconButton>
   </header>

   <hr />

   {steel}
   {supplied}
   {existing}
   {id}
   {members}
   {name}
   {shape}
   {label}
   {reactions}
</div>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .fieldset {
      @include vantage.paper;
      padding: 5.6px 12px 10px;
   }

   header {
      display: flex;
      align-items: center;
   }

   p {
      font-size: 1.1rem;
      margin: 0;
      margin-top: 6px;
      margin-right: auto;

      // margin: 6px 0 10px;
   }

   hr {
      border: 1px solid vantage.$primary;
   }
</style>
