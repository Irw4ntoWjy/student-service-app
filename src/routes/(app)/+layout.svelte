<script lang="ts">
	import { navigating, page } from '$app/state';
	import PageLoader from '$lib/components/page/page-loader.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { type Snippet } from 'svelte';
	import AppSidebar from '$lib/components/page/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import src from '$lib/assets/UPH-White.png';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
	const hasAdditionalPath = $derived(
		() => page.url.pathname !== '/' && !(page.url.pathname === '/admin')
	);
	const queuePath = $derived(
		() => page.url.pathname === '/queue-ticket' || page.url.pathname === '/login'
	);

	let isLoading: boolean = $state(false);
	$inspect(data.user);
</script>

<Toaster richColors />

{#if page.url.pathname.includes('/admin')}
	<Sidebar.Provider>
		<AppSidebar />

		<!-- Site header -->
		<div class="flex w-full flex-col">
			<header class="flex h-[3.688rem] w-full items-center bg-primary">
				<Sidebar.Trigger />
				<a href="/" class="ml-6 transition-opacity hover:opacity-75">
					<img alt="uph-logo" {src} class="h-[2.625rem] w-[8.375rem]" />
				</a>
				<div class=" flex flex-1 justify-end">
					<span class="mr-12 font-semibold text-slate-100">Welcome, {data.user?.userName}</span>
				</div>
			</header>

			<main
				id="main"
				class="scroll-smooth {queuePath() ? 'h-screen bg-primary' : 'h-[calc(100vh-3.688rem)]'}"
			>
				<div class="grid p-4 xl:space-x-6 2xl:grid-cols-[1fr,auto]">
					{#if navigating.type && !isLoading}
						<PageLoader bind:isLoading />
					{:else}
						{@render children()}
					{/if}
				</div>
			</main>
		</div>
	</Sidebar.Provider>
{:else}
	{#if hasAdditionalPath() && !queuePath()}
		<!-- Site header -->
		<header class="flex h-[3.688rem] w-full items-center bg-primary">
			<a href="/" class="ml-6 transition-opacity hover:opacity-75">
				<img alt="uph-logo" {src} class="h-[2.625rem] w-[8.375rem]" />
			</a>
		</header>
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
{/if}
