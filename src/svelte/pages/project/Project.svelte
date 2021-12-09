<script>
   import { onDestroy } from 'svelte';

   import * as validate from 'lib/validate.mjs';
   import { capitalize } from 'lib/string.mjs';

   // Components
   import { A } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { Tab, TabBar } from 'components/material/tab-bar';

   import Modules from './components/modules/Modules.svelte';
   import Requirements from './components/Requirements.svelte';
   import Summary from './components/Summary.svelte';

   // Stores
   import pathStore from 'stores/path';
   import projectStore from 'stores/project';

   // Properties
   // Methods
   const getCompIndex = (name) => comps.findIndex((comp) => comp.name === name);

   const parsePath = (path) => {
      const index = getCompIndex(path[1]);
      currentIndex = index;

      comp = comps[index];
   };

   // Constants
   const comps = [Summary, Requirements, Modules];

   const summarySchema = {
      contract: (value) => validate.string(value),
      customer: (value) => validate.string(value),
      jobName: (value) => validate.string(value),
   };

   const requirementsSchema = {
      capacity: (value) => value > 0,
      speed: (value) => value > 0,
      overallTravel: (value) => value > 0,
   };

   // Variables
   let comp = Summary;
   let path = [];
   let project = {};

   // Subscriptions
   const clearPath = pathStore.subscribe((store) => (path = store));

   const clearProject = projectStore.subscribe((store) => {
      if (Object.keys(store).length !== 0) {
         project = store;
      }
   });

   // Contexts
   // Reactive Rules
   $: currentIndex = getCompIndex(comp.name);

   $: validSummary = validate.object(project, summarySchema).valid;

   $: validRequirements = validate.object(project.globals, requirementsSchema).valid;

   $: parsePath(path);

   // Events
   const onActivated = (event) => (comp = event.detail);

   const onBack = () => {
      history.back();
   };

   const onKeyPress = (event) => {
      if (event.keyCode === 13) {
         event.preventDefault();
      }
   };

   const onSubmit = (event) => {
      event.preventDefault();

      const newComp = comps[currentIndex + 1];

      if (newComp) {
         history.pushState({ path: `/Project/${newComp.name}` }, '');
      } else {
         const moduleName = capitalize(Object.keys(project.modules)[0]);

         if (moduleName) {
            history.pushState({ path: `/Calculator/${moduleName}` }, '');
         }
      }
   };

   // Lifecycle
   onDestroy(() => {
      clearPath();
      clearProject();
   });
</script>

<header>
   <A href="/Home">Home</A>
   <div class="title">
      <Icon class="material-icons">engineering</Icon>
      <h3>Project Configuration</h3>
   </div>
</header>

<div class="paper">
   <TabBar on:activated={onActivated} index={currentIndex} {comps}>
      <Tab active class="project-tab__button" stacked>
         <svelte:fragment slot="icon">
            <Icon>looks_one</Icon>
         </svelte:fragment>
         Summary
      </Tab>
      <Tab class="project-tab__button" stacked disabled={!validSummary}>
         <svelte:fragment slot="icon">
            <Icon>looks_two</Icon>
         </svelte:fragment>
         Requirements
      </Tab>
      <Tab class="project-tab__button" stacked disabled={!validSummary || !validRequirements}>
         <svelte:fragment slot="icon">
            <Icon>looks_3</Icon>
         </svelte:fragment>
         Modules
      </Tab>
   </TabBar>
   <form id="project-form" on:submit={onSubmit} on:keypress={onKeyPress}>
      <svelte:component this={comp} />
      <hr />
      <nav>
         <Button on:click={onBack} variant="contained" color="secondary" disabled={comp === Summary} type="button">
            <svelte:fragment slot="leadingIcon">
               <Icon>chevron_left</Icon>
            </svelte:fragment>
            Back
         </Button>
         <Button variant="contained" type="submit" form="project-form">
            Next
            <svelte:fragment slot="trailingIcon">
               <Icon>chevron_right</Icon>
            </svelte:fragment>
         </Button>
      </nav>
   </form>
</div>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   .title {
      display: flex;
      align-items: center;
      margin: 0 0 0.5em;
   }

   h3 {
      font-weight: 600;
      font-size: 1.25rem;
      line-height: 1.6;
      margin: 0 0 0 0.5em;
   }

   :global {
      .project-tab__button {
         height: 85px;
         width: calc(100% / 3);
      }

      section.project-form {
         border-top: 1px solid rgba($color: #000000, $alpha: 0.12);
         min-height: calc(100vh - 330px);
      }
   }

   .paper {
      @include vantage.border-top;
      @include vantage.paper;
      padding: 0 1em 1em;
      display: flex;
      flex-direction: column;
   }

   hr {
      margin-top: auto;
   }

   nav {
      display: flex;
      justify-content: flex-end;
      gap: 0.5em;
   }
</style>
