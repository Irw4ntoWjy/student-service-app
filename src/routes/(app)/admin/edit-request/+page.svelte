<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import type { PageProps } from './$types';
	import StaffApprovalCard from './staff-approval-card.svelte';

	let { data }: PageProps = $props();

	const menuRequest = $derived.by(() => {
		return data.changeRequest
			.filter((items) => items.type === 'MENU')
			.map((items) => items.changeJson);
	});

	const menuDetailRequest = $derived.by(() => {
		return data.changeRequest
			.filter((items) => items.type === 'MENU_DETAIL')
			.map((items) => items.changeJson);
	});

	const staffRequest = $derived.by(() => {
		return data.changeRequest.filter((items) => items.type === 'STAFF_LIST');
	});
</script>

<Tabs.Root value="menu">
	<Tabs.List>
		<Tabs.Trigger value="menu" class="w-[150px]">List Menu</Tabs.Trigger>
		<Tabs.Trigger value="staff" class="w-[150px]">List Staff</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="menu">
		{#each menuRequest as menu}
			<div class="flex flex-col gap-2">
				<span>{menu.name}</span>
				<span>{menu.description}</span>
			</div>
		{/each}

		{#each menuDetailRequest as detail}
			<div class="flex flex-col gap-2">
				<span>{detail.name}</span>
				<span>{detail.description}</span>
			</div>
		{/each}
	</Tabs.Content>

	<Tabs.Content value="staff" class="w-full">
		<div class="flex gap-4 py-4">
			{#each staffRequest as staff}
				<div class="flex flex-col gap-2">
					<StaffApprovalCard item={staff} staffList={data.staffList} role={data.user?.role} />
				</div>
			{/each}
		</div>
	</Tabs.Content>
</Tabs.Root>
