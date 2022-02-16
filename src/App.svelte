<script lang="ts">
  import FeedbackIcon from './lib/FeedbackIcon.svelte';
  import './lottie-player.js';
  import MusicControl from './lib/MusicControl.svelte'
  import AddToHome from './lib/AddToHome.svelte'
  import { Sounds, Lotties } from './lib/data';
	import { onMount } from 'svelte';
  import SvgIcon from './lib/SvgIcon.svelte';
  import MyIcon from '/icons/prev.svg';
  import type { LottiePlayer } from "@lottiefiles/lottie-player";
  import VolumeControl from './lib/VolumeControl.svelte';
	import { fade } from 'svelte/transition';

  const HIDE_DURATION = 2000;
  const LottieBackgroundKey = 'lottieIndex';

  let lottieIndex = parseInt(localStorage.getItem(LottieBackgroundKey) ?? '0', 10);
  let showControls = true;
  let lottie = Lotties[lottieIndex];
  let lottiePlayer: Partial<LottiePlayer>;

  let timeout: any;
  let lastClickTimestamp: number;

	onMount(async () => {
    const body = document.body;
    body.style.overflow = "hidden";
    addEventListener('click', () => {
      const d = new Date().valueOf();
      if (lastClickTimestamp && d - lastClickTimestamp < 500) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        lastClickTimestamp = undefined;
      } else {
        lastClickTimestamp = d;
      }
    });
  });

  function handleClick() {
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

  function setLastBackground() {
    lottieIndex = (lottieIndex + Lotties.length - 1) % Lotties.length;
    updateBackgroundState();
  }

  function setNextBackground() {
    lottieIndex = (lottieIndex + 1) % Lotties.length;
    updateBackgroundState();
  }

  function updateBackgroundState() {
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
/>
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
  {#if showControls}
    <AddToHome color={lottie.controlColor} />
    <FeedbackIcon />
    <div transition:fade="{{duration: 400}}">
        <div class="volumes">
          {#each Sounds as sound}
            <VolumeControl color={lottie.volumesColor} label={sound.title} src={sound.src} />
          {/each}
        </div>
        <MusicControl color={lottie.controlColor} />
        <button class="backgroundImageButton" aria-label="Previous Background" style={`fill: ${lottie.controlColor}`} on:click|stopPropagation={setLastBackground}>
            <SvgIcon name="prev" />
        </button>
        <button class="backgroundImageButton" aria-label="Next Background" style={`fill: ${lottie.controlColor}`} on:click|stopPropagation={setNextBackground}>
            <SvgIcon name="prev" />
        </button>
    </div>
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
  .volumes {
    justify-content: center;
    align-items: center;
    display: grid;
    flex-direction: column;
    gap: var(--scale-00);
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
