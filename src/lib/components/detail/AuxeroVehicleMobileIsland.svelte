<script lang="ts">
	import type { AuxeroVehicleDetailData } from '$lib/auxero/detail';
	import { onMount } from 'svelte';
	import AuxeroVehicleMobilePdp from './AuxeroVehicleMobilePdp.svelte';

	let { detail }: { detail: AuxeroVehicleDetailData } = $props();

	let showMobilePdp = $state(false);

	onMount(() => {
		const media = window.matchMedia('(max-width: 767.98px)');
		const syncMobilePdp = () => {
			showMobilePdp = media.matches;
		};

		syncMobilePdp();
		media.addEventListener('change', syncMobilePdp);

		return () => {
			media.removeEventListener('change', syncMobilePdp);
		};
	});
</script>

{#if showMobilePdp}
	<div class="bohemcars-pdp-mobile">
		<AuxeroVehicleMobilePdp {detail} />
	</div>
{/if}

<style>
	.bohemcars-pdp-mobile {
		display: none;
	}

	@media (max-width: 767.98px) {
		.bohemcars-pdp-mobile {
			display: block;
		}
	}
</style>
