<script lang="ts">
	import { debounce } from '$lib/utils';
	import { page } from '$app/state';
	import MenuCard from '$lib/components/page/menu-card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { CirclePlus, Upload, X } from 'lucide-svelte';
	import type { PageData } from './$types';
	import DataTable from '$lib/components/page/data-table/data-table.svelte';
	import { menuTable } from './config.svelte';
	import type { MenuList } from './menu-list-schema';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import MenuAction from '$lib/components/page/menu-action.svelte';

	let { data }: { data: PageData } = $props();

	//init table
	const tableState = menuTable(page.url.pathname, data.menuList);
	$effect(() => {
		tableState.updateTable = {
			data: data.menuList
		};
	});

	// Menu table state
	let openOtherOptionDialog: boolean = $state(false);

	let menuModel: MenuList = $state({
		name: undefined!,
		code: undefined!,
		description: undefined!,
		imagePath: undefined!,
		imageBase64: undefined,
		status: true
	});

	const resetModel = () => {
		menuModel = {
			name: undefined!,
			code: undefined!,
			description: undefined!,
			imagePath: undefined!,
			imageBase64: undefined,
			status: true
		};
	};

	const isFormModelFilled = () => {
		if (menuModel.name || menuModel.description || menuModel.imagePath || menuModel.imageBase64) {
			return (
				menuModel.name.trim() !== '' ||
				menuModel.description.trim() !== '' ||
				!!menuModel.imagePath ||
				!!menuModel.imageBase64
			);
		}
	};

	const isDisabled: boolean = $derived(
		!menuModel.name ||
			!menuModel.code ||
			!menuModel.description ||
			!menuModel.imagePath ||
			!menuModel.imageBase64
	);

	const convertImageToBase64 = async (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target && e.target.result) {
					resolve(e.target.result.toString());
				} else {
					reject('Error: Unable to convert file to base64');
				}
			};
			reader.onerror = () => {
				reject('Error: File reading failed');
			};
			reader.readAsDataURL(file);
		});
	};

	const onImageSelected = async (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const base64 = await convertImageToBase64(input.files[0]);

			menuModel.imageBase64 = base64;
			menuModel.imagePath = input.files[0].name;
		}
	};

	async function handleSubmit(event: Event) {
		event.preventDefault();

		const formData = new FormData();
		formData.append('id', String(menuModel.id));
		formData.append('name', menuModel.name);
		formData.append('code', menuModel.code);
		formData.append('description', menuModel.description);
		formData.append('imageBase64', menuModel.imageBase64 ?? '');
		formData.append('imagePath', menuModel.imagePath ?? '');
		formData.append('status', String(menuModel.status));

		const response = await fetch('?/submitMenu', {
			method: 'POST',
			body: formData
		});

		await invalidateAll();
		if (response.ok) {
			tableState.openEditDialog = false;
			resetModel();

			toast.success('Berhasil menambahkan/mengubah menu baru');
		} else {
			toast.error('Gagal untuk Menambahkan Menu Baru');
		}
	}

	// handle edit data
	$effect(() => {
		if (tableState.editMenuData.id) {
			menuModel = {
				id: tableState.editMenuData.id,
				name: tableState.editMenuData.name || undefined!,
				code: tableState.editMenuData.code || undefined!,
				description: tableState.editMenuData.description || undefined!,
				imagePath: `${tableState.editMenuData.imageName}`,
				imageBase64: `/uploads/${tableState.editMenuData.imageName}`,
				status: tableState.editMenuData.status
			};
		}
	});

	$effect.root(() => {
		const filter = page.url.searchParams.get('filter');
		tableState.filterValue.filter = filter || undefined;
	});
</script>

<div class="flex flex-col gap-4">
	<div class="flex justify-between">
		<div class="flex items-center gap-4">
			<Input
				class="w-fit"
				placeholder="Cari menu"
				oninput={() => debounce(() => tableState.onPaginate())}
				bind:value={tableState.filterValue.filter}
			/>

			{#if tableState.showReset}
				<Button
					onclick={() => {
						tableState.filterValue.filter = '';
						debounce(() => tableState.onPaginate());
					}}
					variant="ghost"
					class="h-8 px-2 lg:px-3"
				>
					Reset Filter
					<X class="ml-2 h-4 w-4" />
				</Button>
			{/if}
		</div>

		<Button
			class="h-10 items-center border md:w-auto"
			variant="ghost"
			onclick={() => (tableState.openEditDialog = true)}
		>
			<CirclePlus class="mr-2 h-4 w-4" /> Tambah
		</Button>
	</div>
	<DataTable table={tableState.table} />
</div>

<Dialog.Root
	bind:open={
		() => tableState.openEditDialog,
		(open) => {
			if (!open) {
				tableState.editMenuData.id = undefined;

				menuModel = {
					id: undefined!,
					name: undefined!,
					code: undefined!,
					description: undefined!,
					imagePath: undefined!,
					imageBase64: undefined!,
					status: true
				};
				tableState.openEditDialog = false;
			}
		}
	}
>
	<Dialog.Content class={isFormModelFilled() ? 'max-w-4xl' : 'max-w-lg'}>
		<Dialog.Header>
			<Dialog.Title
				>{!tableState.editMenuData.id
					? 'Tambah Menu'
					: `Ubah Menu ${tableState.editMenuData.name}`}</Dialog.Title
			>
			<Dialog.Description>
				{!tableState.editMenuData.id
					? 'Isi Data dibawah untuk menambahkan menu student services yang baru'
					: 'Ubah Data dibawah untuk mengubah data dari menu ini'}
			</Dialog.Description>
		</Dialog.Header>

		<Separator orientation="horizontal" />

		<form onsubmit={handleSubmit} method="POST" enctype="multipart/form-data">
			<div class="grid {isFormModelFilled() ? 'grid-cols-2' : 'grid-cols-1'}  gap-8">
				{#if isFormModelFilled()}
					<MenuCard
						title={menuModel.name}
						description={menuModel.description}
						{...menuModel.imageBase64 && { src: menuModel.imageBase64 }}
					/>
				{/if}

				<!-- NOTES perlu tambah limit character per input -->
				<div class="flex flex-col gap-4">
					<Input name="id" type="hidden" bind:value={menuModel.id} />
					<div class="flex flex-col gap-4">
						<Label for="name"
							>Nama Menu
							<span class="text-red-700"> * </span>
						</Label>
						<Input
							name="name"
							placeholder="Nama Menu"
							class="focus:border-gray-300 focus:outline-none focus:ring-0"
							bind:value={menuModel.name}
						/>
					</div>

					<div class="flex flex-col gap-4">
						<Label for="name">Kode Menu <span class="text-red-700"> * </span></Label>
						<div class="flex flex-col gap-2">
							<Input
								name="name"
								placeholder="Kode Menu"
								class="focus:border-gray-300 focus:outline-none focus:ring-0"
								bind:value={
									() => {
										if (menuModel.code) {
											return menuModel.code.toUpperCase();
										}
									},
									(value) => {
										menuModel.code = value!;
									}
								}
							/>
							{#if menuModel.code}
								<span class="self-end text-sm text-gray-600">
									{`Contoh kode appointment: ${menuModel.code}XXXXXX001`}
								</span>
							{/if}
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<Label for="name">Deskripsi Menu <span class="text-red-700"> * </span></Label>
						<Input
							name="description"
							placeholder="Isi deskripsi"
							bind:value={menuModel.description}
						/>
					</div>

					<div class="flex flex-col gap-4">
						<Label for="file">Gambar Menu <span class="text-red-700"> * </span></Label>
						<div class="relative">
							<Input
								id="file"
								name="imageUrl"
								type="file"
								accept=".jpg, .jpeg, .png, image/*"
								class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
								onchange={onImageSelected}
							/>
							<div
								class="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
							>
								<Upload class="mr-2 h-4 w-4 text-gray-500" />
								<span class="text-sm text-gray-600">Upload Gambar Disini</span>
							</div>
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<Label for="status">Status Menu <span class="text-red-700"> * </span></Label>
						<Switch name="status" bind:checked={menuModel.status} />
					</div>

					<Button type="submit" variant="default" disabled={isDisabled}
						>{!tableState.editMenuData.id ? 'Tambah' : 'Ubah'}</Button
					>
				</div>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>

<MenuAction
	data={tableState.menuAction || []}
	bind:openMenuAction={tableState.openMenuAction}
	bind:openOtherOptionDialog
	currentMenu={tableState.currentMenu}
/>
