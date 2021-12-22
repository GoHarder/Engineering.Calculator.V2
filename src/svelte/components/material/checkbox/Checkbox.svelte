<script>
   import { onMount, onDestroy } from 'svelte';
   import { slide } from 'svelte/transition';
   import { MDCFormField } from '@material/form-field';
   import { MDCCheckbox } from '@material/checkbox';

   // Components
   import { IconButton, Icon } from '../button';

   // Stores
   // Properties
   export let checked = false;
   export let disabled = undefined;
   export let group = undefined;
   export let link = undefined;
   export let label = '';
   export let name = undefined;
   export let value = undefined;

   // Methods
   const updateChekbox = (group) => {
      checked = group.indexOf(value) >= 0;
   };

   const updateGroup = (checked) => {
      const index = group.indexOf(value);
      if (checked) {
         if (index < 0) {
            group.push(value);
            group = group;
         }
      } else {
         if (index >= 0) {
            group.splice(index, 1);
            group = group;
         }
      }
   };

   // Constants
   const id = Math.random().toString(36).substring(2, 9);

   // Variables
   let divEle1;
   let divEle2;
   let Checkbox;
   let FormField;

   // Subscriptions
   // Reactive Rules
   $: if (group) updateChekbox(group);
   $: if (group) updateGroup(checked);
   $: if (link) disabled = true;

   // Events
   const onLink = () => history.pushState({ path: link }, '');

   // Lifecycle
   onMount(() => {
      FormField = new MDCFormField(divEle1);
      Checkbox = new MDCCheckbox(divEle2);
      FormField.input = Checkbox;
   });

   onDestroy(() => {
      FormField.destroy();
      Checkbox.destroy();
   });
</script>

<div class="checkbox" transition:slide|local>
   <div bind:this={divEle1} class="mdc-form-field" class:mdc-checkbox--disabled={disabled}>
      <div bind:this={divEle2} class="mdc-checkbox">
         <input bind:checked {disabled} {name} {value} type="checkbox" class="mdc-checkbox__native-control" id="checkbox-{id}" />

         <div class="mdc-checkbox__background">
            <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
               <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
            </svg>

            <div class="mdc-checkbox__mixedmark" />
         </div>

         <div class="mdc-checkbox__ripple" />
      </div>

      <label for="checkbox-{id}">{label}</label>
   </div>

   {#if link}
      <IconButton on:click={onLink} toolTip={link.match(/\w+$/)[0]}>
         <Icon>link</Icon>
      </IconButton>
   {/if}
</div>

<style lang="scss" global>
   @use './src/scss/theme' as vantage;
   @use '@material/theme' with (
      $primary: vantage.$secondary,
      $secondary: vantage.$primary
   );
   @use '@material/checkbox';
   @use '@material/form-field';

   @include checkbox.core-styles;
   @include form-field.core-styles;

   .checkbox {
      display: flex;
      align-items: center;
      margin-bottom: 19px;
      gap: 4px;
   }
</style>
