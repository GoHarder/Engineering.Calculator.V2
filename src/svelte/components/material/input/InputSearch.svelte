<script>
   import { createEventDispatcher } from 'svelte';
   import { filterProps } from '../../lib';

   // Components
   import Input from './Input.svelte';
   import Icon from '../common/Icon.svelte';

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
         <Icon on:click={onSubmit} role="button" tabindex="0" toolTip="Search">search</Icon>
      </svelte:fragment>
   </Input>
</form>

<style>
   form {
      flex-grow: 1;
   }
</style>
