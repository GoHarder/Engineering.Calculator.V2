<script>
   // Components
   import { A } from 'components/common';
   import { Icon, IconButton } from 'components/material/button';
   import { Content, Divider, Drawer, Item } from 'components/material/drawer';

   // Stores
   // Properties
   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
</script>

<header>
   <div>
      <nav>
         <A href="/Home">Home</A>
         <span>&nbsp;&gt;&nbsp;</span>
         <A href="/Project/Summary">Configuration</A>
      </nav>

      <div class="title">
         <Icon class="material-icons">calculate</Icon>
         <h3>Project Configuration</h3>
      </div>
   </div>

   <div class="buttons">
      <IconButton toolTip="Share">
         <Icon>share</Icon>
      </IconButton>
      <IconButton toolTip="Notes">
         <Icon>edit_note</Icon>
      </IconButton>
      <IconButton toolTip="Save PDF">
         <Icon>save_alt</Icon>
      </IconButton>
      <IconButton toolTip="Save">
         <Icon>save</Icon>
      </IconButton>
   </div>
</header>

<div class="drawer-wrapper">
   <Drawer>
      <svelte:fragment slot="title">Modules</svelte:fragment>
      <Item>Item</Item>
   </Drawer>

   <Content>
      <div class="top">
         <IconButton toolTip="Menu">
            <Icon>menu</Icon>
         </IconButton>

         <h4 class="mdc-drawer__title">Title</h4>

         <IconButton toolTip="Previous">
            <Icon>chevron_left</Icon>
         </IconButton>
         <div class="vr" />
         <IconButton toolTip="Next">
            <Icon>chevron_right</Icon>
         </IconButton>
      </div>

      <div class="comp">Thing here...</div>
   </Content>
</div>

<style lang="scss">
   @use 'src/scss/theme' as vantage;
   header {
      display: flex;
      align-items: flex-end;
   }

   .buttons {
      margin: 0 0 0 auto;
   }
   nav {
      display: flex;
      align-items: center;
      justify-content: baseline;
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

   .drawer-wrapper {
      position: relative;
      width: 100%;
      height: calc(100vh - 190px);
      @include vantage.border-top;
      @include vantage.paper;
   }

   span {
      font-size: 14px;
   }

   .top {
      height: 50px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
   }

   .comp {
      height: calc(100% - 50px);
      overflow-x: hidden;
      overflow-y: scroll;
      padding: 0.5em 0 0.5em 0.5em;
      background-color: vantage.$gray-90;
   }
   @include vantage.scrollbar('.comp', vantage.$gray-90);
   h4 {
      margin: 0 0.5em;
      margin-right: auto;
   }

   .vr {
      content: '';
      height: 100%;
      width: 1px;
      background-color: vantage.$gray-90;
   }
</style>
