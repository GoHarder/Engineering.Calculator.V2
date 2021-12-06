<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCDataTable } from '@material/data-table';
   import { classList, filterProps, forwardEvents } from '../../lib';

   // Components
   // Stores
   // Properties
   export let sticky = undefined;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();
   const events = forwardEvents(get_current_component(), ['MDCDataTable:sorted']);

   // Variables
   let divEle;
   let headEle;
   let bodyEle;
   let DataTable;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: props = filterProps($$props, ['class']);
   $: divClass = classList([$$props.class, 'mdc-data-table', sticky ? 'mdc-data-table--sticky-header' : '']);

   // Events
   const onSort = (event) => dispatch('sort', event.detail);

   // Lifecycle
   onMount(() => {
      if ($$slots.head) {
         const headRow = headEle.querySelector('tr');
         const headCells = headEle.querySelectorAll('th');
         headRow.classList.remove('mdc-data-table__row');
         headRow.classList.add('mdc-data-table__header-row');

         headCells.forEach((cell) => {
            cell.classList.remove('mdc-data-table__cell');
            cell.classList.add('mdc-data-table__header-cell');
         });

         DataTable = new MDCDataTable(divEle);
      }
   });

   onDestroy(() => {
      if (DataTable) DataTable.destroy();
   });
</script>

<div bind:this={divEle} use:events on:MDCDataTable:sorted={onSort} class={divClass} {...props}>
   <div class="mdc-data-table__table-container">
      <table class="mdc-data-table__table">
         {#if $$slots.head}
            <thead bind:this={headEle}>
               <slot name="head" />
            </thead>
         {/if}

         <tbody bind:this={bodyEle} class="mdc-data-table__content">
            <slot />
         </tbody>
      </table>
   </div>

   {#if $$slots.pagination}
      <div class="mdc-data-table__pagination">
         <div class="mdc-data-table__pagination-trailing">
            <slot name="pagination" />
         </div>
      </div>
   {/if}
</div>

<!-- With Row Selection -->
<!-- <div class="mdc-data-table">
   <div class="mdc-data-table__table-container">
      <table class="mdc-data-table__table" aria-label="Dessert calories">
         <thead>
            <tr class="mdc-data-table__header-row">
               <th class="mdc-data-table__header-cell mdc-data-table__header-cell--checkbox" role="columnheader" scope="col">
                  <div class="mdc-checkbox mdc-data-table__header-row-checkbox mdc-checkbox--selected">
                     <input type="checkbox" class="mdc-checkbox__native-control" aria-label="Toggle all rows" />
                     <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                           <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark" />
                     </div>
                     <div class="mdc-checkbox__ripple" />
                  </div>
               </th>
               <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Signal name</th>
               <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Status</th>
               <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Severity</th>
               <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Stage</th>
               <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Time</th>
               <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Roles</th>
            </tr>
         </thead>
         <tbody class="mdc-data-table__content">
            <tr data-row-id="u0" class="mdc-data-table__row">
               <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                  <div class="mdc-checkbox mdc-data-table__row-checkbox">
                     <input type="checkbox" class="mdc-checkbox__native-control" aria-labelledby="u0" />
                     <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                           <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark" />
                     </div>
                     <div class="mdc-checkbox__ripple" />
                  </div>
               </td>
               <th class="mdc-data-table__cell" scope="row" id="u0">Arcus watch slowdown</th>
               <td class="mdc-data-table__cell">Online</td>
               <td class="mdc-data-table__cell">Medium</td>
               <td class="mdc-data-table__cell">Triaged</td>
               <td class="mdc-data-table__cell mdc-data-table__cell--numeric">0:33</td>
               <td class="mdc-data-table__cell">Allison Brie</td>
            </tr>
            <tr data-row-id="u1" class="mdc-data-table__row mdc-data-table__row--selected" aria-selected="true">
               <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                  <div class="mdc-checkbox mdc-data-table__row-checkbox mdc-checkbox--selected">
                     <input type="checkbox" class="mdc-checkbox__native-control" checked aria-labelledby="u1" />
                     <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                           <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark" />
                     </div>
                     <div class="mdc-checkbox__ripple" />
                  </div>
               </td>
               <th class="mdc-data-table__cell" scope="row" id="u1">monarch: prod shared ares-managed-features-provider-heavy</th>
               <td class="mdc-data-table__cell">Offline</td>
               <td class="mdc-data-table__cell">Huge</td>
               <td class="mdc-data-table__cell">Triaged</td>
               <td class="mdc-data-table__cell mdc-data-table__cell--numeric">0:33</td>
               <td class="mdc-data-table__cell">Brie Larson</td>
            </tr>
            <tr data-row-id="u2" class="mdc-data-table__row mdc-data-table__row--selected" aria-selected="true">
               <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                  <div class="mdc-checkbox mdc-data-table__row-checkbox mdc-checkbox--selected">
                     <input type="checkbox" class="mdc-checkbox__native-control" checked aria-labelledby="u2" />
                     <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                           <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark" />
                     </div>
                     <div class="mdc-checkbox__ripple" />
                  </div>
               </td>
               <th class="mdc-data-table__cell" scope="row" id="u2">monarch: prod shared ares-managed-features-provider-heavy</th>
               <td class="mdc-data-table__cell">Online</td>
               <td class="mdc-data-table__cell">Minor</td>
               <td class="mdc-data-table__cell">Not triaged</td>
               <td class="mdc-data-table__cell mdc-data-table__cell--numeric">0:33</td>
               <td class="mdc-data-table__cell">Jeremy Lake</td>
            </tr>
            <tr data-row-id="u3" class="mdc-data-table__row">
               <td class="mdc-data-table__cell mdc-data-table__cell--checkbox">
                  <div class="mdc-checkbox mdc-data-table__row-checkbox">
                     <input type="checkbox" class="mdc-checkbox__native-control" aria-labelledby="u3" />
                     <div class="mdc-checkbox__background">
                        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                           <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                        </svg>
                        <div class="mdc-checkbox__mixedmark" />
                     </div>
                     <div class="mdc-checkbox__ripple" />
                  </div>
               </td>
               <th class="mdc-data-table__cell" scope="row" id="u3">Arcus watch slowdown</th>
               <td class="mdc-data-table__cell">Online</td>
               <td class="mdc-data-table__cell">Negligible</td>
               <td class="mdc-data-table__cell">Triaged</td>
               <td class="mdc-data-table__cell mdc-data-table__cell--numeric">0:33</td>
               <td class="mdc-data-table__cell">Angelina Cheng</td>
            </tr>
         </tbody>
      </table>
   </div>
</div> -->

<!-- With progress indicator -->

<!-- <div class="mdc-data-table">
   <div class="mdc-data-table__table-container">
      <table class="mdc-data-table__table" aria-label="Dessert calories">
         <thead>
            <tr class="mdc-data-table__header-row">
               <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Dessert</th>
               <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Carbs (g)</th>
               <th class="mdc-data-table__header-cell mdc-data-table__header-cell--numeric" role="columnheader" scope="col">Protein (g)</th>
               <th class="mdc-data-table__header-cell" role="columnheader" scope="col">Comments</th>
            </tr>
         </thead>
         <tbody class="mdc-data-table__content">
            <tr class="mdc-data-table__row">
               <th class="mdc-data-table__cell" scope="row">Frozen yogurt</th>
               <td class="mdc-data-table__cell mdc-data-table__cell--numeric">24</td>
               <td class="mdc-data-table__cell mdc-data-table__cell--numeric">4.0</td>
               <td class="mdc-data-table__cell">Super tasty</td>
            </tr>
            <tr class="mdc-data-table__row">
               <th class="mdc-data-table__cell" scope="row">Ice cream sandwich</th>
               <td class="mdc-data-table__cell mdc-data-table__cell--numeric">37</td>
               <td class="mdc-data-table__cell mdc-data-table__cell--numeric">4.33333333333</td>
               <td class="mdc-data-table__cell">I like ice cream more</td>
            </tr>
            <tr class="mdc-data-table__row">
               <th class="mdc-data-table__cell" scope="row">Eclair</th>
               <td class="mdc-data-table__cell mdc-data-table__cell--numeric">24</td>
               <td class="mdc-data-table__cell mdc-data-table__cell--numeric">6.0</td>
               <td class="mdc-data-table__cell">New filing flavor</td>
            </tr>
         </tbody>
      </table>
   </div>

   <div class="mdc-data-table__progress-indicator">
      <div class="mdc-data-table__scrim" />
      <div class="mdc-linear-progress mdc-linear-progress--indeterminate mdc-data-table__linear-progress" role="progressbar" aria-label="Data is being loaded...">
         <div class="mdc-linear-progress__buffer">
            <div class="mdc-linear-progress__buffer-bar" />
            <div class="mdc-linear-progress__buffer-dots" />
         </div>
         <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
            <span class="mdc-linear-progress__bar-inner" />
         </div>
         <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
            <span class="mdc-linear-progress__bar-inner" />
         </div>
      </div>
   </div>
</div> -->
<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/data-table/data-table';
   @use '@material/data-table/data-table-theme';
   @include data-table.core-styles;
   @include data-table.theme-baseline;

   .mdc-data-table {
      @include data-table-theme.header-row-fill-color(vantage.$gray-95);

      &.mdc-data-table--sticky-header {
         .mdc-data-table__table-container {
            overflow: unset;
         }
      }

      .mdc-data-table__header-cell {
         font-weight: bold;
      }
   }

   .mdc-data-table__sort-icon-button {
      border: none;
   }
</style>
