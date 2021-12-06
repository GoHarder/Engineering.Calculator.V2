<script>
   import { onDestroy } from 'svelte';

   import { capitalize } from 'lib/string.mjs';

   // Components
   import { Button, Icon, IconButton } from 'components/material/button';
   import { Chip } from 'components/material/chip';
   import { Cell, Row, Table } from 'components/material/data-table';
   import { Dialog } from 'components/material/dialog';
   import { TextArea } from 'components/material/input';
   import { Option, Select } from 'components/material/select';
   import { ToolTip } from 'components/material/tool-tip';

   // Stores
   import userStore from 'stores/user';

   // Properties
   export let project = {};
   export let show = false;

   // Methods
   const getDateString = (number) => {
      if (number) {
         return new Date(number).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
         });
      } else {
         return 'N/A';
      }
   };

   // Constants
   // Variables
   let notes = [...project.notes];
   let showDialog = false;
   let user;
   let firstName;
   let lastName;
   let category = 'Project';
   let content;
   let date;

   // Subscriptions
   const clearUser = userStore.subscribe((store) => (user = store));

   // Contexts
   // Reactive Rules
   $: creator = `${user.firstName} ${user.lastName}`;
   $: initials = creator.replace(/(\b[a-zA-Z])[a-zA-Z]* ?/g, '$1');
   $: categories = Object.keys(project.modules);

   // Events
   const onSubmit = (event) => {
      event.preventDefault();

      content = content.replace(/[:{}]/g, '');
      content = content.replace(/\t/g, ' ');

      if (`${firstName} ${lastName}` === creator) {
         const newNote = {
            firstName,
            lastName,
            date,
            category,
            content,
         };

         notes = [...notes].filter((note) => note.date !== date);

         notes = [...notes, newNote];
      }

      showDialog = false;
      category = 'Project';
      content = undefined;
      firstName = undefined;
      lastName = undefined;
      date = undefined;
   };

   const onDelete = (_date) => {
      const note = notes.find((note) => note.date === _date);

      firstName = note.firstName;
      lastName = note.lastName;

      if (`${firstName} ${lastName}` === creator || user.role === 'super') {
         notes = [...notes].filter((note) => note.date !== _date);
      }
   };

   const onNew = () => {
      firstName = user.firstName;
      lastName = user.lastName;
      date = Date.now();
      showDialog = true;
   };

   const onOpen = (_date) => {
      const note = notes.find((note) => note.date === _date);

      firstName = note.firstName;
      lastName = note.lastName;
      category = note.category;
      content = note.content;
      date = note.date;

      showDialog = true;
   };

   // Lifecycle
   onDestroy(() => {
      project.notes = notes;
      clearUser();
   });
</script>

<Dialog bind:show={showDialog} draggable>
   <form id="note-form" on:submit={onSubmit}>
      <Select bind:value={category} label="Category">
         <Option value="Project">Project</Option>

         {#each categories as option (option)}
            <Option value={capitalize(option)}>{capitalize(option)}</Option>
         {/each}
      </Select>

      <TextArea bind:value={content} required />
   </form>

   <svelte:fragment slot="actions">
      <Button on:click={() => (showDialog = false)} variant="outlined" color="secondary">Cancel</Button>
      <Button variant="outlined" color="secondary" type="submit" form="note-form">Ok</Button>
   </svelte:fragment>
</Dialog>

<div class="menu">
   <header>
      <h3 class="mdc-drawer__title">Notes</h3>
      <IconButton on:click={() => (show = false)} toolTip="Close">
         <Icon>close</Icon>
      </IconButton>
   </header>
   <Table>
      {#each notes as note (note.date)}
         <Row class="notes-dialog-row">
            <Cell on:click={() => onOpen(note.date)} data-tooltip-id="name-{note.date}">
               <Chip>{initials}</Chip>
            </Cell>
            <Cell on:click={() => onOpen(note.date)}>{note.category}</Cell>
            <Cell on:click={() => onOpen(note.date)}>{getDateString(note.date)}</Cell>
            <Cell class="notes-dialog-icon">
               <IconButton on:click={() => onDelete(note.date)} toolTip="Delete">
                  <Icon>delete</Icon>
               </IconButton>
            </Cell>
         </Row>

         <ToolTip id="name-{note.date}">{creator}</ToolTip>
      {/each}

      <Row on:click={onNew} class="notes-dialog-row">
         <Cell class="notes-dialog-add" colspan="3">Add</Cell>
         <Cell class="notes-dialog-icon">
            <Icon class="material-icons notes-dialog-add-icon">add</Icon>
         </Cell>
      </Row>
   </Table>
</div>

<style lang="scss">
   @use 'src/scss/theme' as vantage;

   .menu {
      @include vantage.paper;
      position: fixed;
      right: 0;
      top: 60px;
      z-index: 5;
      padding: 0 1em 1em;
   }

   header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
         margin: 0;
      }
   }

   form {
      display: flex;
      gap: 1em;
      flex-direction: column;
   }

   :global {
      .notes-dialog-row {
         cursor: pointer;
      }

      .notes-dialog-icon {
         padding: 0;
      }

      .notes-dialog-add-icon {
         margin: 12px;
      }

      .notes-dialog-add {
         width: 300px;
      }
   }
</style>
