<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { CirclePlus } from 'lucide-svelte';
	import OtherOptionDialog from '../../../routes/(app)/menu-services/other-option-dialog.svelte';
	import type { MenuDialogSchema } from '../../../routes/(app)/admin/admin-schema';

	let {
		openMenuDialog = $bindable(),
		openOtherOptionDialog = $bindable(),
		menuDialog
	}: {
		openMenuDialog: boolean;
		openOtherOptionDialog: boolean;
		menuDialog: MenuDialogSchema[];
	} = $props();

	const isAdminPage = page.url.pathname.includes('/admin');
</script>

<Dialog.Root bind:open={openMenuDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-lg font-bold">Pilih Permasalahan yang anda alami</Dialog.Title>
			<Dialog.Description class="text-sm text-gray-500">
				Pilih opsi yang tersedia dibawah untuk menyelesaikan permasalahan anda
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-wrap justify-center gap-4">
			{#if menuDialog}
				{#each menuDialog as menu}
					<Button
						class="max-w-full flex-grow bg-primary px-4 py-2"
						onclick={() => {
							if (menu.type === 'FORM') {
								window.open(menu.link, '_blank');
							} else {
								openOtherOptionDialog = true;
							}
						}}
					>
						{menu.name}
					</Button>
				{/each}
			{/if}

			{#if isAdminPage}
				<Button variant="ghost" class="max-w-full flex-grow border px-4 py-2">
					<CirclePlus />
					<span>Tambah</span>
				</Button>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>

<OtherOptionDialog bind:open={openOtherOptionDialog} />
