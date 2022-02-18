<script lang="ts">
  export let name = 'loud';
  export let size = '80';

  const promise = loadSvg(name);

  async function loadSvg(src: string): Promise<string> {
    const x = await (await (await fetch(`icons/${src}.svg`, { cache: 'force-cache' })).blob()).text();
    return x.replace('<svg ', '<svg width="' + size + '" height="' + size + '" ') ;
  }
</script>

{#await promise}
  <div style={`width: ${size}px; height: ${size}px;`}></div>
{:then icon}
  {@html icon}
{/await}