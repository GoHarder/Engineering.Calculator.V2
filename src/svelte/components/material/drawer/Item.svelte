<script>
   // Components
   // Stores
   // Properties
   export let href = undefined;
   export let update = undefined;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onClick = (event) => {
      event.preventDefault();

      update?.();

      history.pushState({ path: href }, '');
   };

   // Lifecycle
</script>

<a on:click={onClick} class="mdc-deprecated-list-item" {href}>
   <span class="mdc-list-item__ripple" />
   <slot name="icon" />
   <!-- <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i> -->
   <span class="mdc-list-item__text"><slot /></span>
</a>

<style>
</style>
