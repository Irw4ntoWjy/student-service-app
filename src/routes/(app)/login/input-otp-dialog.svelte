<script lang="ts">
	import src from '$lib/assets/UPH-Blue.svg';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { toast } from 'svelte-sonner';

	let {
		open = $bindable(false),
		code,
		userName,
		newPassword
	}: {
		open: boolean;
		code: string | undefined;
		userName: string | undefined;
		newPassword: string | undefined;
	} = $props();

	let inputOtp: string = $state('');

	const isOtpValid = $derived.by(() => {
		if (inputOtp && inputOtp.length === 6 && inputOtp === code) {
			return true;
		}
		return false;
	});

	const verifyUser = async () => {
		if (isOtpValid) {
			const formData = new FormData();
			formData.append('userName', String(userName));
			formData.append('newPassword', String(newPassword));

			const response = await fetch(`?/updatePassword`, {
				method: 'POST',
				body: formData
			});

			await response.json();
			if (response.ok) {
				toast.success('Berhasil Mengubah Password !');
			} else {
				toast.error('Gagal Mengubah Password !');
			}
		}
		open = false;
	};

	$effect(() => {
		if (!open) inputOtp = '';
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<div class="flex flex-col items-center gap-2">
			<img {src} alt="uph-blue" class="h-[2.75rem] w-[9.25rem]" />
			<span class="text-xl font-semibold">Enter verification code</span>
			<div class="flex gap-2">
				<span class="text-slate-700">We've sent a code to please check your email</span>
			</div>
			<InputOTP.Root maxlength={6} class="mt-2" bind:value={inputOtp}>
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells.slice(0, 6) as cell}
							<InputOTP.Slot
								{cell}
								class="mx-2 size-12 rounded-md border border-gray-300 text-center text-xl"
							/>
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>
			<Separator orientation="horizontal" class="my-2" />
			<div class="grid w-full grid-cols-1 gap-4">
				<Button onclick={verifyUser}>Verify</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
