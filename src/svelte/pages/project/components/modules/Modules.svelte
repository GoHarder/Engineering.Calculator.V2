<script context="module">
   let run;

   export const getModules = () => {
      run();
   };
</script>

<script>
   import { onMount } from 'svelte';
   import moduleLibrary from '../../../calculator/modules/modules';

   import { clone } from 'lib/main.mjs';

   // Components
   import { Icon, IconButton } from 'components/material/button';
   import { InputSearch } from 'components/material/input';

   import ModuleCard from './components/ModuleCard.svelte';

   // Stores
   import projectStore from 'stores/project';

   // Properties
   const getModules = () => {
      Object.keys(moduleCards).forEach((key) => {
         if (moduleCards[key].checked) {
            modules[key] = { ...modules[key], ...{} };
         } else {
            delete modules[key];
         }
      });

      projectStore.save({ modules });
      clearProject();
   };

   // Methods
   // Constants
   // Variables
   let search = '';
   let modules;
   let moduleCards = clone(moduleLibrary);

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      modules = store.modules;

      // Update what is selected if existing file
      if (Object.keys(modules).length > 0) {
         let update = clone(moduleCards);

         Object.keys(update).forEach((key) => {
            update[key].checked = false;
         });

         Object.keys(modules).forEach((key) => {
            if (update[key]) update[key].checked = true;
         });

         moduleCards = update;
      }
   });

   // Contexts
   // Reactive Rules
   // Events
   const onSearch = () => {
      let update = clone(moduleCards);

      Object.keys(update).forEach((key) => {
         update[key].show = true;

         if (search) {
            const title = update[key].title.toLowerCase();
            update[key].show = title.indexOf(search.toLowerCase()) > -1;
         }
      });

      moduleCards = update;
   };

   const onSelectAll = () => {
      let update = clone(moduleCards);

      Object.keys(update).forEach((key) => {
         update[key].checked = true;
      });

      moduleCards = update;
   };

   const onSelectNone = () => {
      let update = clone(moduleCards);

      Object.keys(update).forEach((key) => {
         update[key].checked = false;
      });

      moduleCards = update;
   };

   // Lifecycle
   onMount(() => {
      run = getModules;
   });
</script>

<section class="project-form">
   <div class="search-container">
      <div class="search">
         <InputSearch on:search={onSearch} bind:value={search} fullWidth />
      </div>

      <div class="btn-1">
         <IconButton on:click={onSelectNone} toolTip="Select None" type="button">
            <Icon class="material-icons mdc-icon-button__icon">remove_done</Icon>
         </IconButton>
      </div>

      <div class="btn-2">
         <IconButton on:click={onSelectAll} toolTip="Select All" type="button">
            <Icon class="material-icons mdc-icon-button__icon">done_all</Icon>
         </IconButton>
      </div>
   </div>

   <hr />

   <div class="card-container">
      {#each Object.keys(moduleCards) as key (key)}
         {#if moduleCards[key].show}
            <ModuleCard bind:checked={moduleCards[key].checked} description={moduleCards[key].description} img={moduleCards[key].img} title={moduleCards[key].title} />
         {/if}
      {/each}
   </div>
</section>

<style>
   .card-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, 300px);
      justify-content: center;
      gap: 0.5em;
      margin-bottom: 0.5em;
   }

   .search-container {
      display: grid;
      grid-template-columns: 1fr 400px 48px 48px 1fr;
      grid-template-areas: '. search btn-1 btn-2 .';
      margin-top: 8px;
   }

   .search {
      grid-area: search;
      margin-right: 2em;
   }

   .btn-1 {
      grid-area: btn-1;
   }

   .btn-2 {
      grid-area: btn-2;
   }
</style>
