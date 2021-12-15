<script>
   import { afterUpdate, onDestroy, onMount } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCSelect } from '@material/select';
   import { MDCSelectIcon } from '@material/select/icon';
   import { classList, filterProps, forwardEvents, randomId } from '../../lib';

   // Components
   import Icon from '../common/Icon.svelte';

   // Stores
   // Properties
   export let calc = undefined;
   export let label = '';
   export let disabled = false;
   export let options = undefined;
   export let override = false;
   export let required = false;
   export let selected = undefined;
   export let type = undefined;
   export let value = undefined;
   export let fullWidth = false;

   // Methods
   const updateSelected = (value) => {
      Select.value = `${value}`;
   };

   // Constants
   const events = forwardEvents(get_current_component(), ['MDCSelect:change']);
   const id = `select-${randomId()}`;

   // Variables
   let divEle;
   let SelectIcon;
   let Select;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: props = filterProps($$props, ['class', 'options', 'selected', 'fullWidth', 'label', 'value', 'type']);

   $: divClass = classList(['mdc-select mdc-select--filled', $$props.class, calc !== undefined ? 'mdc-select--with-leading-icon' : '']);

   $: if (Select) {
      Select.disabled = disabled;
      Select.required = required;
   }

   $: if (!override && calc !== undefined) value = calc;

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

      override = calc !== value;

      if (options) selected = options[event.detail.index];
   };

   const onReset = () => (override = false);

   // Lifecycle
   onMount(() => {
      Select = new MDCSelect(divEle);

      if (calc !== undefined) {
         const icon = divEle.querySelector('.mdc-select__icon');
         SelectIcon = new MDCSelectIcon(icon);
      }
   });

   afterUpdate(() => {
      // This syncs the code with the DOM
      Select.layoutOptions();
      updateSelected(value);
   });

   onDestroy(() => {
      Select.destroy();
      SelectIcon?.destory();
   });
</script>

<div class="input" class:full-width={fullWidth}>
   <div bind:this={divEle} use:events on:MDCSelect:change={onChange} class={divClass} {...props}>
      <div class="mdc-select__anchor" role="button" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="demo-label demo-selected-text">
         <span class="mdc-select__ripple" />
         <span {id} class="mdc-floating-label">{label}</span>

         {#if calc !== undefined}
            <Icon on:click={onReset} class="material-icons mdc-select__icon" tabindex="0" role="button" toolTip={override ? 'Reset To Default' : ''}>
               {override ? 'edit_off' : 'edit'}
            </Icon>
         {/if}

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

   <slot name="helperText" />
</div>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/theme' with ($primary: vantage.$primary, $secondary: vantage.$secondary);
   @use '@material/select';
   @use '@material/select/styles';

   .mdc-select {
      @include select.label-color(vantage.$secondary);
      @include select.filled-shape-radius(0);
      width: 100%;
   }

   @include vantage.scrollbar('.mdc-select__menu', vantage.$white);
</style>
