<script>
   // Components
   import { InputLength } from 'components/material/input';

   // Stores
   // Properties

   export let length = 0;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
</script>

<div class="form">
   <InputLength bind:value={length} label="Length" />

   <slot />
</div>

<style>
</style>
