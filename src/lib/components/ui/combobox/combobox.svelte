<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import type { ComboboxType } from '.';

	let {
		items,
		placeholder,
		selectedData = $bindable(undefined),
		onchange
	}: {
		items: ComboboxType[];
		placeholder: string;
		selectedData?: ComboboxType;
		onchange?: () => void;
	} = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	let value = $state(selectedData?.value.toString() || '');

	$effect(() => {
		if (selectedData && selectedData.value.toString() !== value) {
			value = selectedData.value.toString();
		}
	});

	const selectedValue = $derived.by(() => {
		if (value) {
			return items.find((f) => f.value.toString() === value)?.label;
		}
	});

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class="w-auto justify-between"
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				<Label class="text-sm font-normal text-slate-500">
					{selectedValue || placeholder}
				</Label>
				<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<Command.Root>
			<Command.Input>
				<Label class="text-xl font-normal">
					{placeholder}
				</Label>
			</Command.Input>
			<Command.List>
				<Command.Empty>No Data found.</Command.Empty>
				<Command.Group>
					{#each items as item}
						<Command.Item
							value={item.label}
							onSelect={() => {
								value = item.value.toString();
								selectedData = item;
								closeAndFocusTrigger();
								if (onchange) {
									onchange();
								}
							}}
						>
							<Check
								class={cn('mr-2 size-4', value !== item.value.toString() && 'text-transparent')}
							/>
							<Label class="text-sm font-normal">
								{item.label}
							</Label>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
