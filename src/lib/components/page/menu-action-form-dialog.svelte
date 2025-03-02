<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { toast } from 'svelte-sonner';
	import Button from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';
	import Label from '../ui/label/label.svelte';

	let {
		menuId,
		openFormDialog = $bindable()
	}: {
		menuId: number | undefined;
		openFormDialog: boolean;
	} = $props();

	let name: string = $state('');
	let link: string = $state('');
	let type: 'FORM' | 'APPOINTMENT' = $state('APPOINTMENT');

	const addActionForm = async () => {
		const formData = new FormData();
		if (menuId) formData.append('menuId', menuId.toString());
		formData.append('name', name);
		formData.append('type', type);

		if (link) {
			if (!link.startsWith('https://')) {
				link = 'https://' + link;
			}
			formData.append('link', link);
		}

		const response = await fetch('?/submitMenuAction', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			openFormDialog = false;
			toast.success('Berhasil menambahkan action menu');
			await invalidateAll();
		}
	};

	$effect(() => {
		if (!openFormDialog) {
			name = '';
		}
	});
</script>

<Dialog.Root bind:open={openFormDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-lg font-bold"
				>Isi Form Dibawah untuk menambahkan action menu</Dialog.Title
			>
		</Dialog.Header>
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-4">
				<Label>Nama Action</Label>
				<Input bind:value={name} />
			</div>

			<Label>Tipe Action</Label>
			<RadioGroup.Root bind:value={type}>
				<div class="flex gap-x-4">
					<div class="flex items-center gap-x-2">
						<RadioGroup.Item value="APPOINTMENT" id="r2" />
						<Label for="r2" class="cursor-pointer">Appointment</Label>
					</div>
					<div class="flex items-center gap-x-2">
						<RadioGroup.Item value="FORM" id="r1" />
						<Label for="r1" class="cursor-pointer">Form</Label>
					</div>
				</div>
			</RadioGroup.Root>
			{#if type === 'FORM'}
				<div class="flex w-full items-center gap-x-2">
					<Label class="w-1/5">Link</Label>
					<Input class="w-4/5" bind:value={link} />
				</div>
			{/if}
		</div>

		<Button
			type="submit"
			variant="ghost"
			class=" border bg-primary px-4 py-2 text-white"
			onclick={() => addActionForm()}
		>
			<span>Tambah</span>
		</Button>
	</Dialog.Content>
</Dialog.Root>
