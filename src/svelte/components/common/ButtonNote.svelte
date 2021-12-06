<script>
   import { scale } from 'svelte/transition';

   // Components
   // Stores
   // Properties
   export let text = undefined;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
</script>

<div class="wrapper">
   <slot />
   {#if text}
      <p transition:scale>{text}</p>
   {/if}
</div>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .wrapper {
      display: inline-block;
      position: relative;
   }

   p {
      background-color: vantage.$primary;
      color: vantage.$secondary;
      position: absolute;
      border-radius: 50px;
      right: 0;
      top: 0;
      margin: 0 auto;
      pointer-events: none;
      width: 20px;
      height: 20px;
      font-size: 0.8rem;
      text-align: center;
   }
</style>
