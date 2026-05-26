<script lang="ts">
	import { X } from '@lucide/svelte';
	import {
		bodyTypes,
		brands,
		fuels,
		type InventoryFilters,
		type VehicleCondition
	} from '$lib/data/vehicles';
	import { cn } from '$lib/utils/cn';
	import { formatPrice } from '$lib/utils/format';

	interface Props {
		open: boolean;
		filters: InventoryFilters;
		onClose: () => void;
		onChange: (filters: InventoryFilters) => void;
		onReset: () => void;
	}

	let { open, filters, onClose, onChange, onReset }: Props = $props();

	const conditions: (VehicleCondition | 'All')[] = ['All', 'New', 'Used', 'Certified'];
	const priceMarks = [50000, 80000, 150000, 600000];

	function update(next: Partial<InventoryFilters>) {
		onChange({ ...filters, ...next });
	}
</script>

<aside class={cn('filter-drawer', open && 'filter-drawer--open')} aria-label="Inventory filters">
	<button class="filter-drawer__shade" type="button" aria-label="Close filters" onclick={onClose}
	></button>
	<div class="filter-drawer__panel">
		<div class="filter-drawer__header">
			<div>
				<p class="eyebrow">Refine search</p>
				<h3>Filters</h3>
			</div>
			<button class="icon-button" type="button" aria-label="Close filters" onclick={onClose}>
				<X size={22} />
			</button>
		</div>

		<div class="filter-group">
			<p>Brand</p>
			<div class="chip-list">
				{#each ['All', ...brands] as brand (brand)}
					<button
						class={cn(
							filters.brand === brand || (!filters.brand && brand === 'All') ? 'active' : ''
						)}
						type="button"
						onclick={() => update({ brand })}
					>
						{brand}
					</button>
				{/each}
			</div>
		</div>

		<div class="filter-group">
			<p>Body Type</p>
			<div class="chip-list">
				{#each ['All', ...bodyTypes] as bodyType (bodyType)}
					<button
						class={cn(
							filters.bodyType === bodyType || (!filters.bodyType && bodyType === 'All')
								? 'active'
								: ''
						)}
						type="button"
						onclick={() => update({ bodyType })}
					>
						{bodyType}
					</button>
				{/each}
			</div>
		</div>

		<div class="filter-group">
			<p>Condition</p>
			<div class="chip-list">
				{#each conditions as condition (condition)}
					<button
						class={cn(
							filters.condition === condition || (!filters.condition && condition === 'All')
								? 'active'
								: ''
						)}
						type="button"
						onclick={() => update({ condition })}
					>
						{condition}
					</button>
				{/each}
			</div>
		</div>

		<div class="filter-group">
			<p>Fuel</p>
			<div class="chip-list">
				{#each ['All', ...fuels] as fuel (fuel)}
					<button
						class={cn(filters.fuel === fuel || (!filters.fuel && fuel === 'All') ? 'active' : '')}
						type="button"
						onclick={() => update({ fuel })}
					>
						{fuel}
					</button>
				{/each}
			</div>
		</div>

		<div class="filter-group">
			<p>Max Price</p>
			<div class="chip-list">
				{#each priceMarks as mark (mark)}
					<button
						class={cn(filters.maxPrice === mark && 'active')}
						type="button"
						onclick={() => update({ maxPrice: mark })}
					>
						{formatPrice(mark)}
					</button>
				{/each}
			</div>
		</div>

		<div class="filter-drawer__actions">
			<button class="btn btn-secondary" type="button" onclick={onReset}>Reset</button>
			<button class="btn btn-primary" type="button" onclick={onClose}>Show results</button>
		</div>
	</div>
</aside>
