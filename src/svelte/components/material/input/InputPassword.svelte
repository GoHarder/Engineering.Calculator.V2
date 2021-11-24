<script>
   import { filterProps } from '../../lib';

   // Components
   import Input from './Input.svelte';
   import Icon from '../common/Icon.svelte';
   import ToolTip from '../tool-tip/ToolTip.svelte';

   // Stores
   // Properties
   export let value = undefined;

   // Methods
   // Constants
   const id = Math.random().toString(36).substr(2, 9);
   const regexString = /(?=.*[~!@#$%^&*\(\)_+-=])(?=.*\d)(?=.*[A-Z])(?=.*[a-z])\S{8,15}/.toString();
   const pattern = regexString.substring(1, regexString.length - 1);

   // Variables
   let showPassword = false;

   // Subscriptions
   // Reactive Rules
   $: props = filterProps($$props, ['value', 'type']);

   // Events
   const onToggle = () => (showPassword = !showPassword);

   // Lifecycle
</script>

{#if showPassword}
   <Input bind:value {...props} {pattern}>
      <svelte:fragment slot="trailingIcon">
         <Icon on:click={onToggle} role="button" tabindex="0" toolTip="Hide Password">visibility_off</Icon>
      </svelte:fragment>

      <svelte:fragment slot="helperText">
         <slot name="helperText" />
      </svelte:fragment>
   </Input>
{:else}
   <Input bind:value {...props} {pattern} type="password">
      <svelte:fragment slot="trailingIcon">
         <Icon on:click={onToggle} role="button" tabindex="0" toolTip="Show Password">visibility</Icon>
      </svelte:fragment>

      <svelte:fragment slot="helperText">
         <slot name="helperText" />
      </svelte:fragment>
   </Input>
{/if}
