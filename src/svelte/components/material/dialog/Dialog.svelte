<script>
   import { createEventDispatcher, onMount, onDestroy } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCDialog } from '@material/dialog';
   import { forwardEvents } from '../../lib';

   // Components
   // Stores
   // Properties
   export let show = undefined;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();
   const events = forwardEvents(get_current_component(), ['MDCDialog:closed', 'MDCDialog:opened']);
   const id = Math.random().toString(36).substr(2, 9);

   // Variables
   let divEle;
   let Dialog;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (Dialog && show !== undefined) {
      if (show) {
         Dialog.open();
      } else {
         Dialog.close();
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
      Dialog = new MDCDialog(divEle);

      const buttons = divEle.querySelectorAll('button');

      buttons.forEach((button) => {
         button.classList.add('mdc-dialog__button');
      });
   });

   onDestroy(() => {
      Dialog.destroy();
   });
</script>

<div bind:this={divEle} use:events on:MDCDialog:opened={onOpened} on:MDCDialog:closed={onClosed} class="mdc-dialog">
   <div class="mdc-dialog__container">
      <div class="mdc-dialog__surface" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title-{id}" aria-describedby="dialog-content-{id}">
         {#if $$slots.title}
            <slot name="title" />
         {/if}

         <div class="mdc-dialog__content" id="dialog-content-{id}"><slot /></div>

         <div class="mdc-dialog__actions">
            <slot name="actions" />
         </div>
      </div>
   </div>
   <div class="mdc-dialog__scrim" />
</div>

<style lang="scss" global>
   @use 'src/scss/theme' as vantage;
   @use "@material/dialog";
   @include dialog.core-styles;
   .mdc-dialog .mdc-dialog__title.error,
   .mdc-dialog .mdc-dialog__content.error {
      color: vantage.$error;
   }
</style>
