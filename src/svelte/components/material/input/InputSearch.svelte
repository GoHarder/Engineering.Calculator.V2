<script>
   import { createEventDispatcher } from 'svelte';
   import { filterProps } from '../../lib';

   import { search_svg } from 'img/icons';

   // Components
   import Input from './Input.svelte';
   import { Svg } from 'components/common';
   // import { search, Svg } from '../svg';

   // Stores
   // Properties
   export let label = 'Search';
   export let value = undefined;

   // Methods
   // Constants
   const dispatch = createEventDispatcher();

   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules

   $: props = filterProps($$props, ['label', 'type', 'value']);

   // Events
   const onSubmit = (event) => {
      event?.preventDefault();
      dispatch('search');
   };

   const test = () => {
      if (!value) dispatch('clear');
   };

   // Lifecycle
</script>

<form on:submit={onSubmit}>
   <Input bind:value on:search={test} type="search" {label} {...props}>
      <svelte:fragment slot="leadingIcon">
         <Svg on:click={onSubmit} fileData={search_svg} role="button" tabindex="0" />
      </svelte:fragment>
   </Input>
</form>

<style>
   form {
      flex-grow: 1;
   }
</style>
