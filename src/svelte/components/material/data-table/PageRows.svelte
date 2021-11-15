<script>
   import { onDestroy, onMount } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCSelect } from '@material/select';
   import { forwardEvents } from '../../lib';

   // Components
   // Stores
   // Properties
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
   // Events
   const onChange = (event) => {
      value = event.detail.value;
   };

   // Lifecycle
   onMount(() => {
      Select = new MDCSelect(divEle);
   });

   onDestroy(() => {
      Select.destroy();
   });
</script>

<div class="mdc-data-table__pagination-rows-per-page">
   <div class="mdc-data-table__pagination-rows-per-page-label">Rows per page</div>

   <div
      bind:this={divEle}
      use:events
      on:MDCSelect:change={onChange}
      class="mdc-select mdc-select--outlined mdc-select--no-label mdc-data-table__pagination-rows-per-page-select"
   >
      <div class="mdc-select__anchor" role="button" aria-haspopup="listbox" aria-labelledby="demo-pagination-select" tabindex="0">
         <span class="mdc-select__selected-text-container">
            <span id="demo-pagination-select" class="mdc-select__selected-text">10</span>
         </span>
         <span class="mdc-select__dropdown-icon">
            <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5">
               <polygon class="mdc-select__dropdown-icon-inactive" stroke="none" fill-rule="evenodd" points="7 10 12 15 17 10" />
               <polygon class="mdc-select__dropdown-icon-active" stroke="none" fill-rule="evenodd" points="7 15 12 10 17 15" />
            </svg>
         </span>
         <span class="mdc-notched-outline mdc-notched-outline--notched">
            <span class="mdc-notched-outline__leading" />
            <span class="mdc-notched-outline__trailing" />
         </span>
      </div>

      <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth" role="listbox">
         <ul class="mdc-list">
            <li
               class="mdc-select__option mdc-select__one-line-option mdc-list-item mdc-list-item--selected mdc-list-item--with-one-line"
               aria-selected="true"
               role="option"
               data-value="10"
            >
               <span class="mdc-list-item__ripple" />
               <span class="mdc-list-item__content">
                  <span class="mdc-list-item__primary-text">10</span>
               </span>
            </li>
            <li class="mdc-select__option mdc-select__one-line-option mdc-list-item mdc-list-item--with-one-line" role="option" data-value="25">
               <span class="mdc-list-item__ripple" />
               <span class="mdc-list-item__content">
                  <span class="mdc-list-item__primary-text">25</span>
               </span>
            </li>
            <li class="mdc-select__option mdc-select__one-line-option mdc-list-item mdc-list-item--with-one-line" role="option" data-value="100">
               <span class="mdc-list-item__ripple" />
               <span class="mdc-list-item__content">
                  <span class="mdc-list-item__primary-text">100</span>
               </span>
            </li>
         </ul>
      </div>
   </div>
</div>
