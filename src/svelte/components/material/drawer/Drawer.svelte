<script>
   import { onDestroy, onMount } from 'svelte';
   import { MDCDrawer } from '@material/drawer';

   // Components
   // Stores
   // Properties
   // Methods
   // Constants
   // Variables
   let asideEle;
   let Drawer;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
   onMount(() => {
      Drawer = MDCDrawer.attachTo(asideEle);
      Drawer.open = true;
   });

   onDestroy(() => {
      Drawer.destroy();
   });
</script>

<aside bind:this={asideEle} class="mdc-drawer mdc-drawer--dismissible">
   {#if $$slots.title}
      <div class="mdc-drawer__header">
         <h3 class="mdc-drawer__title"><slot name="title" /></h3>
         {#if $$slots.subtitle}
            <h6 class="mdc-drawer__subtitle"><slot name="subtitle" /></h6>
         {/if}
      </div>
   {/if}

   <div class="mdc-drawer__content">
      <nav class="mdc-list">
         <slot />
      </nav>
   </div>
</aside>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/drawer';

   @include drawer.core-styles;
   @include drawer.dismissible-core-styles;
   @include drawer.modal-core-styles;

   .mdc-drawer {
      @include vantage.scrollbar(#ffffff);
   }

   .mdc-drawer-app-content {
      @include vantage.scrollbar(#ffffff);
   }
</style>
