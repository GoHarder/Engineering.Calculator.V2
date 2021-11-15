<script>
   import { classList, filterProps } from '../../lib';

   import { arrow_drop_up_svg } from 'img/icons';

   // Components
   import { Svg } from 'components/common';

   // Stores
   // Properties
   export let scope = undefined;
   export let sort = undefined;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: cellClass = classList([$$props.class, 'mdc-data-table__cell', sort ? 'mdc-data-table__header-cell--with-sort' : '']);

   $: props = filterProps($$props, ['class', 'scope']);

   // Events
   // Lifecycle
</script>

{#if scope}
   <th on:click class={cellClass} {scope} {...props} data-column-id={sort}>
      {#if sort}
         <div class="mdc-data-table__header-cell-wrapper">
            <div class="mdc-data-table__header-cell-label"><slot /></div>
            <button class="mdc-icon-button material-icons mdc-data-table__sort-icon-button" aria-label="Sort by {sort}" aria-describedby="{sort}-table-label">
               <!-- arrow_drop_up -->
               <Svg fileData={arrow_drop_up_svg} />
            </button>
            <div class="mdc-data-table__sort-status-label" aria-hidden="true" id="{sort}-table-label" />
         </div>
      {:else}
         <slot />
      {/if}
   </th>
{:else}
   <td on:click class={cellClass} {...props}><slot /></td>
{/if}

<style>
</style>
