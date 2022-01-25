<script>
   // Components
   import { Fieldset } from 'components/common';
   import { Option, Select } from 'components/material/select';

   import Standard from './components/Standard.svelte';

   // Stores
   // Properties
   export let project;
   export const updateModule = () => {
      const globalData = {};

      const moduleData = {};

      project.globals = { ...project.globals, ...globalData };
      project.modules.hoistway = moduleData;
   };

   // Methods
   // Constants
   // Variables
   let compName = 'Standard';

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
</script>

<div class="container">
   <Fieldset title="Properties">
      <Select bind:value={compName} label="Type">
         <Option value="Standard">Overhead Standard</Option>
         <Option value="Block Up" disabled>Overhead Block-Up</Option>
         <Option value="Back Roped" disabled>Overhead Back Roped</Option>
         <Option value="Basement" disabled>Basement / Hoistway</Option>
         <Option value="MRL Over" disabled>MRL Overslung</Option>
         <Option value="MRL Under" disabled>MRL Underslung</Option>
      </Select>
   </Fieldset>
</div>

<svelte:component this={Standard} {project} />

<style>
   .container {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      margin: 0.25em;
      gap: 0.25em;
   }
</style>
