<script>
   import { onDestroy, onMount } from 'svelte';
   import { floor } from 'lib/math.mjs';

   import { clone } from 'lib/main.mjs';
   import { capitalize } from 'lib/string.mjs';

   // Components
   import { ShareDialog } from 'components/common';
   import { Button, Icon } from 'components/material/button';
   import { Cell, Nav, Row, Table } from 'components/material/data-table';
   import { Dialog } from 'components/material/dialog';
   import { InputSearch } from 'components/material/input';

   import ProjectRow from './components/ProjectRow.svelte';

   // Stores
   import fetchStore from 'stores/fetch';
   import projectStore from 'stores/project';
   import userStore from 'stores/user';

   // Properties
   // Methods
   const fetchRecent = async (page, length) => {
      fetchStore.loading(true);
      let res, body;

      const token = localStorage.getItem('token');

      try {
         res = await fetch(`api/projects/recent?page=${page}&length=${length}`, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);
         projects = [...body.docs];
         totalProjects = body.length;
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   const fetchSearch = async (page, length) => {
      fetchStore.loading(true);
      let res, body;

      const token = localStorage.getItem('token');

      try {
         res = await fetch(`api/projects/search?search=${search}&page=${page}&length=${length}`, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);
         projects = [...body.docs];
         totalProjects = body.length;
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   const fetchProject = async (id) => {
      fetchStore.loading(true);
      let res, body;

      const token = localStorage.getItem('token');

      try {
         res = await fetch(`api/projects/id/${id}`, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);
         project = { ...body };
         return true;
      } catch (error) {
         fetchStore.setError({ res, error });
         return false;
      }
   };

   // Constants
   // Variables
   let innerHeight = 0;
   let maxRows = 10;

   let deleteDialog;
   let shareDialog;
   let project = {};

   let search = '';
   let user;
   let page = 1;
   let totalProjects = 0;
   let projects = [];

   // Subscriptions
   const clearUser = userStore.subscribe((store) => (user = store));

   // Contexts
   // Reactive Rules
   $: if (page) onSearch();

   // Events

   const onCopy = async (event) => {
      const fetched = await fetchProject(event.detail);

      // Prep the update
      const update = clone(project);
      update.created = Date.now();
      update.creator = {
         firstName: user.firstName,
         lastName: user.lastName,
         _id: user._id,
      };
      update.jobName = `Copy of ${update.jobName}`;
      update.notes = [];
      update.opened = [{ _id: user._id, date: Date.now() }];
      update.checkout = user._id;

      delete update._id;

      const saved = await projectStore.save(update);

      if (saved) {
         history.pushState({ path: '/Project/Summary' }, '');
      }
   };

   const onNew = () => history.pushState({ path: '/Project/Summary' }, '');

   const onDelete1 = async (event) => {
      const fetched = await fetchProject(event.detail);
      if (fetched) deleteDialog = true;
   };

   const onDelete2 = async () => {
      const update = clone(project);

      // Check if user owns the project
      if (user._id === project.creator._id) {
         // If so delete
         projectStore.set(update);
         projectStore.destroy();
      } else {
         // If not just modify
         update.opened = update.opened.filter((person) => person._id !== user._id);

         await projectStore.save(update);

         await projectStore.clear();
      }

      onSearch();
      deleteDialog = false;
   };

   const onSearch = () => {
      if (search) {
         fetchSearch(page, maxRows);
      } else {
         fetchRecent(page, maxRows);
      }
   };

   const onSelect = async (event) => {
      const fetched = await fetchProject(event.detail);

      const opened = project.opened.filter((pastUser) => {
         pastUser._id !== user._id;
      });

      const newOpened = {
         _id: user._id,
         date: Date.now(),
      };

      opened.push(newOpened);

      project.opened = opened;

      // Get the next part of the path
      const moduleName = capitalize(Object.keys(project.modules)[0]);

      projectStore.set(project);
      history.pushState({ path: `/Calculator/${moduleName}` }, '');
   };

   const onShare = async (event) => {
      const fetched = await fetchProject(event.detail);
      if (fetched) shareDialog = true;
   };

   const onSort = (event) => {
      projects = [...projects].sort((a, b) => {
         let direction = 0;
         const valueA = a[event.detail.columnId];
         const valueB = b[event.detail.columnId];

         if (valueA < valueB) direction = -1;

         if (valueA > valueB) direction = 1;

         direction = (event.detail.sortValue === 'ascending' ? 1 : -1) * direction;

         return direction;
      });
   };

   // Lifecycle
   onMount(() => {
      maxRows = floor((innerHeight - 390) / 52) - 1;
      projectStore.clear();
   });

   onDestroy(() => {
      clearUser();
   });
</script>

<svelte:window bind:innerHeight />

<svelte:head>
   <title>HW Engineering Calculator</title>
</svelte:head>

<Dialog bind:show={deleteDialog}>
   Delete Project?

   <svelte:fragment slot="actions">
      <Button on:click={() => (deleteDialog = false)} variant="outlined" color="secondary">Cancel</Button>
      <Button on:click={onDelete2} variant="outlined" color="secondary">Ok</Button>
   </svelte:fragment>
</Dialog>

{#if shareDialog}
   <ShareDialog bind:show={shareDialog} clear {project} />
{/if}

<div class="title-container">
   <h2>
      Welcome to the
      <strong>Hollister-Whitney Engineering Calculator</strong>
   </h2>

   <p>
      Select an existing
      <strong>Project</strong>
      from the list below or click the
      <strong>Create New Project</strong>
      button
   </p>

   <p>
      To find an existing
      <strong>Project</strong>
      use the
      <strong>Search Bar</strong>
      below to find your specific project
   </p>
</div>

<div class="search-container">
   <InputSearch on:search={onSearch} bind:value={search} fullWidth />

   <Button on:click={onNew} variant="contained" style="height: 56px; margin: 0; padding: 0 16px">
      Create New Project
      <svelte:fragment slot="trailingIcon">
         <Icon>add</Icon>
      </svelte:fragment>
   </Button>
</div>

<Table on:sort={onSort} class="home-data-table" sticky>
   <svelte:fragment slot="head">
      <Row>
         <Cell scope="col" role="columnheader" class="project-row-cell contract" sort="contract">Contract #</Cell>
         <Cell scope="col" role="columnheader" class="project-row-cell job-name" sort="jobName">Job Name</Cell>
         <Cell scope="col" role="columnheader" class="project-row-cell car" sort="carNo">Car #</Cell>
         <Cell scope="col" role="columnheader" class="project-row-cell customer" sort="customer">Customer</Cell>
         <Cell scope="col" role="columnheader" class="project-row-cell layout" sort="layout">Layout #</Cell>
         <Cell scope="col" role="columnheader" class="project-row-cell date">Created</Cell>
         <Cell scope="col" role="columnheader" class="project-row-cell date">Last Opened</Cell>
         <Cell scope="col" role="columnheader" class="project-row-cell chip">Owned By</Cell>
         <Cell scope="col" role="columnheader" class="project-row-cell menu" />
      </Row>
   </svelte:fragment>

   {#await projects}
      <Row>
         <Cell colspan="9">Loading...</Cell>
      </Row>
   {:then projects}
      {#if projects.length !== 0}
         {#each projects as project (project._id)}
            <ProjectRow userId={user._id} {project} on:delete={onDelete1} on:select={onSelect} on:copy={onCopy} on:share={onShare} />
         {/each}
      {:else}
         <Row>
            <Cell colspan="9">Nothing Available...</Cell>
         </Row>
      {/if}
   {:catch error}
      <Cell row colspan="9">
         <span style="color: #b00020;">{error}</span>
      </Cell>
   {/await}

   <svelte:fragment slot="pagination">
      <Nav bind:page length={projects.length} total={totalProjects} {maxRows} />
   </svelte:fragment>
</Table>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   :global {
      .home-data-table.mdc-data-table {
         @include vantage.border-top;
         @include vantage.paper;

         .mdc-data-table__table {
            width: 100%;
         }
      }

      .project-row {
         cursor: pointer;
      }

      .project-row-cell {
         white-space: nowrap;
         text-overflow: ellipsis;
         overflow: hidden;

         &.contract {
            width: 135px;
         }

         &.car {
            width: 100px;
         }

         &.layout {
            display: none;
            width: 125px;
         }

         &.date {
            display: none;
            width: 120px;
         }

         &.chip {
            width: 105px;
         }

         &.menu {
            width: 52px;
            padding: 0;
         }
      }

      @media (min-width: 1024px) {
         .project-row-cell {
            &.layout {
               display: table-cell;
            }
         }
      }

      @media (min-width: 1200px) {
         .project-row-cell {
            &.date {
               display: table-cell;
            }
         }
      }
   }
   .title-container {
      color: vantage.$gray-20;
      font-weight: 500;
      text-align: center;
   }

   h2 {
      font: {
         size: 24px;
         weight: inherit;
      }
      line-height: 1.6;
      margin: 0;
   }

   p {
      font: {
         size: 16px;
         weight: inherit;
      }
      line-height: 1.5;
   }

   .search-container {
      @include vantage.paper;
      padding: 0.5em;
      display: flex;
      align-items: center;
      gap: 0.5em;
      min-width: 730px;
      max-width: 800px;
      margin: 0 auto 0.5em;
   }
</style>
