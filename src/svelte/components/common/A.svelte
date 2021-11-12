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

<style lang="scss">
   a {
      color: #0d47a1;
      font-size: 14px;
      text-decoration: none;
      position: relative;
      &::after {
         content: '';
         position: absolute;
         left: 0;
         bottom: 0;
         background-color: #0d47a1;
         width: 100%;
         height: 1px;
         transform: scaleX(0);
         transform-origin: right;
         transition: transform ease 250ms;
      }
      &:hover::after {
         transform: scaleX(1);
         transform-origin: left;
      }
   }
</style>
