<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Dot, Eye, Pencil, Trash2 } from 'lucide-svelte';
	import { type Snippet } from 'svelte';

	type CustomIcon = 'Eye' | 'Pencil' | 'Trash2' | 'Ellipsis';

	type SingleEventType = Extract<CustomIcon, 'Eye' | 'Pencil' | 'Trash2'>;
	type DropDownEventType = Exclude<CustomIcon, SingleEventType>;

	type SingleEventSnippet = Snippet<
		[onClick: ClickEvent, requireDetail?: boolean, disabled?: boolean]
	>;

	type SingleEventAction = Record<SingleEventType, SingleEventSnippet>;

	type DropdownMenuAction = {
		name: string;
		className?: string;
		icon?: CustomIcon;
		action: () => void;
	};

	type ClickEvent = () => void;

	type ActionProps = {
		single?: Partial<
			Record<SingleEventType, { onClick: ClickEvent; requireDetail?: boolean; disabled?: boolean }>
		>;
		dropdown?: Partial<Record<DropDownEventType, DropdownMenuAction[]>>;
	};

	const singleSnippetRender: SingleEventAction = {
		Eye: eyeSnippet,
		Pencil: pencilSnippet,
		Trash2: trash2Snippet
	};

	let actions: ActionProps = $props();
</script>

{#snippet eyeSnippet(onClick: ClickEvent, requireDetail?: boolean, disabled?: boolean)}
	{#if !disabled}
		<Button
			variant="ghost"
			class="relative ml-2 inline-flex h-8 w-8 border p-0 data-[state=open]:bg-muted"
			onclick={onClick}
		>
			{#if requireDetail}
				<Dot class="absolute right-0 top-[-3px] h-2 w-2 transform text-destructive" />
			{/if}
			<Eye class="h-4 w-4 text-primary" />
		</Button>
	{/if}
{/snippet}

{#snippet pencilSnippet(onClick: ClickEvent, requireDetail?: boolean, disabled?: boolean)}
	{#if !disabled}
		<Button
			variant="outline"
			class="relative inline-flex h-8 w-8 bg-primary-foreground p-0 text-primary hover:bg-primary hover:text-primary-foreground data-[state=open]:bg-muted"
			onclick={onClick}
		>
			{#if requireDetail}
				<Dot class="absolute right-0 top-[-3px] h-2 w-2 text-destructive" />
			{/if}
			<Pencil class="h-4 w-4" />
		</Button>
	{/if}
{/snippet}

{#snippet trash2Snippet(onClick: ClickEvent, requireDetail?: boolean, disabled?: boolean)}
	{#if !disabled}
		<Button
			variant="secondary"
			class="relative inline-flex h-8 w-8 border border-red-100 bg-red-50 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground data-[state=open]:bg-muted"
			onclick={onClick}
		>
			{#if requireDetail}
				<Dot class="absolute right-0 top-[-3px] h-2 w-2 text-destructive" />
			{/if}
			<Trash2 class="h-4 w-4" />
		</Button>
	{/if}
{/snippet}

<div class="flex gap-2 whitespace-nowrap">
	<div class="flex gap-2">
		{#each Object.entries(actions) as [type, action]}
			{#each Object.entries(action) as [key, { onClick, requireDetail, disabled }]}
				{@const singleSnippet = singleSnippetRender[key as SingleEventType]}
				{@render singleSnippet(onClick, requireDetail, disabled)}
			{/each}
		{/each}
	</div>
</div>
