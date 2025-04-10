<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils';
	import { ArrowRight } from 'lucide-svelte';
	import Badge, { type BadgeVariant } from '../ui/badge/badge.svelte';

	let {
		title,
		description,
		src,
		onClick,
		badge
	}: {
		title: string;
		description: string;
		src?: string | undefined;
		onClick?: () => void;
		badge?: { title: string; variant: BadgeVariant };
	} = $props();

	function handleKeyDown(event: KeyboardEvent) {
		if (onClick && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			onClick();
		}
	}
</script>

<Card.Root
	onclick={onClick}
	onkeydown={handleKeyDown}
	role="button"
	class={cn(
		'group h-[340px] w-[400px] overflow-hidden',
		'transition-all duration-500 ease-out hover:shadow-lg',
		'bg-white backdrop-blur-md dark:bg-black/20',
		'border border-neutral-200/50 dark:border-white/10'
	)}
>
	<div class="relative h-[205px] w-full">
		<img
			{src}
			alt={title}
			class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
			loading="lazy"
		/>
		{#if badge}
			<div class="absolute left-2 top-2">
				<Badge variant={badge.variant} class="px-2 py-1">{badge.title}</Badge>
			</div>
		{/if}
		<Card.Content class="flex h-[135px] flex-col p-6">
			<Card.Title
				class=" text-base font-medium text-gray-900 transition-all duration-300 group-hover:text-black dark:text-gray-100 dark:group-hover:text-white"
			>
				{title}
			</Card.Title>

			<Card.Description
				class=" text-sm text-gray-500 transition-all duration-300 dark:text-gray-400"
			>
				{description}
			</Card.Description>

			<div
				class="mt-auto flex translate-y-2 transform items-center justify-end text-sm text-gray-700 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:text-gray-300"
			>
				<span class="mr-1 font-medium">Learn more</span>
				<ArrowRight size={16} class="transition-transform group-hover:translate-x-1" />
			</div>
		</Card.Content>
	</div></Card.Root
>
