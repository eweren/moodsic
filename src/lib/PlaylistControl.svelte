<script lang="ts">
  import { fly } from 'svelte/transition';
  import { soundAndMusicMixer } from './stores';
  import SvgIcon from './SvgIcon.svelte';
  import { DEFAULT_TRANSITION_DISTANCE, DEFAULT_TRANSITION_DURATION} from '../utils/constants';

  export let color = '#FFF';
  let title = $soundAndMusicMixer.currentPlaylistTitle;

  async function onNext(ev: Event): Promise<void> {
    $soundAndMusicMixer.setNextPlaylist();
    title = $soundAndMusicMixer.currentPlaylistTitle;
  }

  async function onPrevious(ev: Event): Promise<void> {
    $soundAndMusicMixer.setPreviousPlaylist();
    title = $soundAndMusicMixer.currentPlaylistTitle;
  }
</script>

<div class="host" in:fly="{{ y: -DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ y: -DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}">
  <div class="controlWrapper" style="fill: {color}; color: {color}">
    <div class="control">
      <button aria-label="Play last playlist" class="rotate-180" on:click|preventDefault|stopPropagation={onPrevious}>
        <SvgIcon name="skip-forward" />
      </button>
      <button aria-label="Play next playlist" on:click|preventDefault|stopPropagation={onNext}>
        <SvgIcon name="skip-forward" />
      </button>
    </div>
    {#if title}
      <span class="title">Playlist: {title}</span>
    {/if}
  </div>
</div>

<style>
  .host {
    position: absolute;
    top: 0;
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
  .title {
    margin-top: var(--size-4)
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