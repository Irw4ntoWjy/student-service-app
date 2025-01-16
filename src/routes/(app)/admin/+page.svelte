<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { CirclePlus, Upload } from 'lucide-svelte';
	import type { PageData } from './$types';
	import CardDisplay from './card-display.svelte';
	import createTableState from './config.svelte';
	import { type InsertUpdateMenuSchema } from '../menu-services/menu-schema';
	import DataTable from '$lib/components/page/data-table/data-table.svelte';

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
		imageName: undefined
	});

	const onFileSelected = async (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			const reader = new FileReader();

			reader.readAsDataURL(file);
			reader.onload = (e) => {
				if (e.target && e.target.result) {
					formModel.imageBase64 = e.target.result.toString();
					formModel.imageName = file.name;
				}
			};
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

		const response = await fetch('?/submitForm', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			tableState.openEditDialog = false;
			await invalidateAll();
		} else {
			console.log('not ok');
		}
	};

	const isFormModelFilled = () => {
		return (
			formModel.name.trim() !== '' || formModel.description.trim() !== '' || !!formModel.imageBase64
		);
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex justify-end">
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

<Dialog.Root bind:open={tableState.openEditDialog}>
	<Dialog.Content class={isFormModelFilled() ? 'max-w-4xl' : 'max-w-lg'}>
		<Dialog.Header>
			<Dialog.Title>Tambah Menu Student Services</Dialog.Title>
			<Dialog.Description>
				Isi kotak dibawah untuk menambahkan menu student services yang baru
			</Dialog.Description>
		</Dialog.Header>
		<Separator orientation="horizontal" />
		<form onsubmit={handleSubmit}>
			<div class="grid {isFormModelFilled() ? 'grid-cols-2' : 'grid-cols-1'}  gap-8">
				{#if isFormModelFilled()}
					<!-- NOTE: kalau misalnya deskripsinya panjang untuk bagian menu, pembatasan upload file, batasan format file-->
					<CardDisplay
						title={formModel.name}
						description={formModel.description}
						src={formModel.imageBase64}
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
								onchange={onFileSelected}
							/>
							<div
								class="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
							>
								<Upload class="mr-2 h-4 w-4 text-gray-500" />
								<span class="text-sm text-gray-600">Upload Gambar Disini</span>
							</div>
						</div>
					</div>

					<Button type="submit" variant="default">Tambah</Button>
				</div>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
