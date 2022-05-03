<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { get_current_component } from 'svelte/internal';
   import { MDCList } from '@material/list';
   import { classList, filterProps, forwardEvents } from '../../lib';

   // Components
   // Stores
   // Properties
   export let dense = false;
   export let interactive = true;
   export let singleSelection = false;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();
   const events = forwardEvents(get_current_component(), ['MDCList:action']);

   // Variables
   let ulEle;
   let List;

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: props = filterProps($$props, ['class']);
   $: ulClass = classList(['mdc-deprecated-list', dense ? 'mdc-deprecated-list--dense' : '', $$props.class]);

   // Events
   const onAction = (event) => {
      const target = event.target.querySelector('.mdc-deprecated-list-item--selected');

      const detail = {
         index: event.detail.index,
         target,
      };

      dispatch('action', detail);
   };

   // Lifecycle
   onMount(() => {
      if (!interactive) {
         const items = ulEle.querySelectorAll('.mdc-deprecated-list-item');

         items.forEach((item) => {
            item.classList.add('mdc-deprecated-list-item--non-interactive');
         });
      }

      if (interactive) {
         List = new MDCList(ulEle);
         List.singleSelection = singleSelection;
      }
   });

   onDestroy(() => {
      if (List) List.destroy();
   });
</script>

<ul bind:this={ulEle} class={ulClass} use:events on:MDCList:action={onAction} {...props}>
   <slot />
</ul>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/theme' with (
      $primary: vantage.$secondary,
      $secondary: vantage.$primary
   );
   @use '@material/list';
   @include list.deprecated-core-styles;

   .mdc-list-item {
      align-items: center;
   }

   .mdc-deprecated-list-item.mdc-deprecated-list-item--non-interactive {
      cursor: auto;
      &:hover {
         .mdc-deprecated-list-item__ripple {
            display: none;
         }
      }
   }
</style>
