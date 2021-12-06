<script>
   import { createEventDispatcher } from 'svelte';

   // Components
   import { Icon, IconButton } from 'components/material/button';
   import { Chip } from 'components/material/chip';
   import { Cell, Row } from 'components/material/data-table';
   import { Item, Menu } from 'components/material/menu';
   import { ToolTip } from 'components/material/tool-tip';

   // Stores
   // Properties
   export let userId;
   export let project;

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
   const dispatch = createEventDispatcher();
   const creator = `${project.creator.firstName} ${project.creator.lastName}`;
   const initials = creator.replace(/(\b[a-zA-Z])[a-zA-Z]* ?/g, '$1');
   const opened = project.opened.find((user) => user._id === userId)?.date;

   // Variables
   let open;

   // Subscriptions
   // Contexts
   // Reactive Rules
   // Events
   const onClick = (cmd) => dispatch(cmd, project._id);

   // Lifecycle
</script>

<Row class="project-row">
   <Cell on:click={() => onClick('select')} class="project-row-cell__contract" scope="row">{project.contract}</Cell>
   <Cell on:click={() => onClick('select')} class="project-row-cell__job-name">{project.jobName}</Cell>
   <Cell on:click={() => onClick('select')} class="project-row-cell__car">{project.carNo ? project.carNo : 'N/A'}</Cell>
   <Cell on:click={() => onClick('select')} class="project-row-cell__customer">{project.customer}</Cell>
   <Cell on:click={() => onClick('select')} class="project-row-cell__layout">{project.layout ? project.layout : 'N/A'}</Cell>
   <Cell on:click={() => onClick('select')} class="project-row-cell__date">{getDateString(project.created)}</Cell>
   <Cell on:click={() => onClick('select')} class="project-row-cell__date">{getDateString(opened)}</Cell>
   <Cell on:click={() => onClick('select')} class="project-row-cell__chip" data-tooltip-id="name-{project._id}" style="text-align: center;">
      <Chip>{initials}</Chip>
   </Cell>
   <div class="mdc-menu-surface--anchor menu-cell">
      <IconButton on:click={() => (open = !open)} toolTip="Menu">
         <Icon>more_vert</Icon>
      </IconButton>

      <Menu bind:show={open} anchorCorner="top-right">
         <Item on:click={() => onClick('share')}>
            <svelte:fragment slot="leadingIcon">
               <Icon>share</Icon>
            </svelte:fragment>
            Share
         </Item>
         <Item on:click={() => onClick('copy')}>
            <svelte:fragment slot="leadingIcon">
               <Icon>file_copy</Icon>
            </svelte:fragment>
            Copy
         </Item>
         <Item on:click={() => onClick('delete')}>
            <svelte:fragment slot="leadingIcon">
               <Icon>delete</Icon>
            </svelte:fragment>
            Delete
         </Item>
      </Menu>
   </div>
</Row>

<ToolTip id="name-{project._id}">{creator}</ToolTip>

<style lang="scss">
   .menu-cell {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 52px;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.12);
   }

   :global {
      .project-row {
         cursor: pointer;
      }

      .project-row-cell {
         &__contract {
            width: 135px;
         }
         &__car {
            width: 100px;
         }

         &__layout {
            display: none;
            width: 125px;
         }
         &__date {
            display: none;
            width: 120px;
         }
         &__chip {
            width: 105px;
         }
         &__menu {
            width: 52px;
            padding: 0;
         }
      }

      @media (min-width: 1000px) {
         .project-row-cell {
            &__layout {
               display: table-cell;
            }
         }
      }

      @media (min-width: 1200px) {
         .project-row-cell {
            &__date {
               display: table-cell;
            }
         }
      }
   }
</style>
