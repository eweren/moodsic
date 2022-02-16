<script lang="ts">
  import { soundAndMusicMixer } from './stores';
	import { onMount } from 'svelte';
import Slider from './Slider.svelte';

  export let src: string = undefined;
  export let label = '';
  export let color = '#FFF';
  export let volume = 0;

  onMount(() => {
    volume = src == null ? $soundAndMusicMixer.musicVolume : 0;
  });

  function _onVolumeChange(event: any) {
    const soundToChange = $soundAndMusicMixer.sounds.find((v) => v.src === src);
    if (event.detail != null && soundToChange && src) {
      volume = event.detail;
      $soundAndMusicMixer.setVolume(event.detail, src);
    } else if (event.detail != null && !src) {
      $soundAndMusicMixer.setVolume(event.detail);
    }
  }
</script>
<div class="control">
  <Slider color={color} label={label} value={volume} on:valueChange={_onVolumeChange} />
</div>

<style>
  .control {
    padding: var(--size-2) var(--size-3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>