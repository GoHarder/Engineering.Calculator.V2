<script>
   import { beam_svg } from 'svg';

   // Components
   import { A, Svg } from 'components/common';
   import { Icon, Tab, TabBar } from 'components/material/tab-bar';

   import Steel from './components/Steel.svelte';
   import Users from './components/Users.svelte';

   // Stores
   // Properties
   // Methods
   // Constants
   const comps = [Users, Steel];

   // Variables
   let comp = Users;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onActivated = (event) => (comp = event.detail);

   // Lifecycle
</script>

<header>
   <A href="back">Back</A>
   <div class="title">
      <Icon class="material-icons">supervisor_account</Icon>
      <h3>Admin Tools</h3>
   </div>
</header>

<div class="app-container">
   <TabBar on:activated={onActivated} {comps}>
      <Tab active>
         <svelte:fragment slot="icon">
            <Icon>manage_accounts</Icon>
         </svelte:fragment>
         Users
      </Tab>
      <Tab>
         <svelte:fragment slot="icon">
            <Svg fileData={beam_svg} />
         </svelte:fragment>
         Steel
      </Tab>
   </TabBar>

   <section>
      <svelte:component this={comp} />
   </section>
</div>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .app-container {
      @include vantage.paper;
      min-height: calc(100vh - 200px);
   }

   section {
      border-top: 1px solid rgba($color: #000000, $alpha: 0.12);
      padding: 1em;
   }

   .title {
      display: flex;
      align-items: center;
      margin: 0 0 0.5em;
   }

   h3 {
      font-weight: 600;
      font-size: 1.25rem;
      line-height: 1.6;
      margin: 0 0 0 0.5em;
   }
</style>
