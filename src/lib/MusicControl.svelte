<script lang="ts">
  import { fly } from 'svelte/transition';
  import { soundAndMusicMixer, currentMusic } from './stores';
  import SvgIcon from './SvgIcon.svelte';
  import { DEFAULT_TRANSITION_DISTANCE, DEFAULT_TRANSITION_DURATION} from '../utils/constants';
  import VolumeControl from './VolumeControl.svelte';

  export let isPaused = true;
  export let color = '#FFF';

  async function onPlayPause(ev: Event): Promise<void> {
    if ($currentMusic) {
      isPaused = true;
      $soundAndMusicMixer.stopMusic();
    } else {
      isPaused = false;
      await $soundAndMusicMixer.playMusic();
    }
  }

  async function onNext(ev: Event): Promise<void> {
    $soundAndMusicMixer.playNextSong();
  }

  async function onPrevious(ev: Event): Promise<void> {
    $soundAndMusicMixer.playPreviousSong();
  }
</script>

<div class="host" in:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}">
  <div class="controlWrapper" style="fill: {color}; color: {color}">
    {#if $currentMusic?.title}
      <a href={$currentMusic.url}>{$currentMusic.title}</a>
    {/if}
    <div class="control">
      <button aria-label="Play or stop Music" class="rotate-180" on:click|preventDefault|stopPropagation={onPrevious}>
        <SvgIcon name="skip-forward" />
      </button>
      <button aria-label="Play or stop Music" style="z-index: 10" on:click|preventDefault|stopPropagation={onPlayPause}>
        {#if $currentMusic}
        <SvgIcon name="stop" />
        {:else}
        <SvgIcon name="play" />
        {/if}
      </button>
      <button aria-label="Play or stop Music" on:click|preventDefault|stopPropagation={onNext}>
        <SvgIcon name="skip-forward" />
      </button>
    </div>
    <div class="volume-control">
      <VolumeControl title="Adjust music volume" color={color} />
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
    margin-bottom: calc(var(--size-4) * -1);
  }
  .control button:first-of-type {
    transform: rotate(180deg);
  }
  button {
    font-size: var(--scale-00);
    font-weight: var(--weight-medium);
    /* padding: var(--size-2) var(--size-3); */
    background: none;
    box-shadow: none;
    border: none;
    display: flex;
    align-items: center;
    margin: calc(var(--size-2) * -1);
    justify-content: center;
    cursor: pointer;
  }
  button:focus-visible {
    outline: none;
  }
  .volume-control {
    margin-top: var(--size-2);
    margin-bottom: var(--size-4);
    z-index: 11;
    width: 84%;
  }
  a {
    color: inherit;
  }
</style>