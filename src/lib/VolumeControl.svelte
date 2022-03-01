<script lang="ts">
	import { onMount } from 'svelte';
  import { soundAndMusicMixer } from './stores';
  import Slider from './Slider.svelte';

  export let src: string = undefined;
  export let label = '';
  export let color = '#FFF';
  export let volume = 0;
  export let title = '';

  onMount(() => {
    volume = src == null ? $soundAndMusicMixer.musicVolume : 0;
  });

  function _onVolumeChange(event: any): void {
    const soundToChange = $soundAndMusicMixer.sounds.find((v) => v.src === src);
    if (event.detail != null && soundToChange && src) {
      volume = event.detail;
      $soundAndMusicMixer.setVolume(event.detail, src);
    } else if (event.detail != null && !src) {
      $soundAndMusicMixer.setVolume(event.detail);
    }
  }
</script>

<div class="control" title={title}>
  <Slider color={color} label={label} value={volume} on:valueChange={_onVolumeChange} />
</div>

<style>
  .control {
    padding: var(--size-2) var(--size-3);
    display: flex;
    border-radius: 500px;
    align-items: center;
    justify-content: center;
  }
</style>