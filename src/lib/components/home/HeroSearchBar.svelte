<script lang="ts">
	import { Search, SlidersHorizontal } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { bohemcarsBrand } from '$lib/data/bohemcars';
	import { brands, bodyTypes, vehicles } from '$lib/data/vehicles';

	let condition = $state('All Vehicles');
	let brand = $state('All');
	let bodyType = $state('All');
	let miles = $state('All Miles');
	let maxPrice = $state('600000');

	const conditions = ['All Vehicles', 'New Listings', 'Client Vehicles'];
	const conditionValue = $derived(
		condition === 'All Vehicles' ? 'All' : condition === 'New Listings' ? 'New' : 'Certified'
	);
</script>

<form class="hero-search" method="GET" action={resolve('/inventory')}>
	<h1>Find Your Next Bohemcars Vehicle</h1>
	<p>{bohemcarsBrand.tagline}</p>
	<div class="hero-search__tabs" role="tablist" aria-label="Inventory type">
		{#each conditions as item (item)}
			<button
				type="button"
				class={condition === item ? 'active' : ''}
				onclick={() => (condition = item)}
			>
				{item}
			</button>
		{/each}
	</div>
	<div class="hero-search__filters">
		<input type="hidden" name="condition" value={conditionValue} />
		<label>
			<span>Select Brand</span>
			<select name="brand" bind:value={brand}>
				<option value="All">All Brand</option>
				{#each brands as item (item)}
					<option>{item}</option>
				{/each}
			</select>
		</label>
		<label>
			<span>Select Model</span>
			<select name="bodyType" bind:value={bodyType}>
				<option value="All">All Model</option>
				{#each bodyTypes as item (item)}
					<option>{item}</option>
				{/each}
			</select>
		</label>
		<label>
			<span>Select Miles</span>
			<select bind:value={miles}>
				<option>All Miles</option>
				<option>0-10k</option>
				<option>10k-20k</option>
				<option>20k-50k</option>
			</select>
		</label>
		<label>
			<span>Max Price</span>
			<select name="max" bind:value={maxPrice}>
				<option value="600000">All Price</option>
				<option value="50000">0 - 50 000 EUR</option>
				<option value="80000">50 000 - 80 000 EUR</option>
				<option value="150000">80 000 - 150 000 EUR</option>
			</select>
		</label>
		<button
			class="hero-search__settings"
			type="button"
			aria-label="Open advanced filters"
			onclick={() => (miles = miles === 'All Miles' ? '0-10k' : 'All Miles')}
		>
			<SlidersHorizontal size={22} />
		</button>
		<button class="btn btn-primary hero-search__button" type="submit" aria-label="Search Cars">
			<Search size={21} />
			Show {vehicles.length} Matches
		</button>
	</div>
</form>
