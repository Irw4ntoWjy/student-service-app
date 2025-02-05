<script lang="ts">
	import src from '$lib/assets/UPH-Blue.svg';
</script>

<div class="background flex h-screen w-full flex-col items-center justify-center">
	<div class="h-[938px] w-[445px] rounded-md bg-white p-[30px]">
		<div class="h-full w-full">
			<div class="p-12">
				<img {src} alt="uph-blue" />
			</div>
			<div class="flex flex-col items-center space-y-2">
				<span class="text-center text-xl font-bold"
					>Welcome to Student Service Admin UPH Medan !</span
				>
				<span class="text-center text-[18px] font-normal"
					>If you dont have account before, please click on 'Sign Up' button below to make account</span
				>
			</div>
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
