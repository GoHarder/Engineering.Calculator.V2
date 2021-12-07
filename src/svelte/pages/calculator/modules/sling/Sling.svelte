<script>
   import { onDestroy } from 'svelte';

   // Components
   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      console.log('Update Sling Module');
   };

   $: project;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
   onDestroy(() => {
      updateModule();
   });
</script>

<template>Sling</template>

<style>
</style>
