<script lang="ts">
  import { fly } from 'svelte/transition';
  import type { LottiePlayer } from "@lottiefiles/lottie-player";
  import './audio-context-patch.js';
  import './lottie-player.js';
  import FeedbackIcon from './lib/FeedbackIcon.svelte';
  import MusicControl from './lib/MusicControl.svelte'
  import { Lotties } from './lib/data';
  import SvgIcon from './lib/SvgIcon.svelte';
  import Volumes from './lib/Volumes.svelte';
  import { DEFAULT_TRANSITION_DISTANCE, DEFAULT_TRANSITION_DURATION } from './utils/constants';
  import FullScreen from './lib/FullScreen.svelte';
  import { soundAndMusicMixer } from './lib/stores';

  const HIDE_DURATION = 4000;
  const LottieBackgroundKey = 'lottieIndex';

  let lottieIndex = parseInt(localStorage.getItem(LottieBackgroundKey) ?? '0', 10);
  let showControls = true;
  let volumesOpen = false;
  let feedbackOpen = false;
  let lottie = Lotties[lottieIndex];
  let lottiePlayer: Partial<LottiePlayer>;
  let isPaused = false;

  let timeout: any;

  function handleClick(): void {
    if (!showControls) {
      showControls = true;
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      showControls = false;
    }, HIDE_DURATION);
  }

  function setLastBackground(): void {
    lottieIndex = (lottieIndex + Lotties.length - 1) % Lotties.length;
    updateBackgroundState();
  }

  function setNextBackground(): void {
    lottieIndex = (lottieIndex + 1) % Lotties.length;
    updateBackgroundState();
  }

  function updateBackgroundState(): void {
    localStorage.setItem(LottieBackgroundKey, `${lottieIndex}`);
    lottie = Lotties[lottieIndex];

    const el = Array.from(document.head.getElementsByTagName('meta'));
    const element = el.find((e) => e.name === 'theme-color');
    if (element) {
      element.content = lottie.backgroundColor ?? '#000';
    }
    if (lottie.alignment === 'bottom') {
      lottiePlayer.preserveAspectRatio = lottie.needsFullscreen ? 'xMidYMax slice' : 'xMidYMax meet';
    } else if (lottie.alignment === 'top') {
      lottiePlayer.preserveAspectRatio = lottie.needsFullscreen ? 'xMidYMin slice' : 'xMidYMin meet';
    } else {
      lottiePlayer.preserveAspectRatio = lottie.needsFullscreen ? 'xMidYMid slice' : 'xMidYMid meet';
    }
    lottiePlayer.load(`backgrounds/${lottie.src}`);
  }

</script>

<svelte:body
	on:mouseenter={() => handleClick()}
	on:mousemove={() => handleClick()}
	on:click={() => handleClick()}
  on:contextmenu|preventDefault
/>

<svelte:window on:keydown={(e) => {
  handleClick();
  if (e.key === ' ') {
    isPaused = !isPaused;
    if (isPaused) {
      $soundAndMusicMixer.stopMusic();
    } else {
      $soundAndMusicMixer.playMusic();
    }
  } else if (e.key === 'ArrowRight') {
    setNextBackground();
  } else if (e.key === 'ArrowLeft') {
    setLastBackground();
  }
}} />

<div class="host">
  <div id="videoWrapper">
      <lottie-player id="video"
          bind:this={lottiePlayer}
          autoplay
          loop
          mode="normal"
          preserveAspectRatio={lottie.needsFullscreen ? 'xMidYMid slice' : 'xMidYMid meet'}
          renderer="svg"
          background={lottie.backgroundColor}
          class={lottie.needsFullscreen ? 'lottieFull' : 'lottie'}
          src=backgrounds/{lottie.src}>
      </lottie-player>
  </div>
  <audio controls style="position: absolute;opacity: 0; z-index: -99999" id="fakeAudio" preload="auto">
      <source src="sounds/silence.ogg" type="audio/ogg">
  </audio>
  {#if showControls || volumesOpen || feedbackOpen}
    <FeedbackIcon show={showControls || volumesOpen || feedbackOpen} bind:showInput={feedbackOpen} />
    <Volumes bind:showBox={volumesOpen} color={lottie.bottomColor}/>
    <FullScreen color={lottie.topColor} />
    <MusicControl color={lottie.bottomColor} bind:isPaused={isPaused} />
    <button in:fly="{{ x: -DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ x: -DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" class="backgroundImageButton" aria-label="Previous Background" style={`fill: ${lottie.bottomColor}`} on:click|stopPropagation={setLastBackground}>
        <SvgIcon name="prev" />
    </button>
    <button in:fly="{{ x: -DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ x: -DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" class="backgroundImageButton" aria-label="Next Background" style={`fill: ${lottie.bottomColor}`} on:click|stopPropagation={setNextBackground}>
      <SvgIcon name="prev" />
    </button>
  {/if}
</div>

<style>
  @import 'pollen-css';
  .host {
    display: block;
    max-width: 100%;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: var(--font-sans);
    user-select: none;
  }
  #videoWrapper {
    width: 100%;
    height: 100%;
    z-index: -9999;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
  }
  #video {
    position: absolute;
  }
  .backgroundImageButton {
    z-index: 1;
    position: absolute;
    margin-top: auto;
    margin-bottom: auto;
    top: 0;
    bottom: 0;
    outline: none;
  }
  .backgroundImageButton:nth-of-type(1) {
    left: 0;
  }
  .backgroundImageButton:nth-of-type(2) {
    right: 0;
    transform: rotate(180deg);
  }
  button {
    font-size: var(--scale-00);
    font-weight: var(--weight-medium);
    background: none;
    box-shadow: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
</style>
