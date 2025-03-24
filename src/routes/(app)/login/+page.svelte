<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import src from '$lib/assets/UPH-Blue.svg';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { CircleCheck, Eye, EyeOff, KeyRound, Mail, User } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import InputOtpDialog from './input-otp-dialog.svelte';

	let showPassword: boolean = $state(false);
	let currentStatus: 'login' | 'signup' = $state('login');

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
	const isEmailValid = $derived(userCreds.useremail?.includes('@gmail.com'));

	// hash using sha256
	export const hashLoginPassword = async (password: string): Promise<string> => {
		const encoder = new TextEncoder();
		const data = encoder.encode(password);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

		return hashHex;
	};

	// const createAccount = async () => {
	// 	if (userCreds.password) {
	// 		const pw = hashLoginPassword(userCreds.password);

	// 		const formData = new FormData();
	// 		formData.append('userEmail', String(userCreds.useremail));
	// 		formData.append('userName', String(userCreds.username));
	// 		formData.append('password', String(await pw));

	// 		const response = await fetch(`?/insertAccount`, {
	// 			method: 'POST',
	// 			body: formData
	// 		});

	// 		if (response.ok) {
	// 			toast.success('Berhasil Membuat Akun');
	// 			goto('/login');
	// 		}
	// 	}
	// };

	const handleLogin = async () => {
		if (userCreds.username && userCreds.password) {
			// const response = await fetch(`${page.url.pathname}/get-user-password`, {
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json' },
			// 	body: JSON.stringify({
			// 		username: userCreds.username,
			// 		password: userCreds.password
			// 	}),
			// 	credentials: 'include'
			// }).then((res) => res.json());

			const formData = new FormData();
			formData.append('userName', String(userCreds.username));
			formData.append('password', String(userCreds.password));

			const response = await fetch(`?/validateAccount`, {
				method: 'POST',
				body: formData
			}).then((res) => res.json());

			if (response.status === 200) {
				goto('/admin/menu-list');
				toast.success(`Selamat Datang ! ${userCreds.username}`);
			} else {
				toast.error('Maaf, username atau password yang anda masukkan salah !');
			}
		}
	};

	const generateVerificationCode = (): string => {
		return Math.floor(100000 + Math.random() * 900000).toString();
	};

	let verifCode: string = $state('');
	const verifyEmail = async () => {
		verifCode = generateVerificationCode();

		const response = await fetch(`${page.url.pathname}/verify-email`, {
			method: 'POST',
			body: JSON.stringify({
				email: userCreds.useremail,
				code: verifCode
			})
		});

		await response.json();
	};

	let emailValid: boolean = $state(false);

	let openInputOtp: boolean = $state(false);
</script>

<div class="background flex h-screen w-full flex-col items-center justify-center">
	<div class="h-[42rem] w-[24rem] rounded-md bg-white p-[30px]">
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

			<!-- {#if currentStatus === 'signup'} -->
			<form class="relative w-full rounded-md border bg-white p-1 shadow-md">
				<label class="flex h-10 w-full items-center">
					<Input
						disabled={emailValid}
						bind:value={userCreds.useremail}
						required
						placeholder="Email"
						type="text"
						class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none"
					/>
					<div class="absolute left-3 text-gray-500 transition-transform duration-300 ease-in-out">
						<Mail class="size-4" />
					</div>
					{#if emailValid}
						<CircleCheck class="mr-2 size-5 text-green-700" />
					{/if}
				</label>
			</form>
			{#if isEmailValid && !emailValid}
				<button
					class="ml-auto cursor-pointer self-end text-sm font-medium text-primary"
					onclick={() => {
						verifyEmail();
						openInputOtp = true;
					}}
				>
					Verifikasi Email
				</button>
			{/if}
			<!-- {/if} -->

			<form class="relative w-full rounded-md border bg-white shadow-md">
				<label class="flex h-10 w-full items-center">
					<Input
						disabled={!emailValid && currentStatus !== 'login'}
						bind:value={userCreds.username}
						required
						placeholder="Username"
						type="text"
						class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none 
							"
					/>
					<!-- {!emailValid &&
						currentStatus === 'signup'
							? 'py-0 disabled:bg-blue-100 disabled:text-gray-500'
							: ''} -->
					<div class="absolute left-3 text-gray-500 transition-transform duration-300 ease-in-out">
						<User class="size-4" />
					</div>
				</label>
			</form>

			<form class="relative w-full rounded-md border bg-white shadow-md">
				<label class="relative flex h-10 w-full items-center">
					<Input
						disabled={!emailValid && currentStatus !== 'login'}
						bind:value={userCreds.password}
						required
						placeholder="Password"
						type={showPassword ? 'text' : 'password'}
						class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none disabled:bg-blue-100 disabled:py-0 disabled:text-gray-500 
							"
					/>
					<!-- {!isEmailValid &&
						currentStatus === 'signup'
							? 'py-0 disabled:bg-blue-100 disabled:text-gray-500 '
							: ''} -->
					<div class="absolute left-3 text-gray-500">
						<KeyRound class="size-4" />
					</div>

					<Button
						disabled={!emailValid && currentStatus !== 'login'}
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

			{#if currentStatus === 'login'}
				<!-- <span
					class="ml-auto cursor-pointer self-end text-sm font-medium text-primary"
					tabindex="0"
					role="button"
					onclick={() => (currentStatus = currentStatus === 'signup' ? 'login' : 'signup')}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							currentStatus = currentStatus === 'signup' ? 'login' : 'signup';
						}
					}}
				>
					Sign Up
				</span> -->
			{/if}
			<Button
				onclick={() => {
					handleLogin();
				}}
				type="button"
				class="mt-8 w-full"
				>Login
			</Button>
		</div>
	</div>
</div>

<InputOtpDialog
	bind:open={openInputOtp}
	useremail={userCreds.useremail}
	code={verifCode}
	bind:emailValid
/>

<style>
	.background {
		position: relative;
		background-image: url('$lib/assets/login-cover.jpg');
		background-size: cover;
	}
</style>
