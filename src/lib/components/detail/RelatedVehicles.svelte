<script lang="ts">
	import InventoryGrid from '$lib/components/inventory/InventoryGrid.svelte';
	import type { Vehicle } from '$lib/data/vehicles';

	interface Props {
		vehicles: Vehicle[];
	}

	let { vehicles }: Props = $props();
</script>

<section class="section related-vehicles">
	<div class="container">
		<div class="section-title">
			<h2>Related Vehicles</h2>
			<a class="btn btn-line" href="/inventory">View All</a>
		</div>
		<InventoryGrid {vehicles} columns={4} />
	</div>
</section>
