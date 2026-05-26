<script lang="ts">
	import InventoryGrid from '$lib/components/inventory/InventoryGrid.svelte';
	import { vehicles, type VehicleCondition } from '$lib/data/vehicles';
	import { cn } from '$lib/utils/cn';

	let active = $state<VehicleCondition | 'All'>('All');
	const tabs: (VehicleCondition | 'All')[] = ['All', 'New', 'Used', 'Certified'];
	const filtered = $derived(
		vehicles.filter((vehicle) => active === 'All' || vehicle.condition === active).slice(0, 6)
	);
</script>

<section class="section section--rounded section--soft">
	<div class="container">
		<div class="section-title section-title--center">
			<h2>New Vehicles</h2>
		</div>
		<div class="pill-tabs">
			{#each tabs as tab (tab)}
				<button class={cn(active === tab && 'active')} type="button" onclick={() => (active = tab)}>
					{tab === 'All' ? 'All Vehicles' : tab}
				</button>
			{/each}
		</div>
		<InventoryGrid vehicles={filtered} columns={3} />
	</div>
</section>
