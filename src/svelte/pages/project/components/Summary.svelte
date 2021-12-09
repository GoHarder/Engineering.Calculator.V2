<script>
   import { onDestroy } from 'svelte';

   // Components
   import { Checkbox } from 'components/material/checkbox';
   import { HelperText, Input } from 'components/material/input';

   // Stores
   import projectStore from 'stores/project';
   import userStore from 'stores/user';

   // Properties
   // Methods
   // Constants
   // Variables

   // - Project
   let carNo;
   let contract;
   let created;
   let creator;
   let customer;
   let globals;
   let jobName;
   let layout;
   let metric;
   let modules;
   let notes;
   let opened;
   let temp;

   // - User
   let user;

   // Subscriptions
   const clearUser = userStore.subscribe((store) => (user = store));
   const clearProject = projectStore.subscribe((store) => {
      const newCreator = {
         _id: user._id,
         firstName: user.firstName,
         lastName: user.lastName,
      };

      const newOpened = [
         {
            _id: user._id,
            date: Date.now(),
         },
      ];

      carNo = store?.carNo;
      contract = store?.contract;
      created = store?.created ?? Date.now();
      creator = store?.creator ?? newCreator;
      customer = store?.customer;
      globals = store?.globals ?? {};
      jobName = store?.jobName;
      layout = store?.layout;
      metric = store?.metric ?? false;
      modules = store?.modules ?? {};
      notes = store?.notes ?? [];
      opened = store?.opened ?? newOpened;
      temp = store?.temp ?? false;
   });

   // Contexts
   // Reactive Rules
   // Events
   // Lifecycle
   onDestroy(() => {
      const project = {
         carNo,
         contract,
         created,
         creator,
         customer,
         globals,
         jobName,
         layout,
         metric,
         modules,
         notes,
         opened,
         temp,
      };

      if (!carNo) delete project.carNo;
      if (!layout) delete project.layout;

      projectStore.update(project);
      clearProject();
      clearUser();
   });
</script>

<section class="project-form">
   <p>Enter the project details and proceed to the next step</p>

   <div class="grid">
      <div class="grid-1">
         <Input bind:value={contract} label="Contract Number" fullWidth required pattern={'\\d{6,}'}>
            <svelte:fragment slot="helperText">
               <HelperText validation>Invalid Contract Number</HelperText>
            </svelte:fragment>
         </Input>

         <Input bind:value={jobName} label="Job Name" fullWidth required>
            <svelte:fragment slot="helperText">
               <HelperText validation>Invalid Job Name</HelperText>
            </svelte:fragment>
         </Input>

         <Input bind:value={carNo} label="Car Number" fullWidth />

         <Input bind:value={customer} label="Customer Name" fullWidth required>
            <svelte:fragment slot="helperText">
               <HelperText validation>Invalid Cusomter Name</HelperText>
            </svelte:fragment>
         </Input>

         <Input bind:value={layout} label="Layout Number" fullWidth pattern="^(?:(L|l)-[\d-]+)$">
            <svelte:fragment slot="helperText">
               <HelperText validation>Invalid Layout Number</HelperText>
            </svelte:fragment>
         </Input>
      </div>

      <div class="grid-2">
         <Checkbox bind:checked={metric} label="Display Metric Values" />

         <Checkbox bind:checked={temp} label="Temporary Workbook" />
      </div>
   </div>
</section>

<style lang="scss">
   .grid {
      display: grid;
      grid: {
         column-gap: 0.5em;
         template-columns: 1fr 300px;
      }
   }

   @media (min-width: 900px) {
      .grid {
         grid-template: {
            columns: 1fr;
            rows: auto auto;
         }
      }

      .grid-1 {
         display: grid;
         grid: {
            column-gap: 0.5em;
            template: {
               columns: 1fr 1fr;
               rows: repeat(auto, 75px);
            }
         }
      }
   }

   @media (min-width: 1024px) {
      .project-form {
         width: 960px;
         margin: 0 auto;
      }

      .grid-1 {
         grid-template-columns: 1fr 1fr 1fr;
      }
   }

   /* section {
      display: grid;
      grid-template-columns: auto 300px;
      grid-template-rows: 30px 75px 75px 75px 75px;
      gap: 0.5em;
      grid-template-areas:
         'p p'
         'contract metric'
         'job temp'
         'car .'
         'customer .'
         'layout .';
   } */

   /* p {
      margin: 0;
      grid-area: p;
   }

   .contract-number {
      grid-area: contract;
   }

   .job-name {
      grid-area: job;
   }

   .car-number {
      grid-area: car;
   }

   .customer-name {
      grid-area: customer;
   }

   .layout-number {
      grid-area: layout;
   }

   .metric {
      grid-area: metric;
   }

   .temp {
      grid-area: temp;
   }

   .checkbox {
      margin: 0.5em 0 0;
   } */

   /* @media (min-width: 900px) {
      section {
         grid-template-columns: 1fr 1fr;
         grid-template-areas:
            'p p'
            'contract job'
            'car customer'
            'layout .'
            'metric temp';
      }
   } */

   // @media (min-width: 1100px) {
   //    /* section {
   //       grid-template-columns: 1fr 1fr 1fr;
   //       grid-template-areas:
   //          'p p p'
   //          'contract job car'
   //          'customer layout .'
   //          'metric temp .';
   //    } */
   // }

   // @media (min-width: 1400px) {
   //    /* section {
   //       grid-template-columns: 0.25fr 1fr 1fr 1fr 0.25fr;
   //       grid-template-areas:
   //          '. p p p .'
   //          '. contract job car. '
   //          '. customer layout . .'
   //          '. metric temp . .';
   //    } */
   // }
</style>
