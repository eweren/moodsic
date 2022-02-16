import sveltePreprocess from 'svelte-preprocess'
import svelteSVG from "vite-plugin-svelte-svg";

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess(),
  kit: {
    vite: {
      plugins: [
        svelteSVG({
          svgoConfig: {}, // See https://github.com/svg/svgo#configuration
        }),
      ],
    },
  },
}
