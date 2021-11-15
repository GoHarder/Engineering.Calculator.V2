<script>
   import { classList } from '../../lib';

   // Components
   // Stores
   // Properties
   // Methods
   // Constants
   const id = Math.random().toString(36).substr(2, 9);

   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: spanClass = classList(['mdc-evolution-chip', $$props.class]);

   // Events
   // Lifecycle
</script>

<span class={spanClass} role="row" id="chip-{id}">
   <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell">
      <button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="0">
         <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary" />
         <span class="mdc-evolution-chip__text-label"><slot /></span>
      </button>
   </span>
</span>

<style lang="scss" global>
   @use "@material/chips/styles";
</style>
