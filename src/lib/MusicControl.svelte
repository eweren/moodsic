<script lang="ts">
  import { fly } from 'svelte/transition';
  import { soundAndMusicMixer, currentMusic } from './stores';
  import SvgIcon from './SvgIcon.svelte';
  import { DEFAULT_TRANSITION_DISTANCE, DEFAULT_TRANSITION_DURATION} from '../utils/constants';
  import VolumeControl from './VolumeControl.svelte';

  export let isPaused = true;
  export let color = '#FFF';

  async function _onClick(ev: Event): Promise<void> {
    ev.stopPropagation();
    ev.preventDefault();
    if ($currentMusic) {
      isPaused = true;
      $soundAndMusicMixer.stopMusic();
    } else {
      isPaused = false;
      await $soundAndMusicMixer.playMusic();
    }
  }
</script>

<div class="host" in:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}">
  <div class="controlWrapper" style="fill: {color}; color: {color}">
    {#if $currentMusic?.title}
      <a href={$currentMusic.url}>{$currentMusic.title}</a>
    {/if}
    <div class="control">
      <button aria-label="Play or stop Music" on:click={_onClick}>
        {#if $currentMusic}
          <SvgIcon name="stop" />
        {:else}
          <SvgIcon name="play" />
        {/if}
      </button>
      <VolumeControl color={color} />
    </div>
  </div>
</div>

<style>
  .host {
    position: absolute;
    bottom: 0;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 100%;
    z-index: 2;
  }
  .controlWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .control {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  button {
    font-size: var(--scale-00);
    font-weight: var(--weight-medium);
    padding: var(--size-2) var(--size-3);
    background: none;
    box-shadow: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
  }
  button:focus-visible {
    outline: none;
  }
  a {
    color: inherit;
  }
</style>