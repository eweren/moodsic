<script lang="ts">
  import { fly } from 'svelte/transition';
  import { soundAndMusicMixer, currentMusic, soundGenerator } from './stores';
  import SvgIcon from './SvgIcon.svelte';
  import { DEFAULT_TRANSITION_DISTANCE, DEFAULT_TRANSITION_DURATION} from '../utils/constants';
  import VolumeControl from './VolumeControl.svelte';
  import { chordPatterns, chordSampler, guitarPatterns, guitarSampler, SoundGenerator } from '../utils/soundGenerator';
  import * as Tone from 'tone';

  export let isPaused = true;
  export let color = '#FFF';

  let generator: SoundGenerator;

  soundGenerator.subscribe(s => generator = s);

  async function _onClick(ev: Event): Promise<void> {
    ev.stopPropagation();
    ev.preventDefault();
    if ($currentMusic) {
      pause();
      isPaused = true;
      // $soundAndMusicMixer.stopMusic();
    } else {
      play();
      isPaused = false;
      // await $soundAndMusicMixer.playMusic();
    }
  }

  async function play(): Promise<void> {
    console.log("Loading");
    const aiSolos = await generator.triggerSampleGeneration();

    let guitarPart = new Tone.Part((time, note) => {
      guitarSampler.triggerAttackRelease(note, 4.0, time);
    }, guitarPatterns).start();
    guitarPart.loop = true;
    guitarPart.loopStart = 0;
    let guitarLoopLength = '8';
    guitarPart.loopEnd = guitarLoopLength;

    // let pianoPart = new Tone.Part((time, note) => {
    //   chordSampler.triggerAttackRelease(note, 4.0, time);
    // }, chordPatterns).start();
    // pianoPart.loop = true;
    // pianoPart.loopStart = 0;
    // let pianoLoopLength = '8';
    // pianoPart.loopEnd = pianoLoopLength;

    let aiPartIndex = 0;

    // Guitar
    Tone.Transport.scheduleRepeat(
      function (time) {
        if (aiPartIndex < aiSolos[0].length) {
          const aiSoloPart = aiSolos[0][aiPartIndex];
          guitarPart.clear();
          guitarLoopLength = '16';
          for (let i = 0; i < aiSoloPart.length; i++) {
            guitarPart.at(aiSoloPart[i][0], aiSoloPart[i][1]);
          }
          aiPartIndex = aiPartIndex + 1;
        }
        console.log(aiPartIndex);
      },
      "8:0:0",
      "8:0:0"
    );
    // Chords
    // Tone.Transport.scheduleRepeat(
    //   function (time) {
    //     if (aiPartIndex < aiSolos[1].length) {
    //       const aiSoloPart = aiSolos[1][aiPartIndex];
    //       pianoPart.clear();
    //       pianoLoopLength = '16';
    //       for (let i = 0; i < aiSoloPart.length; i++) {
    //         pianoPart.at(aiSoloPart[i][0], aiSoloPart[i][1]);
    //       }
    //       aiPartIndex = aiPartIndex + 1;
    //     }
    //     console.log(aiPartIndex);
    //   },
    //   "8:0:0",
    //   "8:0:0"
    // );

    generator.loadLoops();

    await Tone.loaded().then(() => {
      console.log("Loaded");
      Tone.start();
      currentMusic.set(true);
    });
    Tone.Transport.bpm.value = 90;
    Tone.Transport.start();
    Tone.context.lookAhead = 0.5;
  }

  async function pause(): Promise<void> {
    await Tone.loaded();
    Tone.Transport.stop();
    currentMusic.set(false);
  }
</script>

<div class="host" in:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}">
  <div class="controlWrapper" style="fill: {color}; color: {color}">
    {#if typeof $currentMusic !== 'boolean' && $currentMusic?.title}
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