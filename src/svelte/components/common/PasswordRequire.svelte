<script>
   // Components
   import { Icon, Item, List } from 'components/material/list';

   // Stores
   // Properties
   export let password1 = '';
   export let password2 = '';

   // Methods
   // Constants
   // Variables
   // Subscriptions
   // Contexts
   // Reactive Rules
   $: tests = [
      {
         text: 'Between 8 and 16 Characters',
         test1: password1.match(/\S{8,15}/g),
         test2: password2.match(/\S{8,15}/g),
      },
      {
         text: 'At least one lower case letter [a-z]',
         test1: password1.match(/[a-z]/g),
         test2: password2.match(/[a-z]/g),
      },
      {
         text: 'At least one upper case letter [A-Z]',
         test1: password1.match(/[A-Z]/g),
         test2: password2.match(/[A-Z]/g),
      },
      {
         text: 'At least one upper case letter [0-9]',
         test1: password1.match(/[0-9]/g),
         test2: password2.match(/[0-9]/g),
      },
      {
         text: 'At least one symbol [~!@#$%^&*()_+-=]',
         test1: password1.match(/[~!@#$%^&*()_\+\-\=]/g),
         test2: password2.match(/[~!@#$%^&*()_\+\-\=]/g),
      },
   ];

   // Events
   // Lifecycle
</script>

<List dense interactive={false}>
   {#each tests as { text, test1, test2 }}
      <Item selected={test1}>
         {text}
         <svelte:fragment slot="trailingIcon">
            {#if test2}
               <Icon>check</Icon>
            {/if}
         </svelte:fragment>
      </Item>
   {/each}
</List>

<style>
</style>
