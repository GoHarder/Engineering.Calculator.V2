<script>
   import { onDestroy } from 'svelte';

   import { CounterweightLinks as Links } from '../links';

   // Components
   import { Fieldset, InputImg, RopesInput, SafetyInput, StockStatusOptions, ShoeInput } from 'components/common';
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, Input, InputNumber, InputLength } from 'components/material/input';
   import { Option, Select } from 'components/material/select';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {};

      const moduleData = {};

      project.globals = { ...project.globals, ...globalData };
      project.modules.sling = moduleData;
   };

   // Methods
   // Constants
   const { globals, modules, metric } = project;

   Links.setProject(modules);

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

<template>Counterweight</template>

<style>
</style>
