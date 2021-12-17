<script>
   import { onMount } from 'svelte';

   // Components
   // Stores
   // Properties
   export let capacity = 0;
   export let speed = 0;

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
   onMount(() => {
      // Get shoe data
      console.log(capacity, speed);
   });
</script>

<template>Shoe Input</template>

<style>
</style>
