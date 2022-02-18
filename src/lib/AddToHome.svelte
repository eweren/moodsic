<script lang="ts">
  import { fly } from 'svelte/transition';
  import SvgIcon from './SvgIcon.svelte';
  import { DEFAULT_TRANSITION_DISTANCE, DEFAULT_TRANSITION_DURATION } from '../utils/constants';

  export let color = '#fff';

  let visible = false;
  let deferredPrompt: any;
  const AddToHomeKey = 'AddToHome'

  function promptUser() : void{
    visible = false;
    // Show the prompt
    deferredPrompt?.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt?.userChoice.then((choiceResult) => {
      localStorage.setItem(AddToHomeKey, 'true');
      deferredPrompt = null;
    });
  }
</script>

<svelte:window
  on:beforeinstallprompt|preventDefault={(e) => {
    if (localStorage.getItem(AddToHomeKey) != null) {
      return;
    }
    visible = true;
    deferredPrompt = e;
  }}
/>

{#if visible}
  <div id="addToHome" on:click|preventDefault={() => promptUser()} style={`fill: ${color}`} in:fly="{{ y: -DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ y: -DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}">
    <SvgIcon name="arc" size="40" />
  </div>
{/if}

<style>
  #addToHome {
    position: absolute;
    top: 10px;
    left: 20px;
    width: 40px;
    height: 40px;
    z-index: 5;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }
  #addToHome:hover {
    padding-bottom: 20px;
    top: -10px;
  }
</style>
