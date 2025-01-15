<script lang="ts">
	import { page } from '$app/state';
	import SiteHeader from '$lib/components/page/site-header.svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const hasAdditionalPath = $derived(() => page.url.pathname !== '/');
</script>

{#if hasAdditionalPath()}
	<SiteHeader />
{/if}
<main id="main" class="scroll-smooth">
	<div class="grid xl:space-x-6 2xl:grid-cols-[1fr,auto]">
		<div class="order-last xl:order-first {hasAdditionalPath() ? 'p-4' : ''}">
			{@render children()}
		</div>
	</div>
</main>
