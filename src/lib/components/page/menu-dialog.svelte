<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { CirclePlus } from 'lucide-svelte';
	import type { MenuDialogSchema } from '../../../routes/(app)/menu-services/menu-schema';
	import OtherOptionDialog from '../../../routes/(app)/menu-services/other-option-dialog.svelte';
	import MenuActionFormDialog from './menu-action-form-dialog.svelte';

	let {
		openMenuDialog = $bindable(),
		openOtherOptionDialog = $bindable(),
		menuDialog = $bindable(),
		currentMenu
	}: {
		openMenuDialog: boolean;
		openOtherOptionDialog: boolean;
		menuDialog: MenuDialogSchema[];
		currentMenu?: { id: number | undefined; name: string | undefined; code: string | undefined };
	} = $props();

	const isAdminPage = page.url.pathname.includes('/admin');
	let openFormDialog: boolean = $state(false);
</script>

<Dialog.Root bind:open={openMenuDialog}>
	<Dialog.Content>
		{#if menuDialog.length > 0 || isAdminPage}
			<Dialog.Header>
				<Dialog.Title class="text-lg font-bold">Pilih Permasalahan yang anda alami</Dialog.Title>
				<Dialog.Description class="text-sm text-gray-500">
					Pilih opsi yang tersedia dibawah untuk menyelesaikan permasalahan anda
				</Dialog.Description>
			</Dialog.Header>
			<div class="flex flex-wrap justify-center gap-4">
				{#each menuDialog as menu}
					<Button
						class="max-w-full flex-grow bg-primary px-4 py-2"
						onclick={() => {
							if (menu.type === 'FORM') {
								window.open(menu.link, '_blank');
							} else {
								openMenuDialog = false;
								openOtherOptionDialog = true;
							}
						}}
					>
						{menu.name}
					</Button>
				{/each}
				<Button
					variant="ghost"
					class="max-w-full flex-grow border px-4 py-2"
					onclick={() => {
						openMenuDialog = false;
						openOtherOptionDialog = true;
					}}
				>
					Opsi Lainnya
				</Button>
				{#if isAdminPage}
					<Button
						variant="ghost"
						class="max-w-full flex-grow border px-4 py-2"
						onclick={() => {
							openMenuDialog = false;
							openFormDialog = true;
						}}
					>
						<CirclePlus />
						<span>Tambah</span>
					</Button>
				{/if}
			</div>
		{:else}
			<div class="flex h-24 items-center justify-center">
				<p class="text-lg font-bold text-gray-700">Maaf, menu ini belum terisi !</p>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>

{#if currentMenu}
	<OtherOptionDialog bind:open={openOtherOptionDialog} menu={currentMenu} />
	<MenuActionFormDialog bind:openFormDialog menuId={currentMenu.id} />
{/if}
