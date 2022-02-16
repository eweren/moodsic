<script lang="ts">
  import SvgIcon from './SvgIcon.svelte';
  let visible = false;
  let deferredPrompt: any;
  export let color = '#fff';
  const AddToHomeKey = 'AddToHome'

  function promptUser() {
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
  <div id="addToHome" on:click|preventDefault={() => promptUser()} style={`fill: ${color}`}>
    <SvgIcon name="arc" width="40" height="40" />
  </div>
{/if}

<style>
  #addToHome {
    position: absolute;
    bottom: 10px;
    left: 20px;
    width: 40px;
    height: 40px;
    z-index: 5;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }
  #addToHome:hover {
    padding-top: 20px;
    bottom: -10px;
  }
</style>
