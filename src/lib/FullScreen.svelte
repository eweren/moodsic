<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import SvgIcon from './SvgIcon.svelte';
  import { DEFAULT_TRANSITION_DISTANCE, DEFAULT_TRANSITION_DURATION } from '../utils/constants';

  export let color = '#FFF';

  let fullScreen = false;

  onMount (() => {
    document.addEventListener('fullscreenchange', () => {
      fullScreen = document.fullscreenElement != null;
    });
  });

  function requestFullScreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }
</script>

<div class="container" style="fill: {color}" on:click={() => requestFullScreen()} in:fly="{{ y: -DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ y: -DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}">
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