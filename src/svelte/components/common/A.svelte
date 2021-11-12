<script>
   // Components
   // Stores
   // Properties
   export let href = undefined;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onClick = (event) => {
      event.preventDefault();
      history.pushState({ path: href }, '');
   };

   // Lifecycle
</script>

<a on:click={onClick} {href}>
   <slot />
</a>

<style>
</style>
