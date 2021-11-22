<script>
   import { chevron_left_svg, chevron_right_svg, first_page_svg, last_page_svg } from 'img/icons';

   // Components
   import { IconButton } from '../button';
   import { Svg } from 'components/common';

   // Stores
   // Properties
   export let page = 0;
   export let length = 0;
   export let total = 0;
   export let maxRows = 0;

   // Methods
   // Constants
   // Variables
   let units = '';
   let numString = '';

   // Subscriptions
   // Contexts
   // Reactive Rules
   $: maxRange = (page - 1) * maxRows + length;

   $: minRange = 1 + maxRange - length;

   $: fullNumString = `${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

   $: tooBig = total <= Number('1e+15') - 1;

   $: if (tooBig) {
      numString = fullNumString.replace(/,\d{3}/g, '');
   } else {
      numString = 'Infinity';
   }

   $: switch (fullNumString.match(/,\d{3}/g, '')?.length) {
      case 1:
         units = tooBig ? 'k' : '';
         break;
      case 2:
         units = tooBig ? 'M' : '';
         break;
      case 3:
         units = tooBig ? 'B' : '';
         break;
      case 4:
         units = tooBig ? 'T' : '';
         break;
   }

   // Events
   const onFirst = () => (page = 1);

   const onPrev = () => page--;

   const onNext = () => page++;

   const onLast = () => (page = Math.ceil(total / length));

   // Lifecycle
</script>

<div class="mdc-data-table__pagination-navigation">
   <div class="mdc-data-table__pagination-total">{minRange}‑{maxRange} of {numString}{units}</div>

   <IconButton on:click={onFirst} disabled={page === 1} class="mdc-data-table__pagination-button">
      <Svg fileData={first_page_svg} />
   </IconButton>

   <IconButton on:click={onPrev} disabled={page === 1} class="mdc-data-table__pagination-button">
      <Svg fileData={chevron_left_svg} />
   </IconButton>

   <IconButton on:click={onNext} disabled={maxRange === total} class="mdc-data-table__pagination-button">
      <Svg fileData={chevron_right_svg} />
   </IconButton>

   <IconButton on:click={onLast} disabled={maxRange === total} class="mdc-data-table__pagination-button">
      <Svg fileData={last_page_svg} />
   </IconButton>
</div>
