<script>
   import { createEventDispatcher, onMount, onDestroy } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCDialog } from '@material/dialog';
   import { classList, forwardEvents } from '../../lib';

   // Components
   // Stores
   // Properties
   export let draggable = false;
   export let show = undefined;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();
   const events = forwardEvents(get_current_component(), ['MDCDialog:closed', 'MDCDialog:opened']);
   const id = Math.random().toString(36).substr(2, 9);

   // Variables
   let divEle;
   let Dialog;
   let moving = false;
   let top = 0;
   let left = 0;

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

   const onMouseDown = () => {
      moving = true;
   };

   const onMouseMove = (event) => {
      if (moving && draggable) {
         left += event.movementX;
         top += event.movementY;
      }
   };

   const onMouseUp = () => {
      moving = false;
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

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<div bind:this={divEle} use:events on:MDCDialog:opened={onOpened} on:MDCDialog:closed={onClosed} class="mdc-dialog">
   <div class="mdc-dialog__container">
      <div
         class="mdc-dialog__surface"
         role="alertdialog"
         aria-modal="true"
         aria-labelledby="dialog-title-{id}"
         aria-describedby="dialog-content-{id}"
         style="left: {left}px; top: {top}px;"
      >
         {#if draggable}
            <div class="drag-bar" class:moving on:mousedown={onMouseDown} />
         {/if}

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
   @use '@material/dialog';
   @include dialog.core-styles;
   .mdc-dialog .mdc-dialog__title.error,
   .mdc-dialog .mdc-dialog__content.error {
      color: vantage.$error;
   }

   .drag-bar {
      content: '';
      background-color: vantage.$secondary;
      height: 1em;
      cursor: move;
      cursor: grab;

      &.moving {
         cursor: grabbing;
      }
   }
</style>
