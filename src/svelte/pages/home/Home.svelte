<script>
   import { onDestroy, onMount } from 'svelte';
   import { floor } from 'lib/math.mjs';

   import { clone } from 'lib/main.mjs';
   import { add_svg } from 'img/icons';

   // Components
   import { Svg } from 'components/common';
   import { Button } from 'components/material/button';
   import { Cell, Nav, Row, Table } from 'components/material/data-table';
   import { Dialog, Title } from 'components/material/dialog';
   import { HelperText, Input, InputSearch } from 'components/material/input';
   import { Snackbar } from 'components/material/snackbar';

   import WorkbookRow from './components/WorkbookRow.svelte';

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
         workbooks = [...body.docs];
         totalWorkbooks = body.length;
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
         workbooks = [...body.docs];
         totalWorkbooks = body.length;
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   const fetchWorkbook = async (id) => {
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
         workbook = { ...body };
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
   let users = [];
   let email;
   let workbook = {};
   let showSnackbar = false;

   let search = '';
   let user;
   let page = 1;
   let totalWorkbooks = 0;
   let workbooks = [];

   // Subscriptions
   const clearUser = userStore.subscribe((store) => (user = store));

   // Contexts
   // Reactive Rules
   $: if (page) onSearch();

   // Events
   const onClear = () => fetchRecent(page, maxRows);

   const onCopy = async (event) => {
      const fetched = await fetchWorkbook(event.detail);

      // Prep the update
      const update = clone(workbook);
      update.created = Date.now();
      update.creator = {
         firstName: user.firstName,
         lastName: user.lastName,
         _id: user._id,
      };
      update.jobName = `Copy of ${update.jobName}`;
      update.notes = [];
      update.opened = [{ userId: user._id, time: Date.now() }];
      update.checkout = user._id;

      delete update._id;

      const saved = await projectStore.save(update);

      console.log('Go to workbook');

      console.log(update);

      projectStore.clear();
   };

   const onNew = (event) => {
      console.log(event);
   };

   const onDelete1 = async (event) => {
      const fetched = await fetchWorkbook(event.detail);
      if (fetched) deleteDialog = true;
   };

   const onDelete2 = async () => {
      const update = clone(workbook);

      // Check if user owns the project
      if (user._id === workbook.creator._id) {
         // If so delete
         projectStore.set(update);
         projectStore.destroy();
      } else {
         // If not just modify
         update.opened = update.opened.filter((person) => person.userId !== user._id);

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

   const onSelect = (event) => {
      console.log(event);
   };

   const onShare1 = async (event) => {
      const fetched = await fetchWorkbook(event.detail);

      fetchStore.loading(true);
      let res, body;

      const token = localStorage.getItem('token');

      try {
         res = await fetch(`api/users/all`, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         fetchStore.loading(false);
         users = [...body];
      } catch (error) {
         fetchStore.setError({ res, error });
      }

      if (fetched) shareDialog = true;
   };

   const onShare2 = async () => {
      const user = users.find((nth) => nth.email === email);

      // Create the payload
      const update = clone(workbook);

      update.opened = update.opened.filter((person) => person.userId !== user._id);

      update.opened = [...update.opened, { userId: user._id, time: Date.now() }];

      await projectStore.share(update, user.email);

      await projectStore.clear();

      shareDialog = false;
      showSnackbar = true;
   };

   const onSort = (event) => {
      workbooks = [...workbooks].sort((a, b) => {
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

<Dialog bind:show={deleteDialog}>
   Delete Workbook?

   <svelte:fragment slot="actions">
      <Button on:click={() => (deleteDialog = false)} variant="outlined" color="secondary">Cancel</Button>
      <Button on:click={onDelete2} variant="outlined" color="secondary">Ok</Button>
   </svelte:fragment>
</Dialog>

<Dialog bind:show={shareDialog}>
   <svelte:fragment slot="title">
      <Title>Share Workbook</Title>
   </svelte:fragment>

   <span style="display:inline-block; margin-bottom: 0.5em;"> Enter the email of the user you want to share the workbook with </span>

   <form id="share-form" on:submit={(event) => event.preventDefault()}>
      <Input bind:value={email} label="Email" required type="email" list="user-list" fullWidth>
         <svelte:fragment slot="helperText">
            <HelperText validation>Invalid Email</HelperText>
         </svelte:fragment>
      </Input>

      <datalist id="user-list">
         {#each users as { _id, email, firstName, lastName } (_id)}
            <option value={email}>{firstName} {lastName}</option>
         {/each}
      </datalist>
   </form>

   <svelte:fragment slot="actions">
      <Button on:click={() => (shareDialog = false)} variant="outlined" color="secondary">Cancel</Button>
      <Button on:click={onShare2} variant="outlined" color="secondary" type="submit" form="share-form">Ok</Button>
   </svelte:fragment>
</Dialog>

<div class="title-container">
   <h2>
      Welcome to the
      <strong>Hollister-Whitney Engineering Calculator</strong>
   </h2>

   <p>
      Select an existing
      <strong>Workbook</strong>
      from the list below or click the
      <strong>Create New Workbook</strong>
      button
   </p>

   <p>
      To find an existing
      <strong>Workbook</strong>
      use the
      <strong>Search Bar</strong>
      below to find your specific workbook
   </p>
</div>

<div class="search-container">
   <InputSearch on:search={onSearch} on:clear={onClear} bind:value={search} fullWidth />

   <Button on:click={onNew} variant="contained" href="/project/requirements" style="height: 56px; margin: 0; padding: 0 16px">
      Create New Workbook
      <svelte:fragment slot="trailingIcon">
         <Svg fileData={add_svg} />
      </svelte:fragment>
   </Button>
</div>

<Table on:sort={onSort} class="home-data-table" sticky>
   <svelte:fragment slot="head">
      <Row>
         <Cell scope="col" role="columnheader" class="workbook-row-cell__contract" sort="contract">Contract #</Cell>
         <Cell scope="col" role="columnheader" class="workbook-row-cell__job-name" sort="jobName">Job Name</Cell>
         <Cell scope="col" role="columnheader" class="workbook-row-cell__car" sort="carNo">Car #</Cell>
         <Cell scope="col" role="columnheader" class="workbook-row-cell__customer" sort="customer">Customer</Cell>
         <Cell scope="col" role="columnheader" class="workbook-row-cell__layout" sort="layout">Layout #</Cell>
         <Cell scope="col" role="columnheader" class="workbook-row-cell__date">Created</Cell>
         <Cell scope="col" role="columnheader" class="workbook-row-cell__date">Last Opened</Cell>
         <Cell scope="col" role="columnheader" class="workbook-row-cell__chip">Owned By</Cell>
         <Cell scope="col" role="columnheader" class="workbook-row-cell__menu" />
      </Row>
   </svelte:fragment>

   {#await workbooks}
      <Row>
         <Cell colspan="9">Loading...</Cell>
      </Row>
   {:then workbooks}
      {#if workbooks.length !== 0}
         {#each workbooks as workbook (workbook._id)}
            <WorkbookRow userId={user._id} {workbook} on:delete={onDelete1} on:select={onSelect} on:copy={onCopy} on:share={onShare1} />
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
      <Nav bind:page length={workbooks.length} total={totalWorkbooks} {maxRows} />
   </svelte:fragment>
</Table>

<Snackbar bind:show={showSnackbar}>Workbook Share Sent</Snackbar>

<style lang="scss">
   @use './src/scss/theme' as vantage;

   :global {
      .home-data-table.mdc-data-table {
         @include vantage.border-top;
         @include vantage.paper;
         width: 100%;
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
