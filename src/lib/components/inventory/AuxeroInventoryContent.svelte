<script lang="ts">
	import { resolve } from '$app/paths';
	import type {
		AuxeroInventoryVehicleCard as AuxeroInventoryVehicleCardData,
		AuxeroInventoryView
	} from '$lib/auxero/inventory';
	import { inventoryGridClassForView } from '$lib/auxero/inventory';
	import AuxeroInventoryVehicleCard from './AuxeroInventoryVehicleCard.svelte';

	let {
		cards,
		view
	}: {
		cards: AuxeroInventoryVehicleCardData[];
		view: AuxeroInventoryView;
	} = $props();

	const gridClass = $derived(inventoryGridClassForView(view));
	const resetHref = resolve('/inventory');
</script>

<div class="content-tab bohemcars-inventory-content">
	<div class="content-inner active">
		<div class={gridClass}>
			{#each cards as card (card.slug)}
				<AuxeroInventoryVehicleCard {card} variant={view === 'map' ? 'list' : 'grid'} />
			{:else}
				<div class="card-box card-box-style-1 bohemcars-empty-state">
					<div class="content border-light">
						<p class="h6 card-box__title mb-8">No Bohemcars vehicles match these filters</p>
						<p class="text-secondary mb-15">
							Clear filters or contact Bohemcars for a Canada import request.
						</p>
						<a href={resetHref} class="view-details">
							Reset inventory <img
								class="ml-4"
								src="/assets/icons/CaretCircleRight.svg"
								alt="reset"
							/>
						</a>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
