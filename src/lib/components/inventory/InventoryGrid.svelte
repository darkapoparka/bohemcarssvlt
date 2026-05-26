<script lang="ts">
	import type { Vehicle } from '$lib/data/vehicles';
	import { cn } from '$lib/utils/cn';
	import VehicleCard from './VehicleCard.svelte';

	interface Props {
		vehicles: Vehicle[];
		columns?: number;
	}

	let { vehicles, columns = 3 }: Props = $props();
</script>

<div class={cn('inventory-grid', `inventory-grid--${columns}`)}>
	{#each vehicles as vehicle (vehicle.slug)}
		<VehicleCard {vehicle} />
	{/each}
</div>

{#if vehicles.length === 0}
	<div class="empty-state">
		<p class="eyebrow">No vehicles found</p>
		<h3>Try widening your filters</h3>
		<p>Clear a brand, raise the price cap, or search a broader model name.</p>
	</div>
{/if}
