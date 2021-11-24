<script>
   import { onMount } from 'svelte';

   import { floor } from 'lib/math.mjs';

   // Components
   import { Button, Icon } from 'components/material/button';
   import { Cell, Nav, Table, Row } from 'components/material/data-table';
   import { HelperText, Input, InputSearch } from 'components/material/input';
   import { Option, Select } from 'components/material/select';
   import { Snackbar } from 'components/material/snackbar';

   // Stores
   import fetchStore from 'stores/fetch';

   // Properties
   // Methods
   const getSearch = async (search, page, length) => {
      const token = localStorage.getItem('token');

      let res, body;

      try {
         res = await fetch(`/api/engineering/steel?search=${search}&page=${page}&length=${length}`, {
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         listings = [...body.docs];
         totalListings = body.count;
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Constants
   // Variables
   let listings = [];
   let totalListings = 0;
   let search;
   let page = 1;
   let innerHeight = 0;
   let maxRows = 10;
   let member;
   let showSnackbar = false;

   // Subscriptions
   // Contexts
   // Reactive Rules

   // Events
   const onClear = () => {
      listings = [];
      totalListings = 0;
      member = undefined;
   };

   const onSearch = () => {
      getSearch(search, page, maxRows);
   };

   const onSelect = (_id) => {
      member = listings.find((row) => row._id === _id);
   };

   const onSort = (event) => {
      listings = [...listings].sort((a, b) => {
         let direction = 0;
         const valueA = a[event.detail.columnId];
         const valueB = b[event.detail.columnId];

         if (valueA < valueB) direction = -1;

         if (valueA > valueB) direction = 1;

         direction = (event.detail.sortValue === 'ascending' ? 1 : -1) * direction;

         return direction;
      });
   };

   const onSubmit = async (event) => {
      event.preventDefault();

      const token = localStorage.getItem('token');

      let res, body;

      try {
         const reqBody = JSON.stringify(member);

         res = await fetch(`/api/engineering/steel`, {
            method: 'PUT',
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
            body: reqBody,
         });

         if (res.body && res.status !== 204) body = await res.json();

         if (!res.ok) throw new Error(body.message);

         showSnackbar = true;
         getSearch(search, page, maxRows);
      } catch (error) {
         fetchStore.setError({ res, error });
      }
   };

   // Lifecycle
   onMount(() => {
      maxRows = floor((innerHeight - 390) / 52) - 1;
   });
</script>

<svelte:window bind:innerHeight />

<div class="grid">
   <div class="search">
      <InputSearch on:search={onSearch} on:clear={onClear} bind:value={search} fullWidth />
   </div>

   <hr class="hr1" />

   <div class="table">
      <Table style="width: 100%;" on:sort={onSort} sticky>
         <svelte:fragment slot="head">
            <Row>
               <Cell scope="col" role="columnheader" sort="name">Name</Cell>
               <Cell scope="col" role="columnheader" sort="material">Material</Cell>
               <Cell scope="col" role="columnheader" sort="stockStatus">Stock Status</Cell>
            </Row>
         </svelte:fragment>

         {#await listings}
            <Row>
               <Cell colspan="9">Loading...</Cell>
            </Row>
         {:then listings}
            {#if listings.length !== 0}
               {#each listings as { _id, material, name, stockStatus } (_id)}
                  <Row on:click={() => onSelect(_id)}>
                     <Cell>{name}</Cell>
                     <Cell>{material}</Cell>
                     <Cell>{stockStatus}</Cell>
                  </Row>
               {/each}
            {:else}
               <Row>
                  <Cell colspan="9">Nothing Available...</Cell>
               </Row>
            {/if}
         {:catch error}
            <Cell row colspan="9">
               <span style="color: #b00020">{error}</span>
            </Cell>
         {/await}

         <svelte:fragment slot="pagination">
            <Nav bind:page length={listings.length} total={totalListings} {maxRows} />
         </svelte:fragment>
      </Table>
   </div>

   <hr class="hr2" />

   <div class="vr" />

   <div class="form">
      {#if member}
         <form on:submit={onSubmit}>
            <Input bind:value={member.name} label="Name" required fullWidth>
               <svelte:fragment slot="helperText">
                  <HelperText validation>Invalid name</HelperText>
               </svelte:fragment>
            </Input>

            <Input bind:value={member.material} label="Material" required fullWidth>
               <svelte:fragment slot="helperText">
                  <HelperText validation>Invalid material</HelperText>
               </svelte:fragment>
            </Input>

            <Select bind:value={member.stockStatus} label="Stock Status" fullWidth>
               <Option selected={member.stockStatus === 'Stocked'} value="Stocked">Stocked</Option>
               <Option selected={member.stockStatus === 'Available'} value="Available">Available</Option>
               <Option selected={member.stockStatus === 'Check'} value="Check">Check</Option>
            </Select>

            <div class="button-container">
               <Button variant="contained" type="submit" disabled={!member}>
                  Update

                  <svelte:fragment slot="trailingIcon">
                     <Icon>sync_alt</Icon>
                  </svelte:fragment>
               </Button>
            </div>
         </form>
      {/if}
   </div>
</div>

<Snackbar bind:show={showSnackbar}>Saved</Snackbar>

<style>
   .grid {
      display: grid;

      grid-template-columns: 100%;
      grid-template-areas:
         'search'
         'hr1'
         'form'
         'hr2'
         'table';

      gap: 0.5em;
   }

   .search {
      grid-area: search;
   }

   .table {
      grid-area: table;
   }

   .form {
      grid-area: form;
   }

   .hr1 {
      grid-area: hr1;
   }

   .hr2 {
      grid-area: hr2;
   }

   .button-container {
      display: flex;
      justify-content: flex-end;
      margin: 0.5em 0 0;
      gap: 0.5em;
   }

   .vr {
      grid-area: vr;
      content: '';
      background-color: rgba(0, 0, 0, 0.12);
      width: 1px;
      height: 100%;
      margin: 0 auto;
      display: none;
   }

   @media (min-width: 1000px) {
      .grid {
         grid-template-columns: 50% 1px auto;
         grid-template-areas:
            'search . .'
            'hr1 hr1 hr1'
            'table vr form';
      }
      .vr {
         display: block;
      }
      .hr2 {
         display: none;
      }
   }
</style>
