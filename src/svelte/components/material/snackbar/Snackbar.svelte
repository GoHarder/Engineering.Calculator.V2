<script>
   import { createEventDispatcher, onMount, onDestroy } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCSnackbar } from '@material/snackbar';
   import { forwardEvents } from '../../lib';

   // Components
   // Stores
   // Properties
   export let show = undefined;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();
   const events = forwardEvents(get_current_component(), ['MDCSnackbar:closed', 'MDCSnackbar:opened']);

   // Variables
   let asideEle;
   let Snackbar;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (Snackbar && show !== undefined) {
      if (show) {
         Snackbar.open();
      } else {
         Snackbar.close();
      }
   }

   // Events
   const onClosed = () => {
      dispatch('closed');
      show = false;
   };

   const onOpened = () => {
      dispatch('open');
      show = true;
   };

   // Lifecycle
   onMount(() => {
      Snackbar = new MDCSnackbar(asideEle);
   });

   onDestroy(() => {
      Snackbar.destroy();
   });
</script>

<aside bind:this={asideEle} use:events on:MDCSnackbar:opened={onOpened} on:MDCSnackbar:closed={onClosed} class="mdc-snackbar">
   <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
      <div class="mdc-snackbar__label" aria-atomic="false"><slot /></div>

      <!-- NOTE: 10-22-2021 1:31 PM - Can add later if needed but it dismisses itself
      <div class="mdc-snackbar__actions" aria-atomic="true">
         <button type="button" class="mdc-button mdc-snackbar__action">
            <div class="mdc-button__ripple" />
            <span class="mdc-button__label">Retry</span>
         </button>
      </div>
      -->
   </div>
</aside>

<style lang="scss" global>
   @use "@material/snackbar/mdc-snackbar";
</style>
