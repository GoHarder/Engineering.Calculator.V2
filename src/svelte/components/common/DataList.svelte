<script>
   import { slide } from 'svelte/transition';

   // Components
   // Stores
   // Properties
   export let focused = undefined;
   export let onChange = undefined;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onClick = (event) => {
      if (event.target.dataset?.value) {
         onChange({ target: { value: event.target.dataset.value } });
      }
   };

   // Lifecycle
</script>

{#if focused}
   <div class="mdc-menu mdc-menu-surface mdc-menu-surface--open" in:slide out:slide={{ delay: 250 }}>
      <ul on:click={onClick} class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
         <slot />
      </ul>
   </div>
{/if}

<style>
   .mdc-menu {
      position: absolute;
      width: 300px;
      top: 56px;
      left: 0;
   }
</style>
