<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';

	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Check, HandCoins, Home, User, X } from 'lucide-svelte';
	import type { QueueTicketSchema, Status } from './queue-ticket-schema';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';

	const iconMap = {
		HandCoins,
		Home,
		User
	};

	type QueueTicketProps = {
		icons?: 'HandCoins' | 'Home' | 'User';
		queueTicket: QueueTicketSchema;
	};

	const cardColor = {
		active: 'bg-green-700 text-white',
		pending: '',
		waiting: '',
		closed: 'bg-green-600 text-white',
		cancelled: 'bg-destructive text-white'
	};

	let { icons, queueTicket }: QueueTicketProps = $props();

	const statusClosedAndCancelled =
		queueTicket.status === 'closed' || queueTicket.status === 'cancelled';

	let openCancelDialog: boolean = $state(false);
	let isHovered: boolean = $state(false);
	let cancelReason: string | undefined = $state(undefined);

	const updateTicketStatus = async (id: string, newStatus: Status) => {
		const formData = new FormData();
		formData.append('id', id);
		formData.append('status', newStatus);
		if (queueTicket.status === 'cancelled') formData.append('cancelReason', String(cancelReason));

		if (queueTicket.status === 'pending' && newStatus === 'active') {
			const fetchData = await fetch(`${page.url}/count-current-active-ticket`);
			const countActiveTicket = await fetchData.json();

			if (countActiveTicket > 0) {
				toast.error('Gagal untuk mengubah status ticket', {
					description: 'Terdapat appointment yang sedang berjalan !',
					class: 'text-lg '
				});
				return;
			}
		}

		const response = await fetch('?/updateStatusActive', {
			method: 'POST',
			body: formData
		});

		if (response.status === 200) {
			await invalidateAll();
			openCancelDialog = false;
			toast.success('Berhasil Mengubah Status Tiket', {
				class: 'text-lg '
			});
		}
	};

	let timeGap: string = $state('00 : 00');
	let isTimeLimitReached: boolean = $state(false);

	$effect(() => {
		if (queueTicket.status === 'pending') {
			const interval = setInterval(() => {
				const createdTime = new Date(queueTicket.createdAt);
				createdTime.setHours(createdTime.getHours() + 7);
				const currentTime = new Date();

				const timeDiff: number = currentTime.getTime() - createdTime.getTime();

				const seconds = Math.floor(timeDiff / 1000);
				const minutes = Math.floor(seconds / 60);

				timeGap = `${(minutes % 60).toString().padStart(2, '0')} : ${(seconds % 60).toString().padStart(2, '0')}`;
				const totalSeconds = Math.floor(timeDiff / 1000);

				if (totalSeconds > 180) {
					isTimeLimitReached = true;
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	});

	// perlu tambah if isTimeLimitReached + check finished ticket ga ada yang pending
	// sisa login, sama menu detail page
</script>

<Card.Root
	class="{queueTicket.status === 'closed' || queueTicket.status === 'cancelled'
		? 'h-auto'
		: 'h-[16.75rem]'}  w-[24rem] {cardColor[
		queueTicket.status
	]} relative flex cursor-pointer items-center justify-center rounded-lg border-none shadow-xl transition-shadow duration-300 hover:shadow-2xl"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => {
		setTimeout(() => {
			isHovered = false;
		}, 200);
	}}
>
	<div class={statusClosedAndCancelled ? 'flex items-center justify-evenly p-1' : ''}>
		{#if icons && queueTicket.name && !isHovered}
			<Card.Header class="items-center {statusClosedAndCancelled ? '' : 'p-4'}">
				<Card.Title class="flex  items-center gap-4 text-xl font-bold">
					{@const Icons = iconMap[icons]}
					<div class="rounded-full bg-gray-100 p-2">
						<Icons class="size-8 text-gray-700" />
					</div>
					<span class="text-3xl">{queueTicket.name}</span>
				</Card.Title>
			</Card.Header>
		{/if}
		<Card.Content
			class="flex flex-col {statusClosedAndCancelled
				? 'text-right'
				: 'items-center justify-center'} p-2"
		>
			{#if isHovered && (queueTicket.status === 'pending' || queueTicket.status === 'active')}
				<div
					class="flex h-[16rem] w-[23.25rem] flex-col justify-between rounded-lg {cardColor[
						queueTicket.status
					]} p-6"
					onmouseleave={() => (isHovered = false)}
					role="dialog"
					aria-modal="true"
				>
					<div class="mb-2 flex h-[12rem] flex-col items-center justify-center text-center">
						<p class="break-words text-xl font-medium leading-relaxed">
							{queueTicket.reason || 'No description available'}
						</p>
					</div>

					<div class="flex justify-end gap-3">
						{#if queueTicket.status === 'pending'}
							<Button variant="destructive" onclick={() => (openCancelDialog = true)}>
								<X />
							</Button>
						{/if}
						<Button
							class="bg-green-500 text-white hover:bg-green-600"
							onclick={async () => {
								if (queueTicket.status === 'pending') {
									await updateTicketStatus(queueTicket.id.toString(), 'active');
								} else {
									await updateTicketStatus(queueTicket.id.toString(), 'closed');
								}
							}}
						>
							<Check />
						</Button>
					</div>
				</div>
			{:else}
				<span
					class="{statusClosedAndCancelled
						? 'text-4xl font-semibold'
						: 'text-5xl font-bold'} tracking-wide">{queueTicket.appointmentNo}</span
				>
			{/if}
		</Card.Content>
	</div>

	{#if queueTicket.status === 'pending'}
		<span
			class="absolute bottom-2 left-2 ml-2 text-2xl font-bold {isTimeLimitReached
				? 'text-destructive'
				: 'text-green-500'}">{timeGap}</span
		>
	{/if}
</Card.Root>

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
					isHovered = false;
				}}>Kembali</Button
			>
			<Button
				class="w-[88px]"
				type="submit"
				variant="destructive"
				onclick={async () => {
					await updateTicketStatus(queueTicket.id.toString(), 'cancelled');
					isHovered = false;
					await invalidateAll();
				}}>Batalkan</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
