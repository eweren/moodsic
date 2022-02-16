<script lang="ts">
  import '../lottie-player.js';
	import { fade } from 'svelte/transition';

  let feedbackIcon: any;

  function playFeedback() {
    feedbackIcon?.setDirection(1);
    feedbackIcon?.play();
  }

  function completeFeedbackAnimation() {
    feedbackIcon?.stop();
    feedbackIcon?.seek('0%');
  }

  function stopFeedback() {
    feedbackIcon?.setDirection(-1);
  }
</script>

<a id="errorPlayer" title="Feedback or music wishes?" href="https://sthearc.slack.com/archives/C031R4QERAQ" transition:fade="{{duration: 400}}">
  <lottie-player
  bind:this={feedbackIcon}
  on:mouseenter={() => playFeedback()}
  on:mouseleave={() => stopFeedback()}
  on:complete={() => completeFeedbackAnimation()}
    mode="normal"
    preserveAspectRatio='xMidYMid meet'
    renderer="svg"
    src="error.json">
</lottie-player></a>

<style>
  #errorPlayer {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: var(--size-14);
    height: var(--size-14);
    z-index: 5;
    cursor: pointer;
  }
</style>

