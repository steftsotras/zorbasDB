<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/zorbasicon.svg';
	
	let { children } = $props();
</script>

<svelte:head>
	<title>Zorbas DB</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
