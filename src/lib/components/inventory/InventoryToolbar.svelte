<script lang="ts">
	import { Grid3X3, Search, SlidersHorizontal } from '@lucide/svelte';
	import SortSelect from './SortSelect.svelte';
	import type { SortKey } from '$lib/data/vehicles';
	import { cn } from '$lib/utils/cn';

	interface Props {
		query: string;
		sort: SortKey;
		resultCount: number;
		total: number;
		columns: number;
		onQuery: (query: string) => void;
		onSort: (sort: SortKey) => void;
		onOpenFilters: () => void;
		onColumns: (columns: number) => void;
	}

	let {
		query,
		sort,
		resultCount,
		total,
		columns,
		onQuery,
		onSort,
		onOpenFilters,
		onColumns
	}: Props = $props();
</script>

<div class="inventory-toolbar">
	<div class="inventory-toolbar__left">
		<button class="btn-filter" type="button" onclick={onOpenFilters}>
			<SlidersHorizontal size={20} />
			Filters
		</button>
		<p>Showing 1 – {resultCount} of {total} Listings</p>
	</div>

	<label class="inventory-search">
		<Search size={18} />
		<input
			value={query}
			placeholder="Search by model, city, or brand"
			oninput={(event) => onQuery((event.currentTarget as HTMLInputElement).value)}
		/>
	</label>

	<div class="inventory-toolbar__right">
		<div class="grid-toggle" aria-label="Grid density">
			{#each [2, 3, 4] as count (count)}
				<button
					class={cn(columns === count && 'active')}
					type="button"
					aria-label={`${count} column grid`}
					onclick={() => onColumns(count)}
				>
					<Grid3X3 size={count === 4 ? 22 : 18} />
				</button>
			{/each}
		</div>
		<SortSelect value={sort} onChange={onSort} />
	</div>
</div>
