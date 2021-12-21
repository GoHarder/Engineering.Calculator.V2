<script>
   // Components
   import { OptGroup, Option } from 'components/material/select';

   // Stores
   // Properties
   export let options = [];

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: stockedOptions = options.filter((option) => option.stockStatus === 'Stocked');
   $: availableOptions = options.filter((option) => option.stockStatus === 'Available');
   $: checkOptions = options.filter((option) => option.stockStatus === 'Check');

   // Events
   // Lifecycle
</script>

{#if stockedOptions.length > 0}
   <OptGroup label="Stocked">
      {#each stockedOptions as { disabled, name } (name)}
         <Option {disabled}>{name}</Option>
      {/each}
   </OptGroup>
{/if}

{#if availableOptions.length > 0}
   <OptGroup label="Available">
      {#each availableOptions as { disabled, name } (name)}
         <Option {disabled}>{name}</Option>
      {/each}
   </OptGroup>
{/if}

{#if checkOptions.length > 0}
   <OptGroup label="Check">
      {#each checkOptions as { disabled, name } (name)}
         <Option {disabled}>{name}</Option>
      {/each}
   </OptGroup>
{/if}

<style>
</style>
