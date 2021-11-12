<script>
   import { filterProps } from '../../lib';

   import { visibility_off_svg, visibility_svg } from 'img/icons';

   // Components
   import Input from './Input.svelte';
   import { Svg } from 'components/common';

   // Stores
   // Properties
   export let value = undefined;

   // Methods
   // Constants
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
   <Input bind:value {...props} required {pattern}>
      <svelte:fragment slot="trailingIcon">
         <Svg on:click={onToggle} fileData={visibility_off_svg} role="button" tabindex="0" title="Hide Password" />
      </svelte:fragment>

      <svelte:fragment slot="helperText">
         <slot name="helperText" />
      </svelte:fragment>
   </Input>
{:else}
   <Input bind:value {...props} required {pattern} type="password">
      <svelte:fragment slot="trailingIcon">
         <Svg on:click={onToggle} fileData={visibility_svg} role="button" tabindex="0" title="Show Password" />
      </svelte:fragment>

      <svelte:fragment slot="helperText">
         <slot name="helperText" />
      </svelte:fragment>
   </Input>
{/if}
