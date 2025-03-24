<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import type { ChangeRequestSchema } from '$lib/server/sql/change-request-query';
	import { Check, Eye, EyeClosed, X } from 'lucide-svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let { item }: { item: ChangeRequestSchema } = $props();

	let isEdit: boolean = $derived(!!item.changeJson.id);
	let isExpanded: boolean = $state(false);
</script>

<Card.Root
	class={cn(
		'animate-fade-in-up w-[400px] overflow-hidden p-6 transition-all duration-500 hover:shadow-md',
		isExpanded ? '' : 'h-[200px]'
	)}
>
	<Card.Header class="pb-2">
		<div class="flex items-center justify-between">
			<Badge
				variant="outline"
				class={cn(
					'change-indicator',
					isEdit ? 'bg-soft-blue text-primary' : 'bg-primary/10 text-primary'
				)}
			>
				{isEdit ? 'Edit Data' : 'New Data'}
			</Badge>
		</div>
		<div class="flex items-center justify-between">
			<div>
				<Card.Title class="mt-2 text-xl font-medium">{item.changeJson.name}</Card.Title>
				<Card.Description class="line-clamp-2">
					{item.menuName || '-'}
				</Card.Description>
			</div>
			<Button
				variant="ghost"
				size="sm"
				onclick={() => (isExpanded = !isExpanded)}
				class="hover:bg-transparent hover:text-primary"
			>
				{#if isExpanded}
					<EyeClosed class=" h-4 w-4" />
				{:else}
					<Eye class="h-4 w-4" />
				{/if}
			</Button>
		</div>
	</Card.Header>

	<Card.Content class="p-0 pb-4">
		{#if isExpanded}
			<div class="animate-fade-in space-y-4">
				{#if isEdit}
					<div class="grid grid-cols-2 gap-4">
						<div class="rounded-lg border bg-secondary/40 px-6 py-2">
							<h4 class="mb-2 text-sm font-medium text-muted-foreground">Before</h4>
							<div class="grid grid-cols-[50px_1fr] gap-2">
								<span class="text-sm">Name</span>
								<span class="cursor-help truncate text-sm" title={item.menuName}
									>{item.changeJson.name}</span
								>
							</div>
						</div>
						<div class="rounded-lg border border-primary/20 bg-primary/5 px-6 py-2">
							<h4 class="mb-2 text-sm font-medium text-muted-foreground">After</h4>
							<div class="flex flex-col gap-2">
								<div class="grid grid-cols-[50px_1fr] gap-2">
									<span class="text-sm">Name</span>
									<span class="cursor-help truncate text-sm" title={item.menuName}
										>{item.changeJson.name}</span
									>
								</div>
								<div class="grid grid-cols-[50px_1fr] gap-2">
									<span class="text-sm">Divisi</span>
									<span class="cursor-help truncate text-sm" title={item.menuName}
										>{item.menuName}</span
									>
								</div>
							</div>
						</div>
					</div>
				{:else}
					<div class="rounded-lg border border-primary/20 bg-primary/5 p-2">
						<h4 class="mb-2 text-sm font-medium text-muted-foreground">Details</h4>
						<div class="flex flex-col gap-2">
							<div class="flex justify-between gap-2">
								<span class="text-sm">Name</span>
								<span class="cursor-help truncate text-sm" title={item.menuName}
									>{item.changeJson.name}</span
								>
							</div>
							<div class="flex justify-between gap-2">
								<span class="text-sm">Divisi</span>
								<span class="cursor-help truncate text-sm" title={item.menuName}
									>{item.menuName}</span
								>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</Card.Content>

	<Separator />
	<Card.Footer class="flex w-full justify-between p-0 pt-4">
		<Button
			variant="outline"
			size="sm"
			class="border-reject-red text-reject-red hover:bg-reject-red/10 flex items-center"
		>
			<X class="mr-1 h-4 w-4" />
			Reject
		</Button>

		<Button size="sm" class="bg-approval-green hover:bg-approval-green/90 flex items-center">
			<Check class="mr-1 h-4 w-4" />
			Approve
		</Button>
	</Card.Footer>
</Card.Root>
