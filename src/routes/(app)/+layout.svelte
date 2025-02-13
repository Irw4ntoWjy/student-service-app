<script lang="ts">
	import { navigating, page } from '$app/state';
	import PageLoader from '$lib/components/page/page-loader.svelte';
	import SiteHeader from '$lib/components/page/site-header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { type Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
	const hasAdditionalPath = $derived(
		() => page.url.pathname !== '/' && !(page.url.pathname === '/admin')
	);
	const queuePath = $derived(
		() => page.url.pathname === '/queue-ticket' || page.url.pathname === '/login'
	);

	let isLoading: boolean = $state(false);
</script>

<Toaster richColors />
{#if hasAdditionalPath() && !queuePath()}
	<SiteHeader />
{/if}

<main
	id="main"
	class="scroll-smooth {queuePath() ? 'h-screen bg-primary' : 'h-[calc(100vh-3.688rem)]'}"
>
	<div class="grid xl:space-x-6 2xl:grid-cols-[1fr,auto]">
		<div
			class="order-last xl:order-first {hasAdditionalPath() && page.url.pathname !== '/login'
				? 'p-4'
				: ''}"
		>
			{#if navigating.type && !isLoading}
				<PageLoader bind:isLoading />
			{:else}
				{@render children()}
			{/if}
		</div>
	</div>
</main>
