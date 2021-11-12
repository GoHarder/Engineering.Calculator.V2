<script>
   import { onMount, onDestroy } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCMenu } from '@material/menu';
   import { forwardEvents } from '../../lib';

   // Components
   // Stores
   // Properties
   export let anchorCorner = 'bottom-left';
   export let show = false;

   // Methods
   // Constants
   const events = forwardEvents(get_current_component(), ['MDCMenuSurface:closed', 'MDCMenuSurface:opened', 'MDCMenu:selected']);

   const corners = {
      'top-left': 0,
      'top-right': 4,
      'bottom-left': 1,
      'bottom-right': 5,
   };

   // Variables
   let divEle;
   let Menu;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (Menu) Menu.open = show;

   // Events
   const onClosed = () => (show = false);

   const onOpened = () => (show = true);

   // Lifecycle
   onMount(() => {
      Menu = new MDCMenu(divEle);
      Menu.setAnchorCorner(corners[anchorCorner]);

      const items = divEle.querySelectorAll('li');

      items.forEach((item) => {
         item.setAttribute('role', 'menuitem');
      });
   });

   onDestroy(() => {
      Menu.destroy();
   });
</script>

<div bind:this={divEle} use:events on:MDCMenuSurface:opened={onOpened} on:MDCMenuSurface:closed={onClosed} class="mdc-menu mdc-menu-surface">
   <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
      <slot />
   </ul>
</div>

<style lang="scss" global>
   @use "@material/menu-surface/mdc-menu-surface";
   @use "@material/menu/mdc-menu";
</style>
