<script>
   // Components
   import { Cell, Nav, Table, Row } from 'components/material/data-table';
   import { InputSearch } from 'components/material/input';

   // Stores
   // Properties
   // Methods
   // Constants
   // Variables
   let listings = [];
   let search;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onClear = (event) => {
      console.log(event);
   };

   const onSearch = (event) => {
      console.log(event);
   };

   const onSort = (event) => {
      console.log(event);
   };

   // Lifecycle
</script>

<div class="grid">
   <div class="search">
      <InputSearch on:search={onSearch} on:clear={onClear} bind:value={search} fullWidth />
   </div>

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
               {#each listings as workbook (workbook._id)}
                  <Row>
                     <Cell colspan="9">Nothing Available...</Cell>
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

         <!--
      <svelte:fragment slot="pagination">
         <Nav bind:page length={listings.length} {totallistings} {maxRows} />
      </svelte:fragment> -->
      </Table>
   </div>

   <div class="form">content</div>
</div>

<style>
   .grid {
      display: grid;

      grid-template-columns: 100%;
      grid-template-areas:
         'search'
         'form'
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

   @media (min-width: 1000px) {
      .grid {
         grid-template-columns: 50% 50%;
         grid-template-areas:
            'search form'
            'table form';
      }
   }
</style>
