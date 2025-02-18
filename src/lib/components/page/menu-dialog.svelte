<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { CirclePlus } from 'lucide-svelte';
	import type { MenuDialogSchema } from '../../../routes/(app)/menu-services/menu-schema';
	import OtherOptionDialog from '../../../routes/(app)/menu-services/other-option-dialog.svelte';
	import MenuActionFormDialog from './menu-action-form-dialog.svelte';
	import Input from '../ui/input/input.svelte';
	import Label from '../ui/label/label.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import * as RadioGroup from '../ui/radio-group/index.js';

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

	let userData: {
		name: string | undefined;
		nim: string | undefined;
		status: 'GENERAL' | 'ACTIVE';
	} = $state({
		name: undefined,
		nim: undefined,
		status: 'GENERAL'
	});

	const isUserDataFilled = $derived.by(() => {
		if (userData.status === 'ACTIVE') {
			return Object.values(userData).every((value) => value !== undefined);
		}
		return false;
	});
</script>

<Dialog.Root bind:open={openMenuDialog}>
	<Dialog.Content>
		{#if menuDialog.length > 0 || isAdminPage}
			<Dialog.Title class="text-base font-semibold">
				Mohon untuk mengisi data identitas anda dibawah ini !
			</Dialog.Title>

			<RadioGroup.Root bind:value={userData.status}>
				<div class="flex gap-x-4">
					<div class="flex items-center gap-x-2">
						<RadioGroup.Item value="GENERAL" id="r1" />
						<Label for="r1" class="cursor-pointer">Umum</Label>
					</div>
					<div class="flex items-center gap-x-2">
						<RadioGroup.Item value="ACTIVE" id="r2" />
						<Label for="r2" class="cursor-pointer">Mahasiswa Aktif</Label>
					</div>
				</div>
			</RadioGroup.Root>

			<div class="grid {userData.status === 'ACTIVE' ? 'grid-cols-2' : ''}  gap-4">
				<div class="flex flex-col gap-2">
					<div>
						<Label class="font-semibold">Nama Anda</Label>
						<span class="text-red-600">*</span>
					</div>
					<Input placeholder="Silahkan mengisi Nama anda" bind:value={userData.name} />
				</div>
				{#if userData.status === 'ACTIVE'}
					<div class="flex flex-col gap-2">
						<div>
							<Label class="font-semibold">NIM Anda</Label>
							<span class="text-red-600">*</span>
						</div>
						<Input placeholder="Silahkan mengisi NIM anda" bind:value={userData.nim} />
					</div>
				{/if}
			</div>

			<Separator />
			<Dialog.Title class="text-base font-semibold">
				Silahkan memilih permasalahan yang anda alami !
			</Dialog.Title>

			<div class="flex flex-wrap justify-center gap-4">
				{#each menuDialog as menu}
					<Button
						disabled={(userData.status === 'ACTIVE' && !isUserDataFilled) ||
							(userData.status === 'GENERAL' && !userData.name)}
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
	<OtherOptionDialog bind:open={openOtherOptionDialog} bind:userData menu={currentMenu} />
	<MenuActionFormDialog bind:openFormDialog menuId={currentMenu.id} />
{/if}
