<script lang="ts">
	import { fly } from 'svelte/transition';
  import { DEFAULT_TRANSITION_DISTANCE, DEFAULT_TRANSITION_DURATION } from '../utils/constants';

  export let show = false;
  export let showInput = false;

  let feedbackIcon: any;
  let title = "";
  let description = "";
  let success = false;
  let feedbackTransmitted = false;

  function playFeedback(): void {
    feedbackIcon?.setDirection(1);
    feedbackIcon?.play();
  }

  function completeFeedbackAnimation(): void {
    feedbackIcon?.stop();
    feedbackIcon?.seek('0%');
  }

  function stopFeedback(): void {
    feedbackIcon?.setDirection(-1);
  }

  async function sendFeedback(): Promise<void> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const body = JSON.stringify({
      "title": title,
      "description": description ?? ''
    });
    const requestOptions = {
      method: 'POST',
      headers,
      body
    };

    const res = await fetch("https://servicebridge.thearc.dev/moodsic", requestOptions)
      .then(response => response.text()).catch(() => {success = false})
    feedbackTransmitted = true;
    if (res === "true") {
      success = true;
    }
  }
</script>

<div id="errorPlayer" on:click|stopPropagation>
  {#if showInput && !feedbackTransmitted}
    <div class="contentBox" in:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}">
      <div class="close" on:click|stopPropagation|preventDefault={() => showInput = false}>X</div>
      <label>
        Title:
        <input placeholder="What's your feedback?" type="text" bind:value={title} />
      </label>
      <label>
        Description:
        <input placeholder="Little description please." type="text" bind:value={description} />
      </label>
      <button disabled={title.length < 4} type="button" on:click|preventDefault|stopPropagation={() => sendFeedback()}>Send feedback!</button>
    </div>
    {:else if showInput && success}
      <div class="contentBox">
        Thanks for your feedback!
        <button type="button" on:click|preventDefault|stopPropagation={() => {showInput = false; success = undefined;}}>Okay!</button>
      </div>
    {:else if showInput && !success}
      <div class="contentBox">
        An error occured.
        <button type="button" on:click|preventDefault|stopPropagation={() => {success = undefined; feedbackTransmitted = false;}}>Yuck!</button>
      </div>
    {:else if show}
      <div class="lottie" title="Feedback or music wishes?" on:click|stopPropagation={() => {showInput = true; success = false;feedbackTransmitted = false;}} in:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}" out:fly="{{ y: DEFAULT_TRANSITION_DISTANCE, duration: DEFAULT_TRANSITION_DURATION }}">
        <lottie-player
        bind:this={feedbackIcon}
        on:mouseenter={() => playFeedback()}
        on:mouseleave={() => stopFeedback()}
        on:complete={() => completeFeedbackAnimation()}
          mode="normal"
          preserveAspectRatio='xMidYMid meet'
          renderer="svg"
          src="error.json">
      </lottie-player></div>
    {/if}
</div>

<style>
  #errorPlayer {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 5;
  }
  .lottie {
    position: absolute;
    bottom: 0;
    right: 0;
    width: var(--size-14);
    height: var(--size-14);
    cursor: pointer;
  }
  .contentBox {
    position: absolute;
    color: white;
    bottom: 0;
    width: 150px;
    right: 0;
    display: flex;
    flex-direction: column;
    font-size: var(--size-3);
    gap: var(--size-2);
    padding: var(--size-4);
    background: var(--color-grey-900);
    transition: opacity 0.3s var(--easing-standard);
    box-shadow: 4px 4px 0px 0px var(--color-green-500);
  }
  .contentBox .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: var(--size-2);
    cursor: pointer;
  }
  .contentBox label {
    color: white;
  }
  .contentBox input[type='text'] {
    margin-top: var(--size-2);
    border: 2px solid var(--color-green-500);
    padding: var(--size-1);
    background: var(--color-grey-800);
    color: white;
    outline: none;
    box-shadow: 0px 0px 0px 0px var(--color-green-500);
    transition: box-shadow 0.1s ease-in-out;
  }
  .contentBox input[type='text']:focus-visible {
    box-shadow: 2px 2px 0px 0px var(--color-green-500);
  }
  .contentBox button {
    margin-top: var(--size-2);
    border: 2px solid var(--color-green-500);
    padding: var(--size-1);
    background: var(--color-grey-800);
    box-shadow: 0px 0px 0px 0px var(--color-green-500);
    color: white;
    outline: none;
    transition: box-shadow 0.1s ease-in-out;
    cursor: pointer;
  }
  .contentBox button:hover, .contentBox button:focus {
    box-shadow: 1px 1px 0px 0px var(--color-green-500);
  }
  .contentBox button:active {
    box-shadow: 2px 2px 0px 0px var(--color-green-500);
  }
  .contentBox button:disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: default;
  }
</style>

