<script>
   import { onDestroy } from 'svelte';
   import moduleLibrary from './modules/modules';

   import { clone } from 'lib/main.mjs';
   import { capitalize, toCamelCase } from 'lib/string.mjs';

   // Components
   import { A, ButtonNote, ShareDialog } from 'components/common';
   import { Icon, IconButton } from 'components/material/button';
   import { Content, Drawer, Item } from 'components/material/drawer';
   import { Snackbar } from 'components/material/snackbar';

   import NotesDialog from './components/NotesDialog.svelte';

   // Stores
   import pathStore from 'stores/path';
   import projectStore from 'stores/project';

   // Properties
   // Methods
   const parsePath = (path) => {
      updateModule = undefined;

      if (path.length > 1) {
         const name = toCamelCase(path[1]);
         comp = moduleLibrary[name]?.comp;
         title = moduleLibrary[name]?.title ?? title;
         selectedIndex = moduleItems[name]?.index;
      }
   };

   // Constants
   // Variables

   // - Project
   let carNo;
   let contract;
   let jobName;
   let project;
   let updateModule;

   // - UI
   let comp;
   let domTitle = 'Undefined Project';
   let moduleItems = clone(moduleLibrary);
   let notesDialog = false;
   let path = [];
   let selectedIndex = -1;
   let shareDialog = false;
   let showDrawer = true;
   let showSnackbar = false;
   let title = '';
   let maxIndex = 0;
   let tabTitle = 'HW Engineering Calculator';

   // Subscriptions
   const clearPath = pathStore.subscribe((store) => (path = store));

   const clearProject = projectStore.subscribe((store) => {
      carNo = store.carNo;
      contract = store.contract;
      jobName = store.jobName;
      project = store;

      let update = clone(moduleItems);

      Object.keys(update).forEach((key) => {
         update[key].show = false;
         update[key].checked = false;
      });

      Object.keys(project?.modules ?? {}).forEach((key, i) => {
         update[key].show = true;
         update[key].href = `/Calculator/${capitalize(key)}`;
         update[key].index = i;
         update[key].checked = i === 0;
         maxIndex = i;
      });

      moduleItems = update;
   });

   // Contexts
   // Reactive Rules
   $: if (contract && jobName && carNo) {
      domTitle = `${contract} - ${jobName} - ${carNo}`;
      tabTitle = domTitle;
   }

   $: parsePath(path);

   // Events
   const onNext = () => {
      const key = Object.keys(moduleItems)[selectedIndex + 1];
      history.pushState({ path: `/Calculator/${capitalize(key)}` }, '');
   };

   const onPrevious = () => {
      const key = Object.keys(moduleItems)[selectedIndex - 1];
      history.pushState({ path: `/Calculator/${capitalize(key)}` }, '');
   };

   const onSave = async () => {
      updateModule();

      const saved = await projectStore.save(project);

      if (saved) showSnackbar = true;
   };

   // Lifecycle
   onDestroy(() => {
      clearPath();
      clearProject();
   });
</script>

<svelte:head>
   <title>{tabTitle}</title>
</svelte:head>

{#if shareDialog}
   <ShareDialog bind:show={shareDialog} bind:project />
{/if}

{#if notesDialog}
   <NotesDialog bind:show={notesDialog} bind:project />
{/if}

<header>
   <div>
      <nav>
         <A href="/Home">Home</A>
         <span>&nbsp;&gt;&nbsp;</span>
         <A href="/Project/Summary">Configuration</A>
      </nav>

      <div class="title">
         <Icon class="material-icons">calculate</Icon>
         <h3>{domTitle}</h3>
      </div>
   </div>

   <div class="buttons">
      <IconButton on:click={() => (shareDialog = true)} toolTip="Share">
         <Icon>share</Icon>
      </IconButton>

      <ButtonNote text={project?.notes?.length ?? 0}>
         <IconButton on:click={() => (notesDialog = true)} toolTip="Notes">
            <Icon>edit_note</Icon>
         </IconButton>
      </ButtonNote>

      <IconButton toolTip="Download PDF">
         <Icon>download</Icon>
      </IconButton>

      <IconButton on:click={onSave} toolTip="Save">
         <Icon>save</Icon>
      </IconButton>
   </div>
</header>

<div class="drawer-wrapper">
   <Drawer bind:show={showDrawer} {selectedIndex}>
      <svelte:fragment slot="title">Modules</svelte:fragment>

      {#each Object.keys(moduleItems) as key (key)}
         {#if moduleItems[key].show}
            <Item href={moduleItems[key].href}>{moduleItems[key].title}</Item>
         {/if}
      {/each}
   </Drawer>

   <Content>
      <div class="top">
         <IconButton on:click={() => (showDrawer = !showDrawer)} toolTip="{showDrawer ? 'Hide' : 'Show'} Modules">
            <Icon>menu</Icon>
         </IconButton>

         <h4 class="mdc-drawer__title">{title}</h4>

         <IconButton on:click={onPrevious} disabled={selectedIndex < 1} toolTip="Previous">
            <Icon>chevron_left</Icon>
         </IconButton>

         <div class="vr" />

         <IconButton on:click={onNext} disabled={selectedIndex >= maxIndex} toolTip="Next">
            <Icon>chevron_right</Icon>
         </IconButton>
      </div>

      <div class="comp">
         {#if comp}
            <svelte:component this={comp} bind:project bind:updateModule />
         {/if}
      </div>
   </Content>
</div>

<Snackbar bind:show={showSnackbar}>Project Saved</Snackbar>

<style lang="scss">
   @use 'src/scss/theme' as vantage;
   header {
      display: flex;
      align-items: flex-end;
   }

   .buttons {
      margin: 0 0 0 auto;
   }
   nav {
      display: flex;
      align-items: center;
      justify-content: baseline;
   }
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

   .drawer-wrapper {
      position: relative;
      width: 100%;
      height: calc(100vh - 190px);
      @include vantage.border-top;
      @include vantage.paper;
   }

   span {
      font-size: 14px;
   }

   .top {
      height: 48px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
   }

   .comp {
      height: calc(100% - 48px);
      overflow-x: hidden;
      overflow-y: auto;

      background-color: vantage.$gray-90;
   }
   @include vantage.scrollbar('.comp', vantage.$gray-90);
   h4 {
      margin: 0 0.5em;
      margin-right: auto;
   }

   .vr {
      content: '';
      height: 100%;
      width: 1px;
      background-color: vantage.$gray-90;
   }
</style>
