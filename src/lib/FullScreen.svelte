<script lang="ts">
import { onMount } from 'svelte';
import SvgIcon from './SvgIcon.svelte';

export let color = '#FFF';
let fullScreen = false;

onMount (() => {
  document.addEventListener('fullscreenchange', () => {
    fullScreen = document.fullscreenElement != null;
  });
});

function requestFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}
</script>

<div class="container" style="fill: {color}" on:click={() => requestFullScreen()}>
  {#if fullScreen}
    <SvgIcon name="windowsize" />
  {:else}
    <SvgIcon name="fullsize" />
  {/if}
</div>

<style>
  .container {
    z-index: 7;
    position: absolute;
    top: 0;
    right: 0;
  }

</style>