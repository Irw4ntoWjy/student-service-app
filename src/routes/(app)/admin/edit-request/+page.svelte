<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import type { PageProps } from './$types';
	import MenuApprovalCard from './menu-approval-card.svelte';
	import MenuDetailApprovalCard from './menu-detail-approval-card.svelte';
	import StaffApprovalCard from './staff-approval-card.svelte';

	let { data }: PageProps = $props();

	const menuRequest = $derived.by(() => {
		return data.changeRequest.filter((items) => items.type === 'MENU');
	});

	const menuDetailRequest = $derived.by(() => {
		return data.changeRequest.filter((items) => items.type === 'MENU_DETAIL');
	});

	const staffRequest = $derived.by(() => {
		return data.changeRequest.filter((items) => items.type === 'STAFF_LIST');
	});
</script>

<Tabs.Root value="menu">
	<Tabs.List>
		<Tabs.Trigger value="menu" class="w-[150px]">
			<span>List Menu</span>
			{#if menuRequest.length > 0}
				<span
					class="ml-auto flex items-center rounded-full bg-destructive px-1.5 py-0.5 text-xs text-slate-50"
					>{menuRequest.length}</span
				>
			{/if}
		</Tabs.Trigger>

		<Tabs.Trigger value="menu_detail" class="flex w-[175px] items-center">
			<span>List Menu Action</span>
			{#if menuDetailRequest.length > 0}
				<span
					class="ml-auto flex items-center rounded-full bg-destructive px-1.5 py-0.5 text-xs text-slate-50"
					>{menuDetailRequest.length}</span
				>
			{/if}
		</Tabs.Trigger>

		<Tabs.Trigger value="staff" class="flex w-[150px] items-center">
			<span>List Staff</span>
			{#if staffRequest.length > 0}
				<span
					class="ml-auto flex items-center rounded-full bg-destructive px-1.5 py-0.5 text-xs text-slate-50"
					>{staffRequest.length}</span
				>
			{/if}
		</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="menu">
		<div class="flex gap-4 py-4">
			{#each menuRequest as menu}
				<div class="flex flex-col gap-2">
					<MenuApprovalCard item={menu} menuList={data.menuList} role={data.user?.role} />
				</div>
			{/each}
		</div>
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

	<Tabs.Content value="menu_detail" class="w-full">
		<div class="flex gap-4 py-4">
			{#each menuDetailRequest as menuDetail}
				<div class="flex flex-col gap-2">
					<MenuDetailApprovalCard
						item={menuDetail}
						menuDetail={data.menuDetailList}
						role={data.user?.role}
					/>
				</div>
			{/each}
		</div>
	</Tabs.Content>
</Tabs.Root>
