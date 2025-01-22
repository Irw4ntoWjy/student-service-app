<script lang="ts">
	import QueueTicket from './queue-ticket.svelte';
</script>

<div class="flex max-h-screen gap-4">
	<div class="flex flex-col gap-6">
		<div
			class="flex w-[25rem] flex-col items-center justify-center gap-2 rounded-lg bg-blue-900 p-8 shadow-lg"
		>
			<span class="-translate-y-3 text-xl font-medium text-white"
				>Nomor Antrian yang Sedang dilayani</span
			>
			<QueueTicket
				icons="HandCoins"
				title="Student Finance"
				ticketNo="004"
				status="active"
				description="Permasalahan ketika pembayaran biaya perkuliahan karena telat melakukan pembayaran"
			/>
		</div>

		<div
			class="flex w-[25rem] flex-grow flex-col items-center justify-center gap-2 rounded-lg bg-blue-900 p-8 shadow-lg"
		>
			<span class="-translate-y-3 text-xl font-medium text-white"
				>Nomor Antrian yang Sebelumnya</span
			>
			<QueueTicket ticketNo="003" status="closed" icons="HandCoins" title="Student Finance" />
			<QueueTicket ticketNo="002" status="cancelled" icons="HandCoins" title="Student Finance" />
			<QueueTicket ticketNo="001" status="closed" icons="HandCoins" title="Student Finance" />
		</div>
	</div>
	<div class="max-h-screen w-full justify-center rounded-lg bg-blue-900 px-6 py-4 shadow-lg">
		<span class="ml-8 text-xl font-medium text-white">Nomor Antrian Selanjutnya</span>
		<div class="grid grid-cols-3 place-items-center gap-12 p-6">
			<QueueTicket
				icons="HandCoins"
				title="Student Finance"
				ticketNo="005"
				status="pending"
				description="Permasalahan ketika pembayaran biaya perkuliahan karena telat melakukan pembayaran"
			/>
			<QueueTicket
				icons="HandCoins"
				title="Student Finance"
				ticketNo="006"
				status="pending"
				description="Permasalahan ketika pembayaran biaya perkuliahan karena telat melakukan pembayaran"
			/>
			<QueueTicket
				icons="HandCoins"
				title="Student Finance"
				ticketNo="007"
				status="pending"
				description="Permasalahan ketika pembayaran biaya perkuliahan karena telat melakukan pembayaran"
			/>
			<QueueTicket
				icons="HandCoins"
				title="Student Finance"
				ticketNo="008"
				status="pending"
				description="Permasalahan ketika pembayaran biaya perkuliahan karena telat melakukan pembayaran"
			/>
		</div>
	</div>
</div>
