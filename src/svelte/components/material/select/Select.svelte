<script>
   import { onDestroy, onMount, setContext } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCSelect } from '@material/select';
   import { MDCSelectIcon } from '@material/select/icon';
   import { classList, filterProps, forwardEvents, randomId } from '../../lib';
   import { clone } from 'lib/main.mjs';

   // Components
   import Icon from '../common/Icon.svelte';

   // Stores
   // Properties
   export let calc = undefined;
   export let invalid = undefined;
   export let label = '';
   export let link = undefined;
   export let disabled = false;
   export let options = undefined;
   export let override = false;
   export let required = false;
   export let selected = undefined;
   export let type = undefined;
   export let value = undefined;
   export let fullWidth = false;

   // Methods
   let update = (value) => {
      if (!Select) return;
      Select.value = `${value}`;

      if (options === undefined) return;

      let copy = clone(options).filter((option) => Select.menuItemValues.includes(option.name));

      copy = copy.sort((a, b) => Select.menuItemValues.indexOf(a.name) - Select.menuItemValues.indexOf(b.name));

      selected = copy[Select.selectedIndex] || {};
   };

   // Constants
   const events = forwardEvents(get_current_component(), ['MDCSelect:change']);
   const id = `select-${randomId()}`;
   const helperId = `helper-text-${randomId()}`;

   // Variables
   let divEle;
   let SelectIcon;
   let Select;
   let menuItemValues = [];
   let useNativeValidation = true;

   // Subscriptions
   // Contexts
   setContext('Select', {
      getValue: (value) => (menuItemValues = [...menuItemValues, value]),
   });

   // Reactive Rules
   $: props = filterProps($$props, ['calc', 'class', 'invalid', 'options', 'override', 'selected', 'fullWidth', 'label', 'link', 'value', 'type']);

   $: divClass = classList([
      'mdc-select mdc-select--filled',
      $$props.class,
      calc !== undefined ? 'mdc-select--with-leading-icon' : '',
      link !== undefined ? 'mdc-select--with-link' : '',
   ]);

   $: if (Select) {
      Select.disabled = disabled;

      Select.required = required;

      if (useNativeValidation) {
         invalid = !Select.valid;
      } else {
         Select.valid = !invalid;
      }
   }

   $: if (!override && calc !== undefined) value = calc;

   $: if (value) update(value);

   $: if (Select && menuItemValues) {
      Select.layoutOptions();
      update(value);
   }

   $: if (options) {
      update(value);
   }

   // Events
   const onChange = (event) => {
      switch (type) {
         case 'number':
            value = parseFloat(event.detail.value);
            break;
         case 'boolean':
            value = JSON.parse(event.detail.value);
            break;
         default:
            value = event.detail.value;
            break;
      }

      override = calc !== value;
   };

   const onLink = () => history.pushState({ path: link }, '');

   const onReset = () => (override = false);

   // Lifecycle
   onMount(() => {
      Select = new MDCSelect(divEle);

      if (calc !== undefined) {
         const icon = divEle.querySelector('.mdc-select__icon');
         SelectIcon = new MDCSelectIcon(icon);
      }

      if ($$slots.helperText) {
         const p = divEle.nextElementSibling;
         // const anchor = divEle.querySelector('.mdc-select__anchor');

         p.id = helperId;
         // anchor.ariaDescribedBy = helperId;

         // console.log(anchor);
      }

      if (invalid !== undefined) {
         useNativeValidation = false;
      }

      Select.useNativeValidation = useNativeValidation;
   });

   onDestroy(() => {
      Select?.destroy();

      SelectIcon?.destroy();
   });
</script>

<div class="input" class:full-width={fullWidth}>
   <div bind:this={divEle} use:events on:MDCSelect:change={onChange} class={divClass} {...props}>
      <div class="mdc-select__anchor" role="button" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="demo-label demo-selected-text" aria-describedby={helperId}>
         <input type="hidden" />
         <span class="mdc-select__ripple" />
         <span {id} class="mdc-floating-label">{label}</span>

         {#if calc !== undefined}
            <Icon on:click={onReset} class="material-icons mdc-select__icon" tabindex="0" role="button" toolTip={override ? 'Reset To Default' : ''}>
               {override ? 'edit_off' : 'edit'}
            </Icon>
         {/if}

         <span class="mdc-select__selected-text-container">
            <span id="selected-text" class="mdc-select__selected-text" />
         </span>

         {#if link}
            <Icon
               on:click={onLink}
               class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
               style="color: rgba(0, 0, 0, 0.56);"
               role="button"
               tabindex="0"
               toolTip={link.match(/\w+$/)[0]}
            >
               link
            </Icon>
         {:else}
            <span class="mdc-select__dropdown-icon">
               <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">
                  <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10" />
                  <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15" />
               </svg>
            </span>
         {/if}

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
   @use '@material/theme' with (
      $primary: vantage.$primary,
      $secondary: vantage.$secondary
   );
   @use '@material/select';
   @use '@material/select/styles';

   .mdc-select {
      @include select.label-color(vantage.$secondary);
      @include select.filled-shape-radius(0);
      width: 100%;

      &.mdc-select--with-link {
         pointer-events: none;

         .mdc-text-field__icon {
            pointer-events: all;
         }

         .mdc-select__menu {
            opacity: 0;
         }
      }
   }

   @include vantage.scrollbar('.mdc-select__menu', vantage.$white);
</style>
