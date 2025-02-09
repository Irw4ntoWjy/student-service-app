<script lang="ts">
	import { page } from '$app/state';
	import src from '$lib/assets/UPH-Blue.svg';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Eye, EyeOff, KeyRound, Mail, User } from 'lucide-svelte';

	let showPassword: boolean = $state(false);
	let currentStatus: 'login' | 'signup' = $state('login');

	let loginCreds: { username: string | undefined; password: string | undefined } = $state({
		username: undefined,
		password: undefined
	});

	let signupCreds: {
		useremail: string | undefined;
		username: string | undefined;
		password: string | undefined;
	} = $state({
		useremail: undefined,
		username: undefined,
		password: undefined
	});

	const isEmailValid = $derived(signupCreds.useremail?.includes('@uph.edu'));
	$inspect(isEmailValid);

	// hash using sha256
	const hashLoginPassword = async (password: string): Promise<string> => {
		const encoder = new TextEncoder();
		const data = encoder.encode(password);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

		return hashHex;
	};

	const generateVerificationCode = (): string => {
		return Math.floor(100000 + Math.random() * 900000).toString();
	};

	const verifyEmail = async () => {
		const verifCode = generateVerificationCode();

		const response = await fetch(`${page.url.pathname}/verify-email`, {
			method: 'POST',
			body: JSON.stringify({
				email: signupCreds.useremail,
				code: verifCode
			})
		});

		await response.json();
	};
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
				<span class="text-md text-center font-normal"
					>If you dont have account before, please click on 'Sign Up' button below to make account</span
				>
			</div>

			{#if currentStatus === 'signup'}
				<form class="relative w-full rounded-md border bg-white p-1 shadow-md">
					<label class="flex h-10 w-full items-center">
						<Input
							bind:value={signupCreds.useremail}
							required
							placeholder="Email"
							type="text"
							class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none"
							oninput={() => {}}
						/>
						<div
							class="absolute left-3 text-gray-500 transition-transform duration-300 ease-in-out"
						>
							<Mail class="size-4" />
						</div>
					</label>
				</form>
				{#if isEmailValid}
					<button
						class="ml-auto cursor-pointer self-end text-sm font-medium text-primary"
						onclick={verifyEmail}
					>
						Verifikasi Email
					</button>
				{/if}
			{/if}

			<form class="relative w-full rounded-md border bg-white p-1 shadow-md">
				<label class="flex h-10 w-full items-center">
					<Input
						disabled={!isEmailValid}
						bind:value={loginCreds.username}
						required
						placeholder="Username"
						type="text"
						class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none {!isEmailValid &&
						currentStatus === 'signup'
							? 'py-0 disabled:bg-blue-100 disabled:text-gray-500'
							: ''}"
					/>
					<div class="absolute left-3 text-gray-500 transition-transform duration-300 ease-in-out">
						<User class="size-4" />
					</div>
				</label>
			</form>

			<form class="relative w-full rounded-md border bg-white p-1 shadow-md">
				<label class="relative flex h-10 w-full items-center">
					<Input
						disabled={!isEmailValid}
						bind:value={loginCreds.password}
						required
						placeholder="Password"
						type={showPassword ? 'text' : 'password'}
						class="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-700 outline-none"
						oninput={async () => {
							if (loginCreds.password) {
								const pw = hashLoginPassword(loginCreds.password);
								loginCreds.password = await pw;
							}
						}}
					/>
					<div class="absolute left-3 text-gray-500">
						<KeyRound class="size-4" />
					</div>

					<Button
						disabled={!isEmailValid}
						type="button"
						variant="ghost"
						class="absolute right-3 text-gray-500 focus:outline-none"
						onclick={() => (showPassword = !showPassword)}
					>
						{#if showPassword}
							<EyeOff class="size-4" />
						{:else}
							<Eye class="size-4" />
						{/if}
					</Button>
				</label>
			</form>

			<span
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
				{currentStatus === 'signup' ? 'Login' : 'Sign up'}
			</span>

			<Button
				type="button"
				class="mt-8 w-full"
				disabled={!isEmailValid && currentStatus === 'signup'}
				>{currentStatus === 'signup' ? 'Sign up' : 'Login'}
			</Button>
		</div>
	</div>
</div>

<style>
	.background {
		position: relative;
		background-image: url('$lib/assets/login-cover.jpg');
		background-size: cover;
	}
</style>
