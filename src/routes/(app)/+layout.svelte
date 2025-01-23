<script lang="ts">
	import { page } from '$app/state';
	import SiteHeader from '$lib/components/page/site-header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const hasAdditionalPath = $derived(() => page.url.pathname !== '/');
	const queuePath = $derived(() => page.url.pathname === '/queue-ticket');
</script>

<Toaster richColors />
{#if hasAdditionalPath() && !queuePath()}
	<SiteHeader />
{/if}
<main
	id="main"
	class="scroll-smooth {queuePath() ? 'bg-primary h-screen' : 'h-[calc(100vh-3.688rem)]'}"
>
	<div class="grid xl:space-x-6 2xl:grid-cols-[1fr,auto]">
		<div class="order-last xl:order-first {hasAdditionalPath() ? 'p-4' : ''}">
			{@render children()}
		</div>
	</div>
</main>
