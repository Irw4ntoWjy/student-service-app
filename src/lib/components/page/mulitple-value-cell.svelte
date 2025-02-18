<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ClassArray, ClassDictionary } from 'clsx';

	type MultipleValueType = {
		title?: string;
		titleClass?: string;
		icon?: Icon;
		iconColor?: string;
		value: string;
		class?: string;
		customDivClass?: string | ClassArray | ClassDictionary;
	};
	let { object }: { object: MultipleValueType[] } = $props();
</script>

<div class="grid gap-1">
	{#each object as item}
		<div class={cn('flex items-center gap-2', item.customDivClass)}>
			{#if item.icon}
				{@const CustomIcon = Icons[item.icon]}
				<CustomIcon class="mr-2.5 h-4 w-4 {item.iconColor}" />
			{/if}
			{#if item.title}
				<span class={item.titleClass}>
					{#if item.title.substring(0, 3) !== 'en.' && item.title.substring(0, 3) !== 'id.'}
						{item.title}
					{:else}
						{item.title}
					{/if}
				</span>
			{/if}
			{#if item.value.length > 0}
				<span
					class={item.class
						? item.class
						: 'text-sm font-light text-slate-700 dark:text-card-foreground'}
				>
					{item.value}
				</span>
			{/if}
		</div>
	{/each}
</div>
