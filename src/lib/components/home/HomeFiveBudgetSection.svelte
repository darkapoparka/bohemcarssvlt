<script lang="ts">
	import HomeFiveVehicleCard from './HomeFiveVehicleCard.svelte';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';

	let { vehicles }: { vehicles: HomeFiveVehicleCardData[] } = $props();

	const budgetTabs = [
		{ label: 'All Cars', active: false },
		{ label: '20 000 - 50 000 EUR', active: true },
		{ label: '50 000 - 70 000 EUR', active: false },
		{ label: '70 000 - 100 000 EUR', active: false },
		{ label: '100 000+ EUR', active: false }
	];
</script>

<section class="flat-tabs py-100">
	<div class="container">
		<div class="wow fadeInUp mb-40 flex items-center justify-center">
			<h2>Bohemcars by Budget</h2>
		</div>
		<div
			class="wow fadeIn mb-40 flex items-center justify-center gap-8 overflow-x-auto"
			data-wow-delay="0.1s"
		>
			<ul class="menu-tab menu-tab-style2 margin-auto gap-10">
				{#each budgetTabs as tab (tab.label)}
					<li class={tab.active ? 'active car-box' : 'car-box'}>{tab.label}</li>
				{/each}
			</ul>
		</div>
	</div>
	<div class="wow fadeIn container" data-wow-delay="0.2s">
		<div class="content-tab">
			<div class="content-inner active">
				<div class="xl-grid-cols-2 sm-grid-cols-1 grid grid-cols-3 gap-30">
					{#each vehicles as vehicle (vehicle.slug)}
						<HomeFiveVehicleCard {vehicle} style2 />
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>
