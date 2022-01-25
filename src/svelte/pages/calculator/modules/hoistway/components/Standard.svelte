<script>
   // Components
   import { Fieldset } from 'components/common';
   import { InputLength } from 'components/material/input';

   // Stores
   // Properties
   export let project;

   console.log(project);

   // Methods
   // Constants
   const { globals } = project;

   // need cwt height

   // Variables
   let carGap = 6;
   let cwtGap = 6;
   let cwtHeight = 114;
   let pitDepth = 64;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
</script>

<div class="layout">
   <Fieldset title="Car">
      <InputLength bind:value={pitDepth} label="Pit Depth" />
      <InputLength bind:value={carGap} label="Buffer Gap" />
   </Fieldset>

   <div class="img-paper">Image goes here</div>

   <Fieldset title="Counterweight">
      <InputLength bind:value={cwtHeight} label="Height" />
      <InputLength bind:value={cwtGap} label="Buffer Gap" />
   </Fieldset>
</div>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .layout {
      display: flex;
      margin: 0.25em;
      gap: 0.25em;
      padding: 0.75em;
   }

   .img-paper {
      @include vantage.paper;
   }
</style>
