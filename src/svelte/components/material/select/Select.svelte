<script>
   import { onDestroy, onMount } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCSelect } from '@material/select';
   import { classList, filterProps, forwardEvents, randomId } from '../../lib';

   // Components
   // Stores
   // Properties
   export let label = '';
   export let disabled = false;
   export let gridArea = undefined;
   export let options = undefined;
   export let required = false;
   export let selected = undefined;
   export let type = undefined;
   export let value = undefined;
   export let fullWidth = false;

   // Methods
   const updateSelected = (value) => {
      const liEles = divEle.querySelectorAll('.mdc-deprecated-list-item');

      let index;

      liEles.forEach((item, i) => {
         if (item.dataset.value === `${value}`) index = i;
      });

      if (index !== undefined) {
         Select.selectedIndex = index;
      } else {
         Select.selectedIndex = -1;
      }
   };

   // Constants
   const events = forwardEvents(get_current_component(), ['MDCSelect:change']);
   const id = `select-${randomId()}`;

   // Variables
   let divEle;
   let Select;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: props = filterProps($$props, ['class', 'options', 'selected', 'fullWidth', 'label', 'value', 'type']);

   $: divClass = classList(['mdc-select mdc-select--filled', $$props.class, fullWidth ? 'mdc-select--fullwidth' : '']);

   $: if (Select) {
      Select.disabled = disabled;
      Select.required = required;
   }

   $: if (Select && value) {
      updateSelected(value);
   }

   // Events
   const onChange = (event) => {
      switch (type) {
         case 'number':
            value = parseFloat(event.detail.value);
            break;
         default:
            value = event.detail.value;
            break;
      }

      if (options) selected = options[event.detail.index];
   };

   // Lifecycle
   onMount(() => {
      Select = new MDCSelect(divEle);

      updateSelected(value);


      if (gridArea) {
         divEle.style.gridArea = gridArea;
      }
   });

   onDestroy(() => {
      Select.destroy();
   });
</script>

<div bind:this={divEle} use:events on:MDCSelect:change={onChange} class={divClass} {...props}>
   <div class="mdc-select__anchor" role="button" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="demo-label demo-selected-text">
      <span class="mdc-select__ripple" />
      <span {id} class="mdc-floating-label">{label}</span>
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
      <ul class="mdc-deprecated-list" role="listbox" aria-label={id}>
         <slot />
      </ul>
   </div>
</div>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/theme' with ($primary: vantage.$primary, $secondary: vantage.$secondary);
   @use '@material/select';
   @use '@material/select/styles';

   .mdc-select {
      @include select.label-color(vantage.$secondary);
      @include select.filled-shape-radius(0);
   }

   .mdc-select--fullwidth {
      width: 100%;
   }
</style>
