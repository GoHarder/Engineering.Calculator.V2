<script>
   import { onDestroy } from 'svelte';

   // Components
   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {};

      const moduleData = {};

      project.globals = { ...project.globals, ...globalData };
      project.modules.overheadSteel = moduleData;
   };

   // Methods
   // Constants
   const { metric, modules } = project;
   const { overheadSteel: module } = modules;

   console.log(project);

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

<template>Overhead Steel</template>

<style>
</style>
