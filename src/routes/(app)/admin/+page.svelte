<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import DataTable from '$lib/components/page/data-table/data-table.svelte';
	import MenuCard from '$lib/components/page/menu-card.svelte';
	import MenuDialog from '$lib/components/page/menu-dialog.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { CirclePlus, Upload } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { type InsertUpdateMenuSchema } from '../menu-services/menu-schema';
	import type { PageData } from './$types';
	import createTableState from './config.svelte';

	let { data }: { data: PageData } = $props();

	//init table
	const tableState = createTableState(page.url.pathname, data.menuList);
	$effect(() => {
		tableState.updateTable = {
			data: data.menuList
		};
	});

	let formModel: InsertUpdateMenuSchema = $state({
		id: 0,
		name: '',
		description: '',
		image: undefined,
		imageName: undefined,
		status: true
	});

	$effect(() => {
		if (tableState.openEditDialog && !isEditMenuDataEmpty() && !formModel.id) {
			formModel.id = tableState.editMenuData.id ?? 0;
			formModel.name = tableState.editMenuData.menuName ?? '';
			formModel.description = tableState.editMenuData.menuDescription ?? '';
			formModel.imageBase64 = `uploads/${tableState.editMenuData.imageName}`;
			formModel.imageName = tableState.editMenuData.imageName;
			formModel.status = tableState.editMenuData.status;
		}
	});

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

	// handle when user upload image
	const onImageSelected = async (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const base64 = await convertImageToBase64(input.files[0]);

			formModel.imageBase64 = base64;
			formModel.imageName = input.files[0].name;
		}
	};

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append('id', String(formModel.id));
		formData.append('name', formModel.name);
		formData.append('description', formModel.description);
		formData.append('image', formModel.imageBase64 ?? '');
		formData.append('imageName', formModel.imageName ?? '');
		formData.append('status', String(formModel.status));

		if (!formModel.id) {
			const response = await fetch('?/submitForm', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				await invalidateAll();
				resetModel();
				tableState.openEditDialog = false;
				toast.success('Berhasil Menambahkan Menu Baru');
			} else {
				toast.error('Gagal untuk Menambahkan Menu Baru');
			}
		} else {
			const response = await fetch('?/updateForm', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				await invalidateAll();
				resetModel();
				tableState.openEditDialog = false;
				toast.success('Berhasil Mengubah Data Menu');
			} else {
				toast.error('Gagal untuk Mengubah Data Menu');
			}
		}
	};

	// validation logic
	const isFormModelFilled = () => {
		return (
			formModel.name.trim() !== '' || formModel.description.trim() !== '' || !!formModel.imageBase64
		);
	};

	const isEditMenuDataEmpty = () => {
		return (
			tableState.editMenuData.id === undefined &&
			tableState.editMenuData.menuName === undefined &&
			tableState.editMenuData.menuDescription === undefined &&
			tableState.editMenuData.imageName === undefined
		);
	};

	const resetModel = () => {
		tableState.editMenuData = {
			id: undefined,
			menuName: undefined,
			menuDescription: undefined,
			imageName: undefined,
			status: true
		};

		formModel = {
			id: 0,
			name: '',
			description: '',
			imageBase64: undefined,
			imageName: undefined,
			status: true
		};
	};

	let openOtherOptionDialog: boolean = $state(false);
</script>

<div class="flex flex-col gap-4">
	<div class="flex justify-between">
		<Input class="w-fit" placeholder="Cari menu" />
		<Button
			class="h-10 items-center border md:w-auto"
			variant="ghost"
			onclick={() => (tableState.openEditDialog = true)}
		>
			<CirclePlus class="mr-2 h-4 w-4" /> Tambah
		</Button>
	</div>

	<DataTable table={tableState.table} toggleSorting={tableState.toggleSorting} />
</div>

<Dialog.Root
	bind:open={tableState.openEditDialog}
	onOpenChange={() => {
		resetModel();
	}}
>
	<Dialog.Content class={isFormModelFilled() ? 'max-w-4xl' : 'max-w-lg'}>
		<Dialog.Header>
			<Dialog.Title
				>{isEditMenuDataEmpty()
					? 'Tambah Menu Student Services'
					: `Edit Menu ${tableState.editMenuData.menuName}`}</Dialog.Title
			>
			<Dialog.Description>
				{isEditMenuDataEmpty()
					? 'Isi kotak dibawah untuk menambahkan menu student services yang baru'
					: 'Ubah kotak dibawah untuk mengubah data dari menu ini'}
			</Dialog.Description>
		</Dialog.Header>
		<Separator orientation="horizontal" />
		<form onsubmit={handleSubmit}>
			<div class="grid {isFormModelFilled() ? 'grid-cols-2' : 'grid-cols-1'}  gap-8">
				{#if isFormModelFilled()}
					<!-- NOTE: kalau misalnya deskripsinya panjang untuk bagian menu, pembatasan upload file, batasan format file-->
					<MenuCard
						title={formModel.name}
						description={formModel.description}
						{...formModel.imageBase64 && { src: formModel.imageBase64 }}
					/>
				{/if}
				<div class="flex flex-col gap-4">
					<Input name="id" type="hidden" bind:value={formModel.id} />
					<div class="flex flex-col gap-4">
						<Label for="name">Nama Menu</Label>
						<Input
							name="name"
							placeholder="Nama Menu"
							class="focus:border-gray-300 focus:outline-none focus:ring-0"
							bind:value={formModel.name}
						/>
					</div>
					<div class="flex flex-col gap-4">
						<Label for="name">Deskripsi Menu</Label>
						<Input
							name="description"
							placeholder="Isi deskripsi"
							bind:value={formModel.description}
						/>
					</div>
					<div class="flex flex-col gap-4">
						<Label for="file">Gambar Menu</Label>
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
						<Label for="status">Status Menu</Label>
						<Switch name="status" bind:checked={formModel.status} />
					</div>
					<Button type="submit" variant="default"
						>{isEditMenuDataEmpty() ? 'Tambah' : 'Ubah'}</Button
					>
				</div>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>

<MenuDialog
	bind:openMenuDialog={tableState.openMenuDialog}
	bind:openOtherOptionDialog
	menuDialog={tableState.menuDialog || []}
	currentMenuId={tableState.currentMenuId}
/>
