<script>
   import { onDestroy, onMount } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCDrawer } from '@material/drawer';
   import { forwardEvents } from '../../lib';

   // Components
   // Stores
   // Properties
   export let selectedIndex = undefined;
   export let show = undefined;

   // Methods
   // Constants
   const events = forwardEvents(get_current_component(), ['MDCDrawer:closed', 'MDCDrawer:opened']);

   // Variables
   let asideEle;
   let Drawer;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (Drawer && show !== undefined) {
      Drawer.open = show;
   }

   $: if (Drawer && selectedIndex !== undefined) {
      Drawer.list.selectedIndex = selectedIndex;
   }

   // Events
   const onClosed = () => {
      show = false;
   };

   const onOpened = () => {
      show = true;
   };

   // Lifecycle
   onMount(() => {
      Drawer = MDCDrawer.attachTo(asideEle);
      Drawer.open = show;
   });

   onDestroy(() => {
      Drawer.destroy();
   });
</script>

<aside bind:this={asideEle} on:MDCDrawer:opened={onOpened} on:MDCDrawer:closed={onClosed} use:events class="mdc-drawer mdc-drawer--dismissible">
   {#if $$slots.title}
      <div class="mdc-drawer__header">
         <h3 class="mdc-drawer__title"><slot name="title" /></h3>
         {#if $$slots.subtitle}
            <h6 class="mdc-drawer__subtitle"><slot name="subtitle" /></h6>
         {/if}
      </div>
   {/if}

   <div class="mdc-drawer__content">
      <nav class="mdc-list mdc-deprecated-list">
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
      @include drawer.item-shape-radius(0, 0);
   }

   @include vantage.scrollbar('.mdc-drawer__content', #ffffff);
   .mdc-drawer-app-content {
      position: relative;
      height: 100%;
      overflow: auto;
      overflow: hidden;
   }
</style>
