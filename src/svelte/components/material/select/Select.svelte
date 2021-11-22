<script>
   import { onDestroy, onMount } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCSelect } from '@material/select';
   import { forwardEvents } from '../js/svelte';

   // Components
   // Stores
   // Properties
   export let label = '';
   export let disabled = false;
   export let required = false;
   export let selectedIndex = -1;
   export let value = undefined;

   // Methods
   // Constants
   const events = forwardEvents(get_current_component(), ['MDCSelect:change']);

   // Variables
   let divEle;
   let Select;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: if (Select) {
      Select.disabled = disabled;
      Select.required = required;
   }

   // Events
   const onChange = (event) => {
      value = event.detail.value;
      selectedIndex = event.detail.index;
   };

   // Lifecycle
   onMount(() => {
      Select = new MDCSelect(divEle);
   });

   onDestroy(() => {
      Select.destroy();
   });
</script>

<div bind:this={divEle} use:events on:MDCSelect:change={onChange} class="mdc-select mdc-select--filled">
   <div class="mdc-select__anchor" role="button" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="demo-label demo-selected-text">
      <span class="mdc-select__ripple" />
      <span id="demo-label" class="mdc-floating-label">{label}</span>
      <span class="mdc-select__selected-text-container">
         <span id="demo-selected-text" class="mdc-select__selected-text" />
      </span>
      <span class="mdc-select__dropdown-icon">
         <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">
            <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10" />
            <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15" />
         </svg>
      </span>
      <span class="mdc-line-ripple" />
   </div>

   <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
      <ul class="mdc-deprecated-list" role="listbox" aria-label="Food picker listbox">
         <slot />
      </ul>
   </div>
</div>

<style lang="scss" global>
   @use './src/scss/vantage-theme';
   @use "@material/theme" with (
      $primary: vantage-theme.$mdc-theme-primary,
      $secondary: vantage-theme.$mdc-theme-secondary,
   );
   @use "@material/select";
   @use "@material/select/styles";

   .mdc-select {
      @include select.label-color(vantage-theme.$mdc-theme-secondary);
      @include select.filled-shape-radius(0);
   }
</style>
