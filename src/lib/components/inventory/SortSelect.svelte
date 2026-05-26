<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import type { SortKey } from '$lib/data/vehicles';

	interface Props {
		value: SortKey;
		onChange: (value: SortKey) => void;
	}

	let { value, onChange }: Props = $props();

	const options: { value: SortKey; label: string }[] = [
		{ value: 'template', label: 'Lowest Price' },
		{ value: 'lowest', label: 'Price: low to high' },
		{ value: 'highest', label: 'Highest Price' },
		{ value: 'newest', label: 'Newest Year' },
		{ value: 'mileage', label: 'Lowest Mileage' }
	];
</script>

<label class="sort-select">
	<span>Sort Vehicles by</span>
	<div>
		<select
			aria-label="Sort vehicles"
			{value}
			onchange={(event) => onChange((event.currentTarget as HTMLSelectElement).value as SortKey)}
		>
			{#each options as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
		<ChevronDown size={18} />
	</div>
</label>
