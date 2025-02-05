<script lang="ts">
	import { page } from '$app/state';

	const appointmentNo = page.params.id;
</script>

<div class="flex min-h-[calc(100vh-3.688rem)] items-center justify-center bg-gray-100 p-4">
	<div class="w-full max-w-xs rounded-lg bg-white p-6 text-center shadow-lg">
		<h2 class="mb-4 text-xl font-semibold text-gray-800">Nomor Appointment Anda</h2>
		<span class="text-3xl font-bold text-blue-600">{appointmentNo}</span>
		<p class="mt-2 text-sm text-gray-500">
			Ini adalah nomor appointment Anda. Harap simpan dengan baik untuk kunjungan Anda.
		</p>
	</div>
</div>
