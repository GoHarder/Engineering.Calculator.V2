<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCTabBar } from '@material/tab-bar';
   import { classList, forwardEvents } from '../../lib';

   // Components
   // Stores
   // Properties
   export let comps = [];
   export let index = undefined;

   // Methods
   // Constants
   const events = forwardEvents(get_current_component(), ['MDCTabBar:activated']);
   const dispatch = createEventDispatcher();

   // Variables
   let divEle;
   let TabBar;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: divClass = classList(['mdc-tab-bar', $$props.class]);

   $: if (index !== undefined && TabBar) TabBar.activateTab(index);

   // Events
   const onActivated = (event) => {
      dispatch('activated', comps[event.detail.index]);
   };

   // Lifecycle
   onMount(() => {
      TabBar = new MDCTabBar(divEle);
   });

   onDestroy(() => {
      TabBar.destroy();
   });
</script>

<div bind:this={divEle} use:events on:MDCTabBar:activated={onActivated} class={divClass} role="tablist">
   <div class="mdc-tab-scroller">
      <div class="mdc-tab-scroller__scroll-area">
         <div class="mdc-tab-scroller__scroll-content">
            <slot />
         </div>
      </div>
   </div>
</div>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/theme' with ($primary: vantage.$secondary);
   @use '@material/tab-bar/mdc-tab-bar';
   @use '@material/tab-scroller/mdc-tab-scroller';
   @use '@material/tab-indicator/mdc-tab-indicator';
   @use '@material/tab/mdc-tab';
</style>
