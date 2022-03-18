<script>
   import { onMount, onDestroy } from 'svelte';
   import { MDCRipple } from '@material/ripple';

   // Components
   // Stores
   // Properties
   export let alt = '';
   export let label = '';
   export let src = '';
   export let select = false;

   // Methods
   // Constants
   // Variables
   let spanEle;
   let Ripple;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
   onMount(() => {
      if (select) {
         Ripple = new MDCRipple(spanEle);
      }
   });

   onDestroy(() => {
      Ripple?.destroy();
   });
</script>

<li on:click class="mdc-image-list__item">
   <div bind:this={spanEle} class="image-list-item__ripple-surface mdc-ripple-surface" />

   <div class="mdc-image-list__image-aspect-container">
      <img class="mdc-image-list__image" {src} {alt} />
   </div>
   <div class="mdc-image-list__supporting">
      <span class="mdc-image-list__label">{label}</span>
   </div>
</li>

<style lang="scss">
   @use '@material/ripple';

   :global {
      .image-list-item__ripple-surface {
         @include ripple.surface;
         @include ripple.radius-bounded;
         @include ripple.states;

         position: absolute;
         cursor: pointer;
         inset: 0;
         z-index: 1;
         overflow: hidden;
      }
   }
</style>
