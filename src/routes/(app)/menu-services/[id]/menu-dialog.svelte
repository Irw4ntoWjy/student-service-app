<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import OtherOptionDialog from './other-option-dialog.svelte';

	let {
		openMenuDialog = $bindable(),
		openOtherOptionDialog = $bindable()
	}: { openMenuDialog: boolean; openOtherOptionDialog: boolean } = $props();
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
			<Button
				class="max-w-full flex-grow bg-primary px-4 py-2"
				onclick={() => {
					window.open(
						'https://drive.google.com/drive/folders/1nqXkcm7Jis4KZBSITfS1WwhK9M7iSsoh',
						'_blank'
					);
				}}
				>Permintaan Kartu Hasil Studi Mahasiswa
			</Button>
			<Button
				class="max-w-full flex-grow bg-primary px-4 py-2"
				onclick={() => {
					window.open(
						'https://drive.google.com/drive/folders/1nqXkcm7Jis4KZBSITfS1WwhK9M7iSsoh',
						'_blank'
					);
				}}>Pendaftaran Ujian Sidang Tugas Akhir</Button
			>
			<Button
				class="max-w-full flex-grow bg-primary px-4 py-2"
				onclick={() => {
					openOtherOptionDialog = true;
				}}
				>Opsi yang lain
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>

<OtherOptionDialog bind:open={openOtherOptionDialog} />
