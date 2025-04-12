<script lang="ts">
	import { goto } from '$app/navigation';
	import src from '$lib/assets/UPH-Blue.svg';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Eye, EyeOff, KeyRound, User } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { debounce } from '$lib/utils';
	import InputOtpDialog from './input-otp-dialog.svelte';
	import { page } from '$app/state';

	let showPassword: boolean = $state(false);
	let showNewPassword: boolean = $state(false);
	let showConfirmNewPassword: boolean = $state(false);

	let userCreds: {
		useremail?: string | undefined;
		username: string | undefined;
		password: string | undefined;
	} = $state({
		useremail: undefined,
		username: undefined,
		password: undefined
	});

	//NOTES diganti ketika validasi email uph
	// const isEmailValid = $derived(userCreds.useremail?.includes('@gmail.com'));

	// hash using sha256
	export const hashLoginPassword = async (password: string): Promise<string> => {
		const encoder = new TextEncoder();
		const data = encoder.encode(password);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

		return hashHex;
	};

	let returnUrl = '/';
	if (browser) {
		const urlParams = new URLSearchParams(window.location.search);
		returnUrl = urlParams.get('returnUrl') || '/admin/appointment-list';
	}

	const handleLogin = async () => {
		if (userCreds.username && userCreds.password) {
			const formData = new FormData();
			formData.append('userName', String(userCreds.username));
			formData.append('password', String(userCreds.password));

			const response = await fetch(`?/validateAccount`, {
				method: 'POST',
				body: formData
			}).then((res) => res.json());

			if (response.status === 200) {
				const safeReturnUrl = returnUrl.startsWith('/') ? decodeURIComponent(returnUrl) : '/';
				await goto(safeReturnUrl);
				toast.success(`Selamat Datang ! ${userCreds.username}`);
			} else {
				toast.error('Maaf, username atau password yang anda masukkan salah !');
			}
		}
	};

	type ChangePasswordModel = {
		username: string;
		password: string;
		newPassword: string;
		confirmNewPassword: string;
	};

	const changePwModel: ChangePasswordModel = $state({
		username: undefined!,
		password: undefined!,
		newPassword: undefined!,
		confirmNewPassword: undefined!
	});

	const checkAccountValidation = async () => {
		if (changePwModel.username && changePwModel.password) {
			const formData = new FormData();
			formData.append('userName', changePwModel.username);
			formData.append('password', changePwModel.password);

			const response = await fetch(`?/checkAccountValidation`, {
				method: 'POST',
				body: formData
			}).then((res) => res.json());

			if (response.type === 'success') {
				isAccountValid = true;
			} else {
				isAccountValid = false;
			}
		}
		return false;
	};

	const generateVerificationCode = (): string => {
		return Math.floor(100000 + Math.random() * 900000).toString();
	};

	let verifCode: string | undefined = $state(undefined);

	const verifyEmail = async () => {
		verifCode = generateVerificationCode();

		const response = await fetch(`${page.url.pathname}/verify-email`, {
			method: 'POST',
			body: JSON.stringify({
				email: 'irwantowijaya0506@gmail.com',
				code: verifCode
			})
		});

		await response.json();
	};

	let isDialogOpen: boolean = $state(false);
	let isAccountValid: boolean = $state(false);
	let isInputOTPDialogOpen: boolean = $state(false);

	const handleChangePassword = async () => {
		if (changePwModel.newPassword !== changePwModel.confirmNewPassword) {
			toast.error('Password tidak sama !');
		}

		verifCode = generateVerificationCode();
		await verifyEmail();

		isDialogOpen = false;
		isInputOTPDialogOpen = true;
	};
</script>

<div class="background flex h-screen w-full flex-col items-center justify-center">
	<div class="h-[37rem] w-[24rem] rounded-md bg-white p-[30px]">
		<div class="flex h-full w-full flex-col items-center gap-4">
			<div class="p-4">
				<img {src} alt="uph-blue" class="h-[5rem] w-[16.5rem]" />
			</div>
			<div class="flex flex-col items-center">
				<span class="p-2 text-center text-xl font-bold"
					>Welcome to Student Service Admin UPH Medan !</span
				>
				<span class="text-md text-center font-normal">
					Please input valid credentials to login into this website!
				</span>
			</div>

			<form class="relative w-full rounded-md border bg-white shadow-md">
				<label class="flex h-10 w-full items-center">
					<Input
						bind:value={userCreds.username}
						required
						placeholder="Username"
						type="text"
						class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none 
							"
					/>
					<div class="absolute left-3 text-gray-500 transition-transform duration-300 ease-in-out">
						<User class="size-4" />
					</div>
				</label>
			</form>

			<form class="relative w-full rounded-md border bg-white shadow-md">
				<label class="relative flex h-10 w-full items-center">
					<Input
						bind:value={userCreds.password}
						required
						placeholder="Password"
						type={showPassword ? 'text' : 'password'}
						class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none disabled:bg-blue-100 disabled:py-0 disabled:text-gray-500 
							"
					/>

					<div class="absolute left-3 text-gray-500">
						<KeyRound class="size-4" />
					</div>

					<Button
						type="button"
						variant="ghost"
						class="absolute right-3 text-gray-500 focus:outline-none"
						onclick={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<Eye class="size-4" />
						{:else}
							<EyeOff class="size-4" />
						{/if}
					</Button>
				</label>
			</form>

			<span
				class="ml-auto cursor-pointer self-end text-sm font-medium text-slate-700"
				tabindex="0"
				role="button"
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						isDialogOpen = true;
					}
				}}
				onclick={() => {
					isDialogOpen = true;
				}}
			>
				Change Password
			</span>

			<Button
				onclick={() => {
					handleLogin();
				}}
				type="button"
				class="mt-6 w-full"
				>Login
			</Button>
		</div>
	</div>
</div>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Content class="w-[425px]">
		<Dialog.Header>
			<Dialog.Title class="justify-center text-center text-lg font-bold text-slate-700">
				Change Password
			</Dialog.Title>
		</Dialog.Header>

		<form class="relative w-full rounded-md border bg-white shadow-md">
			<label class="flex h-10 w-full items-center">
				<Input
					bind:value={changePwModel.username}
					required
					placeholder="Username"
					type="text"
					class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none 
						"
				/>
				<div class="absolute left-3 text-gray-500 transition-transform duration-300 ease-in-out">
					<User class="size-4" />
				</div>
			</label>
		</form>

		<form class="relative w-full rounded-md border bg-white shadow-md">
			<label class="relative flex h-10 w-full items-center">
				<Input
					bind:value={changePwModel.password}
					required
					disabled={!changePwModel.username}
					placeholder="Current Password"
					type={showPassword ? 'text' : 'password'}
					class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none disabled:bg-blue-100 disabled:py-0 disabled:text-gray-500"
					oninput={() => {
						debounce(() => {
							checkAccountValidation();
						});
					}}
				/>

				<div class="absolute left-3 text-gray-500">
					<KeyRound class="size-4" />
				</div>

				<Button
					type="button"
					variant="ghost"
					class="absolute right-3 text-gray-500 focus:outline-none"
					onclick={() => (showPassword = !showPassword)}
				>
					{#if showPassword}
						<Eye class="size-4" />
					{:else}
						<EyeOff class="size-4" />
					{/if}
				</Button>
			</label>
			{#if !isAccountValid && changePwModel.username && changePwModel.password}
				<span class="absolute right-0 text-sm text-red-500">Akun tidak ditemukan</span>
			{/if}
		</form>

		<form class="relative mt-2 w-full rounded-md border bg-white shadow-md">
			<label class="relative flex h-10 w-full items-center">
				<Input
					bind:value={changePwModel.newPassword}
					disabled={!isAccountValid}
					required
					placeholder="New Password"
					type={showNewPassword ? 'text' : 'password'}
					class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none disabled:bg-blue-100 disabled:py-0 disabled:text-gray-500 
						"
				/>

				<div class="absolute left-3 text-gray-500">
					<KeyRound class="size-4" />
				</div>

				<Button
					type="button"
					variant="ghost"
					class="absolute right-3 text-gray-500 focus:outline-none"
					onclick={() => (showNewPassword = !showNewPassword)}
				>
					{#if showNewPassword}
						<Eye class="size-4" />
					{:else}
						<EyeOff class="size-4" />
					{/if}
				</Button>
			</label>
		</form>

		<form class="relative w-full rounded-md border bg-white shadow-md">
			<label class="relative flex h-10 w-full items-center">
				<Input
					bind:value={changePwModel.confirmNewPassword}
					disabled={!isAccountValid}
					required
					placeholder="Confirm New Password"
					type={showConfirmNewPassword ? 'text' : 'password'}
					class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none disabled:bg-blue-100 disabled:py-0 disabled:text-gray-500 
						"
				/>

				<div class="absolute left-3 text-gray-500">
					<KeyRound class="size-4" />
				</div>

				<Button
					type="button"
					variant="ghost"
					class="absolute right-3 text-gray-500 focus:outline-none"
					onclick={() => (showConfirmNewPassword = !showConfirmNewPassword)}
				>
					{#if showConfirmNewPassword}
						<Eye class="size-4" />
					{:else}
						<EyeOff class="size-4" />
					{/if}
				</Button>
			</label>
		</form>

		<div class="flex justify-end gap-3">
			<Button type="submit" variant="outline" onclick={() => (isDialogOpen = false)}>
				<span>Cancel</span>
			</Button>

			<Button
				disabled={!isAccountValid ||
					!changePwModel.newPassword ||
					!changePwModel.confirmNewPassword}
				type="submit"
				variant="ghost"
				class="border bg-primary px-4 py-2 text-white hover:bg-primary hover:text-gray-200"
				onclick={handleChangePassword}
			>
				<span>Change Password</span>
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>

<InputOtpDialog
	bind:open={isInputOTPDialogOpen}
	code={verifCode}
	userName={changePwModel.username}
	newPassword={changePwModel.confirmNewPassword}
/>

<!-- bind:emailValid -->

<style>
	.background {
		position: relative;
		background-image: url('$lib/assets/login-cover.jpg');
		background-size: cover;
	}
</style>
