<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';

	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { HandCoins, Home, User } from 'lucide-svelte';

	const iconMap = {
		HandCoins,
		Home,
		User
	};

	type Status = 'active' | 'pending' | 'closed' | 'cancelled';

	type QueueTicketProps = {
		status: Status;
		ticketNo: string | undefined;
		title?: string | undefined;
		icons?: 'HandCoins' | 'Home' | 'User';
		description?: string | undefined;
		id: string;
	};

	const cardColor = {
		active: 'bg-green-700 text-white',
		pending: '',
		closed: 'bg-green-600 text-white',
		cancelled: 'bg-destructive text-white'
	};

	let { status, ticketNo, title, icons, description, id }: QueueTicketProps = $props();

	const statusClosedAndCancelled = status === 'closed' || status === 'cancelled';
	let openCancelDialog: boolean = $state(false);
	let cancelReason: string | undefined = $state(undefined);

	const updateStatus = async (id: string, status: Status) => {
		const formData = new FormData();
		formData.append('id', id);
		formData.append('status', status);

		if (status === 'cancelled') formData.append('cancelReason', String(cancelReason));

		const response = await fetch('?/updateStatusActive', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			// toast.success('Berhasil Mengubah Data Menu');
			await invalidateAll();
			toast.success(await response.json());
		}
	};
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<Card.Root
			class="w-[21.625rem] {cardColor[
				status
			]} cursor-pointer rounded-lg border-none shadow-xl transition-shadow duration-300 hover:shadow-2xl"
		>
			<div class={statusClosedAndCancelled ? 'flex items-center justify-evenly' : ''}>
				{#if icons && title}
					<Card.Header class=" items-center  {statusClosedAndCancelled ? '' : 'p-4'}">
						<Card.Title class="flex items-center gap-4 text-xl font-bold">
							{@const Icons = iconMap[icons]}
							<div class="rounded-full bg-gray-100 p-2">
								<Icons class="size-6 text-gray-700" />
							</div>
							<span>{title}</span>
						</Card.Title>
					</Card.Header>
				{/if}
				<Card.Content
					class="flex flex-col {statusClosedAndCancelled ? 'text-right' : ' items-center'}  p-2"
				>
					<span
						class="{statusClosedAndCancelled
							? 'text-4xl font-semibold'
							: ' text-6xl font-bold'}  tracking-wide">{ticketNo}</span
					>
				</Card.Content>
			</div>
			{#if description}
				<div class="p-4">
					<Card.Footer
						class="break-words rounded-lg border  p-4 text-center font-medium leading-relaxed {status ===
						'pending'
							? 'border-black text-lg'
							: 'border-gray-200 text-2xl'}"
					>
						{description}
					</Card.Footer>
				</div>
			{/if}
		</Card.Root>
	</ContextMenu.Trigger>
	<ContextMenu.Content class="w-[12rem]">
		<ContextMenu.Item class="text-lg" onclick={() => updateStatus(id, 'active')}
			>Accept</ContextMenu.Item
		>
		<ContextMenu.Item class="text-lg" onclick={() => updateStatus(id, 'closed')}>
			Done
		</ContextMenu.Item>
		<ContextMenu.Item class="text-lg" onclick={() => (openCancelDialog = true)}>
			Cancel
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>

<Dialog.Root bind:open={openCancelDialog}>
	<Dialog.Content class="h-[13rem] max-w-[31rem]">
		<Dialog.Header>
			<Dialog.Title class="text-lg font-medium">Batalkan Appointment ini</Dialog.Title>

			<div class="flex flex-col gap-[12px]">
				<span>Isi Alasan Pembatalan Appointment dibawah ini</span>
				<Input
					oninput={(e) => {
						cancelReason = e.currentTarget.value;
					}}
				/>
			</div>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				class="w-[88px]"
				onclick={() => {
					openCancelDialog = false;
				}}>Kembali</Button
			>
			<Button
				class="w-[88px]"
				type="submit"
				variant="destructive"
				onclick={async () => {
					updateStatus(id, 'cancelled');
					openCancelDialog = false;
					await invalidateAll();
				}}>Batalkan</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
