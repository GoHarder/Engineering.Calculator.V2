<script>
   import { createEventDispatcher, onMount, onDestroy } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCDialog } from '@material/dialog';
   import { classList, forwardEvents, randomId } from '../../lib';

   // Components
   // Stores
   // Properties
   export let draggable = false;
   export let fullScreen = false;
   export let show = undefined;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();
   const events = forwardEvents(get_current_component(), ['MDCDialog:closed', 'MDCDialog:opened']);
   const id = `dialog-${randomId()}`;

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

   $: divClass = classList(['mdc-dialog', fullScreen ? 'mdc-dialog--fullscreen' : '']);

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

      const buttons = divEle.querySelectorAll('.mdc-dialog__actions > button');

      buttons?.forEach((button) => {
         button.classList.add('mdc-dialog__button');
      });
   });

   onDestroy(() => {
      Dialog.destroy();
   });
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<div bind:this={divEle} use:events on:MDCDialog:opened={onOpened} on:MDCDialog:closed={onClosed} class={divClass}>
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
            <div class="mdc-dialog__header">
               <slot name="title" />
            </div>
         {/if}

         <div class="mdc-dialog__content" id="dialog-content-{id}"><slot /></div>

         {#if $$slots.actions}
            <div class="mdc-dialog__actions">
               <slot name="actions" />
            </div>
         {/if}
      </div>
   </div>
   <div class="mdc-dialog__scrim" />
</div>

<!-- <div class="mdc-dialog mdc-dialog--open mdc-dialog--fullscreen">
   <div class="mdc-dialog__container">


      <div class="mdc-dialog__surface" role="dialog" aria-modal="true" aria-labelledby="my-dialog-title" aria-describedby="my-dialog-content">
         <div class="mdc-dialog__header">
            <h2 class="mdc-dialog__title" id="my-dialog-title">Full-Screen Dialog Title</h2>
            <button class="mdc-icon-button material-icons mdc-dialog__close" data-mdc-dialog-action="close"> close </button>
         </div>
         <div class="mdc-dialog__content" id="my-dialog-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed scelerisque metus dapibus, maximus massa pulvinar, commodo nunc. Quisque vitae luctus lectus, ut
            tempus ipsum. Sed suscipit gravida scelerisque. Aenean vulputate elementum est, quis consectetur orci consectetur ac. Quisque accumsan vel nisi id dapibus.
            Suspendisse nec urna eu massa ornare rutrum. Vivamus at nisi sit amet nulla pretium volutpat sit amet in justo. Donec mi metus, interdum ac tincidunt at, vehicula
            vitae nisl. Morbi fermentum dapibus massa, nec lobortis massa vestibulum eu.
         </div>
         <div class="mdc-dialog__actions">
            <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="ok">
               <div class="mdc-button__ripple" />
               <span class="mdc-button__label">OK</span>
            </button>
         </div>
      </div>


   </div>
   <div class="mdc-dialog__scrim" />
</div> -->
<style lang="scss" global>
   @use 'src/scss/theme' as vantage;
   @use '@material/dialog';
   @include dialog.core-styles;

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

   @include vantage.scrollbar('.mdc-dialog__content', vantage.$white);
</style>
