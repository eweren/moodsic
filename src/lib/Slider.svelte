<script lang="ts">
import { createEventDispatcher } from 'svelte';


  export let value = 1;
  export let label = 'Music';
  export let color = '#FFF';
  const dispatch = createEventDispatcher();

  function onValueChange(event: any): void {
    if (event && event.target?.value != null) {
      value = event.target.value;
      dispatch('valueChange', value);
    }
  }
</script>

<label class="host" style={`color: ${color}`}>{label}
  <input style={`color: ${color}; borderColor: ${color}`} on:click|preventDefault|stopPropagation class={`slider ${+value === 0 ? 'offSlider' : ''}`} type="range" min="0" max="1" step="0.01" bind:value on:input|preventDefault={onValueChange} />
</label>

<style>
.host {
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 4px 0;
  gap: var(--scale-00);
}
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  background: transparent;
  border: 1px solid;
  outline: none;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.offSlider {
    opacity: 0.5;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: currentColor;
  cursor: pointer;
  box-shadow: 2px 2px 0px 0px var(--color-green-500);
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  background: currentColor;
  cursor: pointer;
  box-shadow: 2px 2px 0px 0px var(--color-green-500);
}
</style>