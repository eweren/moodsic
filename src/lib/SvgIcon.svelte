<script lang="ts">
    export let name = 'loud';
    export let width = '80';
    export let height = '80';
    const promise = loadSvg(name);

    async function loadSvg(src: string): Promise<string> {
      const x = await (await (await fetch(`icons/${src}.svg`, { cache: 'force-cache' })).blob()).text();
      return x.replace('<svg ', '<svg width="' + width + '" height="' + height + '" ') ;
    }
</script>

{#await promise}
  <div style={`width: ${width}px; height: ${height}px;`}></div>
{:then icon}
    {@html icon}
{/await}