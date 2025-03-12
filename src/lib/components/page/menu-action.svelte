<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { CirclePlus } from 'lucide-svelte';
	import OtherOptionDialog from '../../../routes/(app)/menu-services/other-option-dialog.svelte';
	import MenuActionFormDialog from './menu-action-form-dialog.svelte';
	import Input from '../ui/input/input.svelte';
	import Label from '../ui/label/label.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import * as RadioGroup from '../ui/radio-group/index.js';
	import type {
		CurrentMenu,
		MenuActionSchema,
		UserData
	} from '../../../routes/(app)/menu-services/menu-schema';

	let {
		data,
		openMenuAction = $bindable(),
		openOtherOptionDialog = $bindable(),
		currentMenu
	}: {
		data: MenuActionSchema[];
		openMenuAction: boolean;
		openOtherOptionDialog: boolean;
		currentMenu?: CurrentMenu;
	} = $props();

	const isAdminPage = page.url.pathname.includes('/admin');
	let openFormDialog: boolean = $state(false);

	let userData: UserData = $state({
		name: undefined!,
		nim: undefined,
		type: 'EXTERNAL'
	});

	const isUserDataFilled = $derived.by(() => {
		if (userData.type === 'STUDENT') {
			return Object.values(userData).every((value) => value !== undefined);
		}
		return false;
	});

	let menuAction: string | undefined = $state(undefined);
</script>

<Dialog.Root
	bind:open={openMenuAction}
	onOpenChange={(open) => {
		if (!open) {
			userData = {
				name: undefined!,
				nim: undefined,
				type: 'EXTERNAL'
			};
		}
	}}
>
	<Dialog.Content>
		{#if data.length > 0 || isAdminPage}
			{#if !isAdminPage}
				<Dialog.Title class="text-base font-semibold">
					Mohon untuk mengisi data identitas anda dibawah ini !
				</Dialog.Title>

				<RadioGroup.Root bind:value={userData.type}>
					<div class="flex gap-x-4">
						<div class="flex items-center gap-x-2">
							<RadioGroup.Item value="EXTERNAL" id="r1" />
							<Label for="r1" class="cursor-pointer">Umum</Label>
						</div>
						<div class="flex items-center gap-x-2">
							<RadioGroup.Item value="STUDENT" id="r2" />
							<Label for="r2" class="cursor-pointer">Mahasiswa Aktif</Label>
						</div>
					</div>
				</RadioGroup.Root>

				<div class="grid {userData.type === 'STUDENT' ? 'grid-cols-2' : ''}  gap-4">
					<div class="flex flex-col gap-2">
						<div>
							<Label class="font-semibold">Nama Anda</Label>
							<span class="text-red-600">*</span>
						</div>
						<Input placeholder="Silahkan mengisi Nama anda" bind:value={userData.name} />
					</div>
					{#if userData.type === 'STUDENT'}
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
			{/if}

			<Dialog.Title class="text-base font-semibold">
				Silahkan memilih permasalahan yang anda alami !
			</Dialog.Title>

			<div class="flex flex-wrap justify-center gap-4">
				{#each data as menu}
					<Button
						disabled={(userData.type === 'STUDENT' && !isUserDataFilled) ||
							(userData.type === 'EXTERNAL' && !userData.name)}
						class="max-w-full flex-grow bg-primary px-4 py-2"
						onclick={() => {
							if (menu.type === 'LINK') {
								window.open(menu.link, '_blank');
							} else {
								menuAction = menu.name;

								openMenuAction = false;
								openOtherOptionDialog = true;
							}
						}}
					>
						{menu.name}
					</Button>
				{/each}
				<Button
					disabled={(userData.type === 'STUDENT' && !isUserDataFilled) ||
						(userData.type === 'EXTERNAL' && !userData.name)}
					variant="ghost"
					class="max-w-full flex-grow border px-4 py-2"
					onclick={() => {
						openMenuAction = false;
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
							openMenuAction = false;
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
	<OtherOptionDialog bind:open={openOtherOptionDialog} {currentMenu} {userData} {menuAction} />
	<MenuActionFormDialog bind:openFormDialog menuId={currentMenu.id} />
{/if}
