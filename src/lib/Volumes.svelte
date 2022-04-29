<script lang="ts">
  import { fly } from 'svelte/transition';
  import { Sounds } from './data';
  import SvgIcon from './SvgIcon.svelte';
  import VolumeControl from './VolumeControl.svelte';
  import { DEFAULT_TRANSITION_DISTANCE, DEFAULT_TRANSITION_DURATION } from '../utils/constants';

  export let color = '#FFF';
  export let showBox = false;
</script>

<div class="host">
  {#if showBox}
  <div class="volumesWrapper" in:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}">
    <div class="volumes" on:click|stopPropagation|preventDefault>
      <h2>Sounds</h2>
      {#each Sounds as sound}
      <VolumeControl color="#FFF" label={sound.title} src={sound.src} />
      {/each}
    </div>
    <div class="close" on:click|stopPropagation|preventDefault={() => showBox = false}>X</div>
    </div>
  {:else}
  <div class="loud" title="Create your atmosphere sounds" style="fill: {color}" on:click|stopPropagation|preventDefault={() => showBox = true} in:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}">
    <SvgIcon name="loud" size="60" />
  </div>
  {/if}
</div>

<style>
  .host {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 7;
  }
  .volumesWrapper {
    position: absolute;
    bottom: var(--size-4);
    left: var(--size-4);
  }
  .volumes::-webkit-scrollbar {
    display: none;
  }

  .volumes {
    display: flex;
    flex-direction: column;
    width: 180px;
    height: 300px;
    align-items: center;
    justify-content: space-between;
    overflow-y: auto;
    text-align: center;
    color: white;
    font-size: var(--size-3);
    gap: var(--size-2);
    background: var(--color-grey-900);
    box-shadow: 4px 4px 0px 0px var(--color-green-500);
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .close {
    position: absolute;
    color: white;
    top: 0;
    right: 0;
    padding: var(--size-2);
    cursor: pointer;
  }
  .loud {
    position: absolute;
    bottom: 0;
    left: 0;
    cursor: pointer;
    padding: 10px;
  }
  .loud:hover {
    background-color: rgba(100, 100, 100, 0.2);
  }
</style>