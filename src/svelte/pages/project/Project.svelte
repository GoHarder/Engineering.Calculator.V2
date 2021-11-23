<script>
   import { onDestroy, onMount } from 'svelte';

   import * as validate from 'lib/validate.mjs';
   import { chevron_left_svg, chevron_right_svg, engineering_svg, looks_1_svg, looks_2_svg, looks_3_svg } from 'img/icons';

   // Components
   import { A, Svg } from 'components/common';
   import { Button } from 'components/material/button';
   import { Tab, TabBar } from 'components/material/tab-bar';

   import Modules from './components/Modules.svelte';
   import Requirements from './components/Requirements.svelte';
   import Summary from './components/Summary.svelte';

   // Stores
   import projectStore from 'stores/project';

   // Properties
   // Methods
   const getCompIndex = (name) => comps.findIndex((comp) => comp.name === name);

   // Constants
   const comps = [Summary, Requirements, Modules];

   const summarySchema = {
      contract: (value) => validate.string(value),
      customer: (value) => validate.string(value),
      jobName: (value) => validate.string(value),
   };

   // Variables
   let comp = Summary;
   let project = {};

   // Subscriptions
   const clearProject = projectStore.subscribe((store) => {
      if (Object.keys(store).length !== 0) {
         project = store;
      }
   });

   // Contexts
   // Reactive Rules
   $: currentIndex = getCompIndex(comp.name);

   $: validSummary = validate.object(project, summarySchema).valid;

   // Events
   const onActivated = (event) => (comp = event.detail);

   const onBack = () => {
      history.back();
   };

   const onLocationChange = () => {
      const path = history.state.path.split('/').slice(1);
      const index = getCompIndex(path[1]);
      comp = comps[index];
   };

   const onSubmit = (event) => {
      event.preventDefault();

      const newComp = comps[currentIndex + 1];

      if (newComp) {
         history.pushState({ path: `/Project/${newComp.name}` }, '');
      } else {
         console.log('To workbook page');
      }
   };

   // Lifecycle
   onMount(() => {
      onLocationChange();
   });

   onDestroy(() => {
      clearProject();
   });
</script>

<svelte:window on:locationchange={onLocationChange} />

<header>
   <A href="/Home">Home</A>
   <div class="title">
      <Svg fileData={engineering_svg} />
      <h3>Project Configuration</h3>
   </div>
</header>

<div class="paper">
   <TabBar on:activated={onActivated} index={currentIndex} {comps}>
      <Tab active class="project-tab__button" stacked>
         <svelte:fragment slot="icon">
            <Svg fileData={looks_1_svg} />
         </svelte:fragment>
         Summary
      </Tab>
      <Tab class="project-tab__button" stacked disabled={!validSummary}>
         <svelte:fragment slot="icon">
            <Svg fileData={looks_2_svg} />
         </svelte:fragment>
         Requirements
      </Tab>
      <Tab class="project-tab__button" stacked disabled>
         <svelte:fragment slot="icon">
            <Svg fileData={looks_3_svg} />
         </svelte:fragment>
         Modules
      </Tab>
   </TabBar>
   <form id="project-form" on:submit={onSubmit}>
      <svelte:component this={comp} />
      <hr />
      <nav>
         <Button on:click={onBack} variant="contained" color="secondary" disabled={comp === Summary} type="button">
            <svelte:fragment slot="leadingIcon">
               <Svg fileData={chevron_left_svg} />
            </svelte:fragment>
            Back
         </Button>
         <Button variant="contained" type="submit" form="project-form">
            Next
            <svelte:fragment slot="trailingIcon">
               <Svg fileData={chevron_right_svg} />
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
         padding-top: 1em;
         min-height: calc(100vh - 345px);
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
