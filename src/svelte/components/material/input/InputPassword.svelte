<script>
   import { filterProps } from '../../lib';

   // Components
   import Input from './Input.svelte';
   import Icon from '../common/Icon.svelte';

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

<Input bind:value {...props} {pattern} type={showPassword ? 'text' : 'password'}>
   <svelte:fragment slot="trailingIcon">
      <Icon on:click={onToggle} role="button" tabindex="0" toolTip={showPassword ? 'Hide Password' : 'Show Password'}>
         {#if showPassword}
            visibility_off
         {:else}
            visibility
         {/if}
      </Icon>
   </svelte:fragment>

   <svelte:fragment slot="helperText">
      <slot name="helperText" />
   </svelte:fragment>
</Input>

<style></style>
