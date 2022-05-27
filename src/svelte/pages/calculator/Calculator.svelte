<script>
   import { onDestroy, onMount } from 'svelte';
   import moduleLibrary from './modules/modules';

   import { clone } from 'lib/main.mjs';
   import { capitalize, toCamelCase } from 'lib/string.mjs';

   // Components
   import { A, Badge, ShareDialog } from 'components/common';
   import { Fab, Icon, IconButton } from 'components/material/button';
   import { Content, Drawer, Item } from 'components/material/drawer';
   import { CircularProgress } from 'components/material/progress';
   import { Snackbar } from 'components/material/snackbar';

   import NotesDialog from './components/NotesDialog.svelte';

   // Stores
   import initStore from 'stores/init';
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
   let installPrompt;
   let saving = false;
   let syncInterval;

   // - UI
   let comp;
   let compEle;
   let domTitle = 'Undefined Project';
   let moduleItems = clone(moduleLibrary);
   let notesDialog = false;
   let path = [];
   let scrollTop = 0;
   let selectedIndex = -1;
   let shareDialog = false;
   let showDrawer = true;
   let showSnackbar = false;
   let title = '';
   let maxIndex = 0;
   let tabTitle = 'HW Engineering Calculator';

   // Subscriptions
   const clearInit = initStore.subscribe((store) => (installPrompt = store.installPrompt));

   const clearPath = pathStore.subscribe((store) => (path = store));

   const clearProject = projectStore.subscribe((store) => {
      carNo = store.carNo;
      contract = store.contract;
      jobName = store.jobName;
      project = store;

      let update = clone(moduleItems);

      let i = 0;
      let modules = project?.modules ?? {};

      Object.keys(update).forEach((key) => {
         update[key].show = false;

         if (modules[key]) {
            update[key].show = true;
            update[key].href = `/Calculator/${capitalize(key)}`;
            update[key].index = i;
            maxIndex = i;
            i++;
         }
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
   const onInstall = async () => {
      installPrompt.prompt();
      const userChoice = await installPrompt.userChoice;

      if (userChoice.outcome) {
         initStore.update((store) => {
            store = { ...store, installPrompt: undefined };
            return store;
         });
      }
   };

   const onKeydown = (event) => {
      if (event.ctrlKey && event.key === 'p') {
         event.preventDefault();
         console.log("Download doesn't exist");
      }

      if (event.ctrlKey && event.key === 's') {
         event.preventDefault();
         onSave();
      }

      if (event.ctrlKey && event.key === 'o') {
         event.preventDefault();
         history.pushState({ path: '/Home' }, '');
      }

      if (event.ctrlKey && event.key === 'ArrowRight') {
         onNext();
      }

      if (event.ctrlKey && event.key === 'ArrowLeft') {
         onPrevious();
      }

      if (event.ctrlKey && event.key === 'b') {
         showDrawer = !showDrawer;
      }
   };

   const onNext = () => {
      updateModule();

      Object.keys(moduleItems).forEach((key) => {
         const index = moduleItems[key]?.index ?? -1;
         if (index === selectedIndex + 1) history.pushState({ path: `/Calculator/${capitalize(key)}` }, '');
      });
   };

   const onPrevious = () => {
      updateModule();

      Object.keys(moduleItems).forEach((key) => {
         const index = moduleItems[key]?.index ?? -1;
         if (index === selectedIndex + -1) history.pushState({ path: `/Calculator/${capitalize(key)}` }, '');
      });
   };

   const onSave = async () => {
      saving = true;
      updateModule();

      const saved = await projectStore.save(project);

      if (saved) showSnackbar = true;

      setTimeout(() => (saving = false), 5000);
   };

   const onScroll = (event) => (scrollTop = event.target.scrollTop);

   const onToTop = () => {
      compEle.scrollTop = 0;
   };

   onMount(() => {
      syncInterval = setInterval(() => {
         saving = true;
         projectStore.sync(project);
         setTimeout(() => (saving = false), 5000);
      }, 15 * 60 * 1000);
   });

   // Lifecycle
   onDestroy(() => {
      clearInit();
      clearPath();
      clearProject();
      clearInterval(syncInterval);
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

{#if scrollTop > 300}
   <div class="fab">
      <Fab on:click={onToTop} mini toolTip="To Top">
         <Icon class="material-icons">arrow_upward</Icon>
      </Fab>
   </div>
{/if}

<svelte:window on:keydown={onKeydown} />

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
      {#if installPrompt !== undefined}
         <IconButton on:click={onInstall} toolTip="Install on Desktop">
            <Icon>install_desktop</Icon>
         </IconButton>
      {/if}

      <IconButton on:click={() => (shareDialog = true)} toolTip="Share">
         <Icon>share</Icon>
      </IconButton>

      <Badge text={project?.notes?.length ?? 0}>
         <IconButton on:click={() => (notesDialog = true)} toolTip="Notes">
            <Icon>edit_note</Icon>
         </IconButton>
      </Badge>

      <IconButton toolTip="Download PDF">
         <Icon>download</Icon>
      </IconButton>

      <IconButton on:click={onSave} disabled={saving} toolTip="Save">
         {#if saving}
            <CircularProgress show size="small" indeterminate />
         {:else}
            <Icon class="material-icons">save</Icon>
         {/if}
      </IconButton>
   </div>
</header>

<div class="drawer-wrapper">
   <Drawer bind:show={showDrawer} {selectedIndex}>
      <svelte:fragment slot="title">Modules</svelte:fragment>

      {#each Object.keys(moduleItems) as key (key)}
         {#if moduleItems[key].show}
            <Item href={moduleItems[key].href} update={updateModule}>{moduleItems[key].title}</Item>
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

      <div bind:this={compEle} on:scroll={onScroll} class="comp">
         {#if comp}
            <svelte:component this={comp} bind:project bind:updateModule />
         {/if}
      </div>
   </Content>
</div>

<Snackbar bind:show={showSnackbar}>
   <div class="snack-text">
      <span>Project Saved</span>
      <i class="material-icons">done</i>
   </div>
</Snackbar>

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
      scroll-behavior: smooth;

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

   .snack-text {
      position: relative;

      span {
         line-height: 24px;
         display: inline-block;
      }
      i {
         position: absolute;
         right: 0;
      }
   }

   .fab {
      position: absolute;
      bottom: -28px;
      right: 8px;
      z-index: 2;
   }
</style>
